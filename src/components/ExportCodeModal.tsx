import { useState, useEffect, FormEvent } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Lock,
  ExternalLink,
  AlertCircle,
  KeyRound,
  Receipt,
  Link2,
  FolderArchive,
} from 'lucide-react';
import { SalesTemplate } from '../types/template';
import { generateHtmlExport, embedImageAsDataUrl } from '../utils/exportCode';
import { createSingleFileZipBlob } from '../utils/zipBuilder';

interface UnlockSuccessDetails {
  token: string;
  accessUrl?: string;
  buyerEmail?: string;
  deviceCount?: number;
  maxDevices?: number;
}

interface ExportCodeModalProps {
  template: SalesTemplate;
  selarUrl: string;
  deviceId: string;
  accessToken: string | null;
  isUnlocked: boolean;
  initialUnlockTab?: 'claim' | 'code';
  initialError?: string;
  personalAccessUrl?: string | null;
  onUnlock: (details: UnlockSuccessDetails) => void;
  onLock: () => void;
  onClose: () => void;
}

export function ExportCodeModal({
  template,
  selarUrl,
  deviceId,
  accessToken,
  isUnlocked,
  initialUnlockTab = 'claim',
  initialError = '',
  personalAccessUrl,
  onUnlock,
  onLock,
  onClose,
}: ExportCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [code, setCode] = useState<string>('');
  const [preparing, setPreparing] = useState(false);

  const [unlockTab, setUnlockTab] = useState<'claim' | 'code'>(initialUnlockTab);
  const [claimEmail, setClaimEmail] = useState('');
  const [claimOrderId, setClaimOrderId] = useState('');
  const [accessInput, setAccessInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState(initialError);

  const safeSelarUrl = selarUrl.trim() || 'https://selar.com/n57778lu4q';

  useEffect(() => {
    setVerifyError(initialError);
  }, [initialError]);

  useEffect(() => {
    if (!isUnlocked || !accessToken) {
      setCode('');
      return;
    }

    let cancelled = false;
    setPreparing(true);

    fetch('/api/access/status', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data: { unlocked?: boolean }) => {
        if (cancelled) return;
        if (!data.unlocked) {
          onLock();
          setPreparing(false);
          return;
        }
        embedImageAsDataUrl(template.heroImage).then((embeddedSrc) => {
          if (cancelled) return;
          setCode(generateHtmlExport(template, embeddedSrc));
          setPreparing(false);
        });
      })
      .catch(() => {
        if (cancelled) return;
        setPreparing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [template, isUnlocked, accessToken, onLock]);

  const handleClaimPurchase = async (e: FormEvent) => {
    e.preventDefault();
    const email = claimEmail.trim();
    const orderId = claimOrderId.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setVerifyError('Enter the email address you used when paying on Selar.');
      return;
    }
    if (!orderId) {
      setVerifyError('Enter the Order ID or Transaction Reference from your Selar receipt.');
      return;
    }

    setVerifying(true);
    setVerifyError('');

    try {
      const res = await fetch('/api/access/verify-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, orderId, deviceId }),
      });
      const data = (await res.json()) as {
        valid?: boolean;
        token?: string;
        accessUrl?: string;
        buyerEmail?: string;
        deviceCount?: number;
        maxDevices?: number;
        error?: string;
      };

      if (!res.ok || !data.valid || !data.token) {
        setVerifyError(
          data.error ||
            'Could not verify that Selar receipt yet. Double-check your Email and Order ID.'
        );
        setVerifying(false);
        return;
      }

      setVerifying(false);
      onUnlock({
        token: data.token,
        accessUrl: data.accessUrl,
        buyerEmail: data.buyerEmail,
        deviceCount: data.deviceCount,
        maxDevices: data.maxDevices,
      });
    } catch {
      setVerifyError('Unable to verify right now. Please try again.');
      setVerifying(false);
    }
  };

  const handleVerifyAccess = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = accessInput.trim();
    if (!trimmed) {
      setVerifyError('Enter your personal license key.');
      return;
    }

    setVerifying(true);
    setVerifyError('');

    try {
      const res = await fetch('/api/access/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed, deviceId }),
      });
      const data = (await res.json()) as {
        valid?: boolean;
        token?: string;
        accessUrl?: string;
        buyerEmail?: string;
        deviceCount?: number;
        maxDevices?: number;
        error?: string;
      };

      if (!res.ok || !data.valid || !data.token) {
        setVerifyError(
          data.error || 'That license key was not recognized. Try "Claim Selar Purchase" instead.'
        );
        setVerifying(false);
        return;
      }

      setAccessInput('');
      setVerifying(false);
      onUnlock({
        token: data.token,
        accessUrl: data.accessUrl,
        buyerEmail: data.buyerEmail,
        deviceCount: data.deviceCount,
        maxDevices: data.maxDevices,
      });
    } catch {
      setVerifyError('Unable to verify right now. Please try again.');
      setVerifying(false);
    }
  };

  const handleCopy = async () => {
    if (!code || !isUnlocked) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleCopyPersonalLink = async () => {
    if (!personalAccessUrl) return;
    try {
      await navigator.clipboard.writeText(personalAccessUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(false);
    }
  };

  const handleDownload = () => {
    if (!code || !isUnlocked) return;
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'index.html';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = () => {
    if (!code || !isUnlocked) return;
    const slug =
      template.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
      'sales-page';
    const blob = createSingleFileZipBlob('index.html', code);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${slug}-site.zip`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadWelcomePdf = async () => {
    if (!isUnlocked || !accessToken) return;
    try {
      const res = await fetch('/api/welcome-pdf', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'BiasharaBase-Page-Studio-Welcome.pdf';
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      // Ignore download errors
    }
  };

  const sizeKb = Math.max(1, Math.round(code.length / 1024));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isUnlocked ? 'Download Standalone Sales Page' : 'Unlock HTML Downloads'}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className={`bg-[#F4F7FA] border border-[#CFD9E4] rounded-xl w-full ${
          isUnlocked ? 'max-w-4xl max-h-[90vh]' : 'max-w-lg'
        } flex flex-col overflow-hidden shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#DCE4EE] flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-display-studio text-base font-semibold text-[#0F172A]">
              {isUnlocked
                ? 'Your Ready-to-Publish Sales Page'
                : 'Unlock Standalone HTML Downloads'}
            </h2>
            <p className="text-xs text-[#64748B] tabular-nums truncate">
              {!isUnlocked
                ? `${template.brandName} · Verified Selar license required (up to 3 devices)`
                : preparing
                  ? 'Embedding photo and wiring lead form...'
                  : `${template.brandName} · ${sizeKb} KB self-contained HTML · Inquiries wired to ${template.leadDestinationType}`}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isUnlocked && (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={preparing || !code}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#0F172A] bg-[#E2E9F2] hover:bg-[#D5DFEC] rounded-lg transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copy HTML</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={preparing || !code}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#0F172A] bg-[#E2E9F2] hover:bg-[#D5DFEC] rounded-lg transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>index.html</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={preparing || !code}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#1E293B] rounded-lg transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  <FolderArchive className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Download Publish ZIP</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close download window"
              className="p-2 text-[#475569] hover:text-[#0F172A] rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {!isUnlocked ? (
          <div className="p-6 space-y-5">
            <div className="p-5 rounded-xl border border-[#0F766E] bg-[#FAFCFE] space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                <Lock className="w-4 h-4 text-[#0F766E] shrink-0" aria-hidden="true" />
                <span>Free to preview · Instant unlock after Selar checkout</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                Purchase <strong className="font-bold text-[#0F172A]">BiasharaBase Page Studio</strong> once on Selar ($24 USD / TSh 67,500) to activate unlimited HTML exports on up to 3 devices.
              </p>
              <a
                href={safeSelarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Buy on Selar ($24 USD / TSh 67,500) & Unlock</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>

            <div className="pt-1 space-y-4">
              <div className="grid grid-cols-2 gap-1 p-1 bg-[#E2E9F2] rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setUnlockTab('claim');
                    setVerifyError('');
                  }}
                  className={`inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    unlockTab === 'claim'
                      ? 'bg-[#FAFCFE] text-[#0F172A] shadow-xs'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Claim Selar Purchase</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUnlockTab('code');
                    setVerifyError('');
                  }}
                  className={`inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    unlockTab === 'code'
                      ? 'bg-[#FAFCFE] text-[#0F172A] shadow-xs'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Enter License Key</span>
                </button>
              </div>

              {unlockTab === 'claim' ? (
                <form onSubmit={handleClaimPurchase} className="space-y-3">
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-[#475569] mb-1">
                        Email used on Selar
                      </label>
                      <input
                        type="email"
                        value={claimEmail}
                        onChange={(e) => setClaimEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FAFCFE] border border-[#C4D0DC] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#0F766E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#475569] mb-1">
                        Selar Order ID / Reference (from your receipt)
                      </label>
                      <input
                        type="text"
                        value={claimOrderId}
                        onChange={(e) => setClaimOrderId(e.target.value)}
                        placeholder="e.g. SLR-12345678"
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FAFCFE] border border-[#C4D0DC] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#0F766E]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={verifying}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#1E293B] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {verifying ? 'Verifying Selar Receipt...' : 'Verify Payment & Get Personal Link'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyAccess} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={accessInput}
                      onChange={(e) => setAccessInput(e.target.value)}
                      placeholder="BBPS-XXXX-XXXX-XXXX"
                      autoComplete="off"
                      className="flex-1 min-w-0 px-3.5 py-2.5 text-sm bg-[#FAFCFE] border border-[#C4D0DC] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#0F766E]"
                    />
                    <button
                      type="submit"
                      disabled={verifying}
                      className="px-4 py-2.5 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#1E293B] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {verifying ? 'Checking...' : 'Unlock'}
                    </button>
                  </div>
                </form>
              )}

              {verifyError && (
                <div role="alert" className="flex items-start gap-1.5 text-xs font-medium text-red-600">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{verifyError}</span>
                </div>
              )}
              <p className="text-[11px] text-[#64748B]">
                Each purchase unlocks up to 3 browsers/devices and generates your private 1-click bookmark link.
              </p>
            </div>
          </div>
        ) : (
          <>
            {personalAccessUrl && (
              <div className="px-6 py-3 bg-[#F0FDFA] border-b border-[#99F6E4] flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex items-center gap-2 text-xs text-[#0F172A]">
                  <Link2 className="w-4 h-4 text-[#0F766E] shrink-0" aria-hidden="true" />
                  <span className="font-medium">Your Personal Access Link (save for up to 3 devices):</span>
                </div>
                <div className="flex items-center gap-2 max-w-full">
                  <code className="px-2.5 py-1 text-[11px] bg-[#FAFCFE] border border-[#99F6E4] rounded-md text-[#0F766E] truncate max-w-[260px]">
                    {personalAccessUrl}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyPersonalLink}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-md cursor-pointer shrink-0"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3 h-3" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" aria-hidden="true" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step-by-Step Publishing Guide */}
            <div className="px-6 py-4 bg-[#EDF2F7] border-b border-[#DCE4EE] space-y-3 text-xs">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <div className="font-semibold text-[#0F172A] mb-0.5">01. Download Publish ZIP</div>
                  <p className="text-[#475569]">
                    Includes <span className="font-medium">index.html</span> with your photo, styling, WhatsApp link, and form bundled inside.
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-[#0F172A] mb-0.5">02. Drop onto any web host</div>
                  <p className="text-[#475569]">
                    Drag the ZIP onto Netlify Drop, Cloudflare Pages, or cPanel to put your page online in minutes.
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-[#0F172A] mb-0.5">03. Share your live link</div>
                  <p className="text-[#475569]">
                    Paste your new URL into WhatsApp, Instagram bio, or ads and start collecting inquiries.
                  </p>
                </div>
              </div>
              {(/kestrel-engine\.com|acme\.com|meridian-advisory\.com|bauer-precision\.com|ledgercheck\.io/i.test(
                template.leadDestinationValue
              ) ||
                (!template.checkoutUrl?.trim() &&
                  !template.mobileMoneyNote?.trim() &&
                  !template.whatsappOrderNumber?.trim())) && (
                <div className="px-3 py-2 rounded-lg bg-[#FEF3C7] border border-[#F59E0B]/40 text-[#92400E] text-[11px]">
                  Tip before publishing: Make sure you updated the sample contact email/WhatsApp or payment details inside the editor.
                </div>
              )}
            </div>

            <div className="flex-1 overflow-auto bg-[#111317] p-6">
              {preparing ? (
                <div className="text-xs text-[#A1A1AA]">Preparing self-contained HTML file...</div>
              ) : (
                <pre className="tpl-mono text-xs text-[#E4E4E7] leading-relaxed whitespace-pre-wrap break-words">
                  <code>{code}</code>
                </pre>
              )}
            </div>

            <div className="px-6 py-2.5 bg-[#EDF2F7] border-t border-[#DCE4EE] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#64748B]">
              <span>Licensed access active · Unlimited HTML downloads</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleDownloadWelcomePdf}
                  className="text-[#0F766E] hover:text-[#115E59] font-medium underline underline-offset-2 cursor-pointer"
                >
                  Download Welcome PDF (for Selar)
                </button>
                <button
                  type="button"
                  onClick={onLock}
                  className="text-[#475569] hover:text-[#0F172A] underline underline-offset-2 cursor-pointer"
                >
                  Lock exports
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
