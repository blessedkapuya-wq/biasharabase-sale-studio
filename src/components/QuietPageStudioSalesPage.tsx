import { useState, FormEvent, useRef } from 'react';
import {
  Check,
  X as XIcon,
  ShieldCheck,
  ChevronDown,
  AlertCircle,
  ArrowRight,
  Download,
  ExternalLink,
} from 'lucide-react';
import { QUIET_PAGE_STUDIO_TEMPLATE } from '../data/studioSalesTemplate';
import { HeroStudioShowcase } from './HeroStudioShowcase';
import { FinishedPageExampleShowcase } from './FinishedPageExampleShowcase';

interface QuietPageStudioSalesPageProps {
  selarUrl: string;
  onSelarUrlChange: (url: string) => void;
  onLaunchBuilder: (templateId?: string) => void;
  onExportSelfHtml: () => void;
  onOpenOwnerLicenses: () => void;
}

export function QuietPageStudioSalesPage({
  selarUrl,
  onSelarUrlChange,
  onLaunchBuilder,
  onExportSelfHtml,
  onOpenOwnerLicenses,
}: QuietPageStudioSalesPageProps) {
  const tpl = QUIET_PAGE_STUDIO_TEMPLATE;
  const [openFaqId, setOpenFaqId] = useState<string | null>(tpl.faqs[0]?.id || null);

  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState<{
    name: string;
    email: string;
    mailtoHref: string;
  } | null>(null);

  const pricingRef = useRef<HTMLElement | null>(null);
  const safeSelarHref = selarUrl.trim() || 'https://selar.com/n57778lu4q';
  const primaryTier = tpl.pricingTiers[0];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = buyerName.trim();
    const trimmedEmail = buyerEmail.trim();
    const trimmedNotes = buyerNotes.trim();
    if (!trimmedName) {
      setFormError('Enter your full name to continue.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError('Enter a valid email address (e.g. you@company.com).');
      return;
    }
    setFormError('');

    const subject = encodeURIComponent(`BiasharaBase Page Studio question from ${trimmedName}`);
    const body = encodeURIComponent(
      `Name: ${trimmedName}\nReply Email: ${trimmedEmail}\n\nQuestion:\n${trimmedNotes || '(No additional notes)'}`
    );
    const mailtoHref = `mailto:${tpl.leadDestinationValue}?subject=${subject}&body=${body}`;

    const anchor = document.createElement('a');
    anchor.href = mailtoHref;
    anchor.click();

    setSubmitted({
      name: trimmedName,
      email: trimmedEmail,
      mailtoHref,
    });
  };

  return (
    <main className="bg-[#E8EEF5] text-[#0F172A] tpl-body">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-14 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-sm mb-3.5">
              <strong className="font-bold text-[#0F172A]">BiasharaBase Page Studio</strong>
              <span className="text-[#0F766E] font-medium"> · For Digital Product & Service Sellers</span>
            </p>
            <h1 className="font-display-studio text-[clamp(2.25rem,3.6vw,3.35rem)] font-semibold tracking-tight leading-[1.08] text-balance text-[#0F172A] mb-5">
              {tpl.heroHeadline}
            </h1>
            <p className="text-base md:text-lg text-[#475569] leading-relaxed mb-8 max-w-xl">
              {tpl.heroSubheadline}
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onLaunchBuilder()}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Preview Builder Free</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <a
                href={safeSelarHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#0F172A] bg-[#FAFCFE] border border-[#C4D0DC] hover:border-[#0F172A] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <span>Download Your Finished Page — $24</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
            <p className="text-xs text-[#475569] mt-4 leading-relaxed">
              {tpl.secondaryNote}
            </p>
          </div>

          <div className="lg:col-span-6">
            <HeroStudioShowcase onLaunchBuilder={onLaunchBuilder} />
          </div>
        </div>

        {/* Full-Width 4-Column KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-14 pt-10 border-t border-[#CFD9E4]">
          {tpl.kpiStrip.map((kpi, idx) => (
            <div key={idx}>
              <div className="font-display-studio text-2xl md:text-3xl font-semibold tabular-nums tracking-tight text-[#0F172A]">
                {kpi.value}
              </div>
              <div className="text-xs md:text-sm text-[#475569] mt-1 leading-snug">
                {kpi.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Before vs After Contrast */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[#CFD9E4]">
        <h2 className="font-display-studio text-2xl md:text-3xl font-semibold tracking-tight text-balance max-w-2xl mb-10">
          Why founders switch from bloated monthly builders to{' '}
          <strong className="font-bold text-[#0F172A]">BiasharaBase Page Studio</strong>.
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-7 rounded-xl border border-[#CFD9E4] bg-[#F4F7FA]">
            <h3 className="font-display-studio text-base font-semibold text-[#475569] mb-4">
              {tpl.beforeTitle}
            </h3>
            <ul className="space-y-3 text-sm text-[#475569]">
              {tpl.beforePoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <XIcon className="w-4 h-4 mt-0.5 shrink-0 opacity-60" aria-hidden="true" />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-7 rounded-xl border border-[#0F766E] bg-[#F4F7FA]">
            <h3 className="font-display-studio text-base font-semibold text-[#0F172A] mb-4">
              What you get with <strong className="font-bold">BiasharaBase Page Studio</strong>
            </h3>
            <ul className="space-y-3 text-sm text-[#0F172A]">
              {tpl.afterPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#0F766E]" aria-hidden="true" />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What your $24 unlocks + Verified Free vs. Paid Comparison */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[#CFD9E4]">
        <div className="max-w-2xl mb-10">
          <h2 className="font-display-studio text-2xl md:text-3xl font-semibold tracking-tight text-balance mb-3">
            What your $24 USD (TSh 67,500) unlocks
          </h2>
          <p className="text-base text-[#475569] leading-relaxed">
            Try the editor in your browser for free first. Pay <strong className="font-semibold text-[#0F172A]">$24 USD (TSh 67,500) once</strong> when you are ready to export your finished webpage and put it online.
          </p>
        </div>

        {/* Verified Free vs Paid Distinction */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-7 rounded-xl border border-[#CFD9E4] bg-[#F4F7FA]">
            <div className="text-xs font-semibold text-[#475569] mb-1">
              Free in your browser ($0 / TSh 0)
            </div>
            <h3 className="font-display-studio text-lg font-semibold text-[#0F172A] mb-4">
              Build and preview before you pay
            </h3>
            <ul className="space-y-2.5 text-sm text-[#475569]">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#475569]" aria-hidden="true" />
                <span>Choose from all 4 templates (Digital Product, Service Package, Workshop, Idea Test)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#475569]" aria-hidden="true" />
                <span>Edit headlines, pricing, photos, FAQs, and WhatsApp or email links</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#475569]" aria-hidden="true" />
                <span>Preview live across desktop, tablet, and mobile screens</span>
              </li>
            </ul>
          </div>

          <div className="p-7 rounded-xl border border-[#0F766E] bg-[#F4F7FA]">
            <div className="text-xs font-semibold text-[#0F766E] mb-1">
              Paid access ($24 USD / TSh 67,500 one-time)
            </div>
            <h3 className="font-display-studio text-lg font-semibold text-[#0F172A] mb-4">
              Download, publish, and own your HTML file
            </h3>
            <ul className="space-y-2.5 text-sm text-[#0F172A]">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#0F766E]" aria-hidden="true" />
                <span>Download a publish-ready ZIP (<span className="font-mono text-xs">index.html</span>), copy HTML, and add WhatsApp or Mobile Money details</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#0F766E]" aria-hidden="true" />
                <span>Receive step-by-step instructions to upload to Netlify Drop, Cloudflare Pages, or any web host (hosting is separate—zero monthly fees)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#0F766E]" aria-hidden="true" />
                <span>Unlock exports right after Selar checkout using your receipt Email + Order ID on up to 3 devices (30-day money-back guarantee)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Clear Distinction: Owning Your Exported Webpage vs. Hosting It Online */}
        <div className="p-7 rounded-xl border border-[#CFD9E4] bg-[#FAFCFE] mb-8 grid md:grid-cols-2 gap-8">
          <div>
            <div className="text-xs font-semibold text-[#0F766E] mb-1.5">
              1. What you buy and own forever
            </div>
            <h3 className="font-display-studio text-base font-semibold text-[#0F172A] mb-2">
              An exported HTML webpage you control
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              Your $24 USD (TSh 67,500) one-time license lets you build and export unlimited standalone <span className="font-mono text-xs text-[#0F172A]">index.html</span> files and Publish ZIPs. You keep the code, photos, and pages permanently with zero ongoing fees to BiasharaBase.
            </p>
          </div>
          <div className="md:border-l md:border-[#DCE4EE] md:pl-8">
            <div className="text-xs font-semibold text-[#475569] mb-1.5">
              2. How hosting works (separate from Page Studio)
            </div>
            <h3 className="font-display-studio text-base font-semibold text-[#0F172A] mb-2">
              Upload to any free or paid host for a live link
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              BiasharaBase Page Studio is a page builder and exporter—it does <strong className="font-semibold text-[#0F172A]">not</strong> host your website or include a custom domain. To put your downloaded ZIP online, drag it onto a free static host like Netlify Drop or Cloudflare Pages (or your existing cPanel) in minutes using our included guide.
            </p>
          </div>
        </div>

        {/* 4 Deliverables Bento */}
        <div className="grid md:grid-cols-3 gap-6">
          {tpl.capabilities.map((cap) => (
            <div
              key={cap.id}
              className={`${
                cap.span === 2 ? 'md:col-span-2' : 'md:col-span-1'
              } p-7 rounded-xl border border-[#CFD9E4] bg-[#F4F7FA] flex flex-col justify-between gap-5`}
            >
              <div>
                <h3 className="font-display-studio text-lg font-semibold text-[#0F172A] mb-2.5">
                  {cap.title}
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">{cap.description}</p>
              </div>
              <div className="text-xs font-medium text-[#475569] pt-4 border-t border-[#DCE4EE]">
                {cap.deliverable}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Complete Finished Sales Page Example (Desktop + Mobile) */}
      <FinishedPageExampleShowcase onLaunchBuilder={onLaunchBuilder} />

      {/* Proof & Case Studies */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[#CFD9E4]">
        <div className="max-w-2xl mb-10">
          <h2 className="font-display-studio text-2xl md:text-3xl font-semibold tracking-tight text-balance mb-3">
            {tpl.proofHeading}
          </h2>
          <p className="text-base text-[#475569] leading-relaxed">{tpl.proofIntro}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {tpl.proofCases.map((item) => (
            <article
              key={item.id}
              className="p-7 rounded-xl border border-[#CFD9E4] bg-[#F4F7FA] flex flex-col justify-between gap-6"
            >
              <div>
                <div className="text-xs text-[#64748B] mb-2">
                  <span>{item.client}</span>
                  <span aria-hidden="true" className="mx-1.5">·</span>
                  <span>{item.sector}</span>
                </div>
                <div className="font-display-studio text-xl font-semibold tabular-nums text-[#0F766E] mb-3">
                  {item.metric}
                </div>
                <p className="text-sm text-[#475569] mb-5 leading-relaxed">{item.context}</p>
                <blockquote className="text-sm text-[#0F172A] leading-relaxed">
                  “{item.quote}”
                </blockquote>
              </div>
              <div className="pt-4 border-t border-[#DCE4EE] text-xs text-[#475569]">
                <span className="font-semibold text-[#0F172A]">{item.authorName}</span>
                <span aria-hidden="true" className="mx-1.5">·</span>
                <span>{item.authorRole}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Single Clear $24 USD Selar Offer + Guarantee */}
      <section id="qps-pricing" ref={pricingRef} className="max-w-6xl mx-auto px-6 py-16 border-t border-[#CFD9E4]">
        <div className="max-w-2xl mb-10">
          <h2 className="font-display-studio text-2xl md:text-3xl font-semibold tracking-tight text-balance mb-3">
            {tpl.pricingHeading}
          </h2>
          <p className="text-base text-[#475569] leading-relaxed">
            Checkout is handled securely through Selar using Card, M-Pesa, Paystack, Bank Transfer, or Mobile Money.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6 mb-8 items-stretch">
          <div className="md:col-span-7 p-8 rounded-xl border border-[#0F766E] bg-[#F4F7FA] flex flex-col justify-between gap-8">
            <div>
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <h3 className="font-display-studio text-2xl font-bold text-[#0F172A]">
                  BiasharaBase Page Studio — Full Access
                </h3>
                <span className="text-xs font-medium text-[#0F766E] whitespace-nowrap">
                  Instant access
                </span>
              </div>
              <p className="text-sm text-[#475569] mb-6 leading-relaxed">{primaryTier.summary}</p>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-6">
                <span className="font-display-studio text-4xl font-semibold tabular-nums text-[#0F172A]">
                  $24 USD
                </span>
                <span className="font-display-studio text-2xl font-semibold tabular-nums text-[#0F766E]">
                  · TSh 67,500
                </span>
                <span className="text-sm text-[#64748B]">one-time payment on Selar</span>
              </div>
              <ul className="space-y-3 text-sm text-[#334155]">
                {primaryTier.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#0F766E]" aria-hidden="true" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5">
              <a
                href={safeSelarHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 text-sm font-semibold rounded-lg bg-[#0F766E] text-white hover:bg-[#115E59] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Download Your Finished Page — $24</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
              <p className="text-center text-xs text-[#64748B]">
                $24 USD (TSh 67,500) one-time on Selar (Card, M-Pesa, Mobile Money) · 30-day guarantee
              </p>
            </div>
          </div>

          <div className="md:col-span-5 p-8 rounded-xl border border-[#CFD9E4] bg-[#F4F7FA] flex flex-col justify-between gap-6">
            <div>
              <ShieldCheck className="w-6 h-6 text-[#0F766E] mb-4" aria-hidden="true" />
              <h3 className="font-display-studio text-lg font-semibold text-[#0F172A] mb-2">
                {tpl.guaranteeTitle}
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Buy <strong className="font-bold text-[#0F172A]">BiasharaBase Page Studio</strong> on Selar for $24 USD (TSh 67,500), customize your page, and download your HTML. If it does not save you hours or help you ship a cleaner, clearer sales page within 30 days, reply to your Selar receipt for a full refund.
              </p>
            </div>
            <div className="pt-5 border-t border-[#DCE4EE]">
              <p className="text-xs text-[#475569] mb-3">
                Want to test how easy it is before paying?
              </p>
              <button
                type="button"
                onClick={() => onLaunchBuilder()}
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#0F172A] bg-[#DCE5F0] hover:bg-[#CEDAE8] rounded-lg transition-colors cursor-pointer"
              >
                Preview Editor Free Before Paying
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[#CFD9E4]">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <h2 className="font-display-studio text-2xl md:text-3xl font-semibold tracking-tight text-balance">
              {tpl.faqHeading}
            </h2>
          </div>
          <div className="md:col-span-8 space-y-3">
            {tpl.faqs.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#CFD9E4] bg-[#F4F7FA] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-[#0F172A]">{item.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-[#64748B] transition-transform duration-150 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-[#475569] leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Decision CTA Strip */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="p-8 md:p-10 rounded-xl border border-[#0F766E] bg-[#F4F7FA] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="font-display-studio text-2xl font-semibold tracking-tight text-[#0F172A] mb-2">
              Ready to build your sales page draft in minutes?
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Pay <strong className="font-bold text-[#0F172A]">$24 USD (TSh 67,500) once</strong> on Selar for instant email access to <strong className="font-bold text-[#0F172A]">BiasharaBase Page Studio</strong>, all 4 editable templates, and standalone HTML downloads—with zero monthly fees.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onLaunchBuilder()}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>Preview Builder Free</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <a
              href={safeSelarHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-3.5 text-sm font-semibold text-[#0F172A] bg-[#FAFCFE] border border-[#C4D0DC] hover:border-[#0F172A] rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Download Your Finished Page — $24</span>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Question / Team Invoice Form */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[#CFD9E4]">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5">
            <h2 className="font-display-studio text-2xl md:text-3xl font-semibold tracking-tight text-balance mb-3">
              {tpl.captureHeading}
            </h2>
            <p className="text-sm md:text-base text-[#475569] leading-relaxed">
              {tpl.captureSubheading}
            </p>
          </div>

          <div className="md:col-span-7">
            {submitted ? (
              <div className="p-7 rounded-xl border border-[#0F766E] bg-[#F4F7FA]">
                <div className="flex items-center gap-2.5 mb-2">
                  <Check className="w-5 h-5 shrink-0 text-[#0F766E]" aria-hidden="true" />
                  <h3 className="font-display-studio text-lg font-semibold text-[#0F172A]">
                    Question sent for {submitted.name}
                  </h3>
                </div>
                <p className="text-sm text-[#475569] leading-relaxed mb-5">
                  Your email app has been opened to send your question from <span className="font-medium text-[#0F172A]">{submitted.email}</span> to <span className="font-medium text-[#0F172A]">{tpl.leadDestinationValue}</span>.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={submitted.mailtoHref}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors"
                  >
                    Open Email App Again
                  </a>
                  <a
                    href={safeSelarHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-semibold text-[#0F172A] bg-[#FAFCFE] border border-[#C4D0DC] hover:border-[#0F172A] rounded-lg transition-colors"
                  >
                    Go to Selar Checkout ($24 / TSh 67,500)
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(null);
                      setBuyerName('');
                      setBuyerEmail('');
                      setBuyerNotes('');
                    }}
                    className="px-4 py-2 text-xs font-medium text-[#334155] border border-[#CBD6E2] rounded-lg hover:bg-[#FAFCFE] cursor-pointer"
                  >
                    Ask another question
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="p-7 rounded-xl border border-[#CFD9E4] bg-[#F4F7FA] space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1.5">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Amina Hassan"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAFCFE] border border-[#C4D0DC] rounded-lg outline-none focus:border-[#0F766E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="amina@company.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAFCFE] border border-[#C4D0DC] rounded-lg outline-none focus:border-[#0F766E]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#475569] mb-1.5">
                    Your question
                  </label>
                  <textarea
                    rows={2}
                    value={buyerNotes}
                    onChange={(e) => setBuyerNotes(e.target.value)}
                    placeholder="Ask about Selar payment options, team licenses, or templates..."
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAFCFE] border border-[#C4D0DC] rounded-lg outline-none focus:border-[#0F766E]"
                  />
                </div>
                {formError && (
                  <div role="alert" className="flex items-center gap-2 text-xs font-medium text-red-600">
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{formError}</span>
                  </div>
                )}
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors cursor-pointer"
                >
                  {tpl.captureButtonLabel}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Owner Selar Link & Self-Export Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-10 border-t border-[#CFD9E4] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs text-[#64748B]">
        <span>
          <strong className="font-bold text-[#0F172A]">BiasharaBase Page Studio</strong> · {tpl.footerContact}
        </span>
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <label className="text-[#475569] font-medium whitespace-nowrap">
            Selar link:
          </label>
          <input
            type="url"
            value={selarUrl}
            onChange={(e) => onSelarUrlChange(e.target.value)}
            placeholder="https://selar.com/n57778lu4q"
            className="flex-1 lg:w-64 px-3 py-1.5 text-xs text-[#0F172A] bg-[#FAFCFE] border border-[#C4D0DC] rounded-md outline-none focus:border-[#0F766E]"
          />
          <button
            type="button"
            onClick={onExportSelfHtml}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#1E293B] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Download This Sales Page as HTML</span>
          </button>
          <button
            type="button"
            onClick={onOpenOwnerLicenses}
            className="px-3 py-1.5 text-xs font-medium text-[#0F766E] bg-[#F0FDFA] border border-[#99F6E4] hover:bg-[#CCFBF1] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Owner Licenses
          </button>
        </div>
      </footer>
    </main>
  );
}
