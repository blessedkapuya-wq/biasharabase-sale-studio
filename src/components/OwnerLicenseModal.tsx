import { useState, useEffect, FormEvent } from 'react';
import {
  X,
  Copy,
  Check,
  ShieldCheck,
  LogOut,
  Plus,
  RotateCcw,
  Ban,
  CheckCircle2,
  AlertCircle,
  Link2,
} from 'lucide-react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';

interface OwnerLicenseItem {
  id: number;
  buyerEmail: string;
  buyerName: string;
  selarOrderId: string;
  licenseKey: string;
  amountPaid: string;
  currency: string;
  status: string;
  maxDevices: number;
  deviceCount: number;
  source: string;
  createdAt: string;
  accessUrl: string;
}

interface OwnerLicenseModalProps {
  onClose: () => void;
}

export function OwnerLicenseModal({ onClose }: OwnerLicenseModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [licenses, setLicenses] = useState<OwnerLicenseItem[]>([]);

  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          setIdToken(token);
        } catch {
          setIdToken(null);
        }
      } else {
        setIdToken(null);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const loadLicenses = async (token: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/owner/licenses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as {
        webhookUrl?: string;
        redirectUrl?: string;
        licenses?: OwnerLicenseItem[];
        error?: string;
      };
      if (!res.ok) {
        setError(data.error || 'Unable to load licenses.');
        setLoading(false);
        return;
      }
      setWebhookUrl(data.webhookUrl || '');
      setRedirectUrl(data.redirectUrl || '');
      setLicenses(data.licenses || []);
    } catch {
      setError('Unable to reach server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idToken) {
      loadLicenses(idToken);
    }
  }, [idToken]);

  const handleSignIn = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const token = await result.user.getIdToken();
      setIdToken(token);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Google sign-in was cancelled.'
      );
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setIdToken(null);
    setLicenses([]);
  };

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(key);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  };

  const handleIssueManual = async (e: FormEvent) => {
    e.preventDefault();
    if (!idToken) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) {
      setError('Enter a valid buyer email address.');
      return;
    }

    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/owner/licenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          buyerEmail: newEmail.trim(),
          buyerName: newName.trim(),
        }),
      });
      const data = (await res.json()) as {
        license?: OwnerLicenseItem;
        error?: string;
      };
      if (!res.ok || !data.license) {
        setError(data.error || 'Failed to issue personal link.');
        setCreating(false);
        return;
      }
      setLicenses((prev) => [data.license!, ...prev]);
      setNewEmail('');
      setNewName('');
    } catch {
      setError('Unable to create license right now.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (item: OwnerLicenseItem) => {
    if (!idToken) return;
    const nextStatus = item.status === 'active' ? 'revoked' : 'active';
    try {
      const res = await fetch(`/api/owner/licenses/${item.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) return;
      setLicenses((prev) =>
        prev.map((lic) =>
          lic.id === item.id ? { ...lic, status: nextStatus } : lic
        )
      );
    } catch {
      // Ignore error
    }
  };

  const handleResetDevices = async (item: OwnerLicenseItem) => {
    if (!idToken) return;
    try {
      const res = await fetch(`/api/owner/licenses/${item.id}/reset-devices`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) return;
      setLicenses((prev) =>
        prev.map((lic) =>
          lic.id === item.id ? { ...lic, deviceCount: 0 } : lic
        )
      );
    } catch {
      // Ignore error
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Owner License & Selar Webhook Manager"
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#F4F7FA] border border-[#CFD9E4] rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#DCE4EE] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#0F766E] shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-display-studio text-base font-semibold text-[#0F172A]">
                Owner Licenses & Selar Webhook
              </h2>
              <p className="text-xs text-[#64748B]">
                Each Selar sale issues a personal access link capped at 3 devices.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#475569] hover:text-[#0F172A] bg-[#E2E9F2] rounded-lg cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sign out</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close owner license manager"
              className="p-2 text-[#475569] hover:text-[#0F172A] rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {!authReady ? (
            <p className="text-xs text-[#64748B]">Checking owner session...</p>
          ) : !user ? (
            <div className="p-8 rounded-xl border border-[#CFD9E4] bg-[#FAFCFE] text-center space-y-4 max-w-md mx-auto">
              <h3 className="font-display-studio text-base font-semibold text-[#0F172A]">
                Sign in with your Owner Google Account
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Sign in with <strong className="font-semibold text-[#0F172A]">blessedkapuya@gmail.com</strong> to view your Selar webhook URL, copy personal buyer links, or revoke leaked keys.
              </p>
              <button
                type="button"
                onClick={handleSignIn}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors cursor-pointer"
              >
                Sign in with Google
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div
                  role="alert"
                  className="p-3.5 rounded-lg border border-red-200 bg-red-50 flex items-center gap-2 text-xs font-medium text-red-700"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              {/* Selar Webhook & Redirect Setup */}
              <div className="p-5 rounded-xl border border-[#0F766E] bg-[#FAFCFE] space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display-studio text-sm font-semibold text-[#0F172A]">
                    1. Paste These Two URLs Into Selar
                  </h3>
                  <span className="text-[11px] font-medium text-[#0F766E]">
                    Automatic post-payment flow
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="font-medium text-[#334155] mb-1">
                      Selar Integrations → Webhooks (<span className="font-semibold">New Sale</span>):
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={webhookUrl || 'Loading...'}
                        className="flex-1 min-w-0 px-3 py-2 text-xs font-mono bg-[#EDF2F7] border border-[#CFD9E4] rounded-lg text-[#0F172A]"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy('webhook', webhookUrl)}
                        disabled={!webhookUrl}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F172A] bg-[#E2E9F2] hover:bg-[#D5DFEC] rounded-lg cursor-pointer shrink-0"
                      >
                        {copiedId === 'webhook' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-[#334155] mb-1">
                      Selar Product Settings → <span className="font-semibold">External Redirect URL after purchase</span>:
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={redirectUrl || 'Loading...'}
                        className="flex-1 min-w-0 px-3 py-2 text-xs font-mono bg-[#EDF2F7] border border-[#CFD9E4] rounded-lg text-[#0F172A]"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy('redirect', redirectUrl)}
                        disabled={!redirectUrl}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F172A] bg-[#E2E9F2] hover:bg-[#D5DFEC] rounded-lg cursor-pointer shrink-0"
                      >
                        {copiedId === 'redirect' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-1">
                      Right after paying on Selar, buyers are sent here to enter their Selar Email + Order ID and immediately get their personal 3-device access link.
                    </p>
                  </div>
                </div>
              </div>

              {/* Manual Issue Personal Access Link */}
              <form
                onSubmit={handleIssueManual}
                className="p-5 rounded-xl border border-[#CFD9E4] bg-[#FAFCFE] space-y-3"
              >
                <h3 className="font-display-studio text-sm font-semibold text-[#0F172A]">
                  2. Issue a Personal 3-Device Access Link Manually
                </h3>
                <div className="grid sm:grid-cols-12 gap-2.5">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="buyer@company.com"
                    className="sm:col-span-5 px-3 py-2 text-xs bg-[#F4F7FA] border border-[#C4D0DC] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#0F766E]"
                  />
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Buyer name (optional)"
                    className="sm:col-span-4 px-3 py-2 text-xs bg-[#F4F7FA] border border-[#C4D0DC] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#0F766E]"
                  />
                  <button
                    type="submit"
                    disabled={creating}
                    className="sm:col-span-3 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#1E293B] rounded-lg cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{creating ? 'Creating...' : 'Create Link'}</span>
                  </button>
                </div>
              </form>

              {/* Issued Buyer Licenses */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display-studio text-sm font-semibold text-[#0F172A]">
                    3. Customer Licenses ({licenses.length})
                  </h3>
                  {loading && <span className="text-xs text-[#64748B]">Refreshing...</span>}
                </div>

                {licenses.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-[#CFD9E4] bg-[#FAFCFE] text-center text-xs text-[#64748B]">
                    No buyer licenses recorded yet. When a customer pays on Selar (or you issue a link above), it appears here.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {licenses.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-[#CFD9E4] bg-[#FAFCFE] flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-[#0F172A] truncate">
                              {item.buyerEmail}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${
                                item.status === 'active'
                                  ? 'bg-[#CCFBF1] text-[#0F766E]'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {item.status === 'active' ? 'Active' : 'Revoked'}
                            </span>
                            <span className="text-[11px] font-medium text-[#475569] tabular-nums">
                              {item.deviceCount}/{item.maxDevices} devices
                            </span>
                          </div>
                          <div className="text-[11px] text-[#64748B] flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[#334155]">{item.licenseKey}</span>
                            <span>·</span>
                            <span>Order: {item.selarOrderId}</span>
                            {item.buyerName && (
                              <>
                                <span>·</span>
                                <span>{item.buyerName}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopy(`lic-${item.id}`, item.accessUrl)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-[#0F172A] bg-[#E2E9F2] hover:bg-[#D5DFEC] rounded-md cursor-pointer"
                          >
                            {copiedId === `lic-${item.id}` ? (
                              <>
                                <Check className="w-3 h-3 text-[#0F766E]" aria-hidden="true" />
                                <span>Copied Link</span>
                              </>
                            ) : (
                              <>
                                <Link2 className="w-3 h-3" aria-hidden="true" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>

                          {item.deviceCount > 0 && (
                            <button
                              type="button"
                              onClick={() => handleResetDevices(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-[#334155] bg-[#EDF2F7] hover:bg-[#E2E9F2] rounded-md cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" aria-hidden="true" />
                              <span>Reset Devices</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-md cursor-pointer ${
                              item.status === 'active'
                                ? 'text-red-700 bg-red-50 hover:bg-red-100'
                                : 'text-[#0F766E] bg-[#F0FDFA] hover:bg-[#CCFBF1]'
                            }`}
                          >
                            {item.status === 'active' ? (
                              <>
                                <Ban className="w-3 h-3" aria-hidden="true" />
                                <span>Revoke</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                                <span>Reactivate</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
