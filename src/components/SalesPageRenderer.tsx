import { useState, FormEvent, useRef } from 'react';
import {
  Check,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  X as XIcon,
  MessageCircle,
  Smartphone,
} from 'lucide-react';
import { SalesTemplate, SectionId } from '../types/template';
import { ResilientImage } from './ResilientImage';

interface SalesPageRendererProps {
  template: SalesTemplate;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  onSelectSection?: (sectionId: SectionId) => void;
  demoMode?: boolean;
}

const FONT_CLASS_MAP: Record<SalesTemplate['fontPairing'], string> = {
  'jakarta-dm': 'font-pair-jakarta-dm',
  'bricolage-manrope': 'font-pair-bricolage-manrope',
  'outfit-public': 'font-pair-outfit-public',
  'archivo-public': 'font-pair-archivo-public',
  'playfair-dm': 'font-pair-playfair-dm',
};

export function SalesPageRenderer({
  template,
  viewportMode,
  onSelectSection,
  demoMode = false,
}: SalesPageRendererProps) {
  const [billingIndex, setBillingIndex] = useState<0 | 1>(0);
  const [selectedTierName, setSelectedTierName] = useState<string>('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(template.faqs[0]?.id || null);
  const [demoActionMessage, setDemoActionMessage] = useState<string>('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<{
    name: string;
    email: string;
    tier: string;
  } | null>(null);

  const captureRef = useRef<HTMLElement | null>(null);

  const isDark = template.surface === 'obsidian-dark';
  const isStone = template.surface === 'warm-stone';

  const canvasClass = isDark
    ? 'bg-[#0B0C0E] text-[#F4F4F5]'
    : isStone
      ? 'bg-[#F2EFE9] text-[#18181B]'
      : 'bg-[#E8EEF5] text-[#0F172A]';

  const cardSurfaceClass = isDark
    ? 'bg-[#131519] border-[#262930]'
    : isStone
      ? 'bg-[#E8E4DC] border-[#D5CFC2]'
      : 'bg-[#F4F7FA] border-[#CFD9E4]';

  const mutedTextClass = isDark ? 'text-[#A1A1AA]' : 'text-[#475569]';
  const subtleBorderClass = isDark ? 'border-[#262930]' : isStone ? 'border-[#D5CFC2]' : 'border-[#CFD9E4]';
  const inputClass = isDark
    ? 'bg-[#111317] border-[#2C3038] text-[#F4F4F5] placeholder-[#71717A] focus:border-[#A1A1AA]'
    : isStone
      ? 'bg-[#FAF9F6] border-[#CEC9BC] text-[#18181B] placeholder-[#78716C] focus:border-[#57534E]'
      : 'bg-[#FAFCFE] border-[#C4D0DC] text-[#0F172A] placeholder-[#64748B] focus:border-[#475569]';

  const isMobilePreview = viewportMode === 'mobile';
  const isTabletPreview = viewportMode === 'tablet';

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(`tpl-${template.id}-${sectionId}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDemoButtonClick = (label: string) => {
    setDemoActionMessage(
      `Demo preview only ("${label}"): No real purchase was made. When you build your own page, this button links to your own Selar checkout or inquiry form.`
    );
  };

  const handleChooseTier = (tierName: string, ctaLabel?: string) => {
    if (demoMode) {
      handleDemoButtonClick(ctaLabel || tierName);
      return;
    }
    setSelectedTierName(tierName);
    setSubmittedRecord(null);
    captureRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = formName.trim();
    const trimmedEmail = formEmail.trim();
    if (!trimmedName) {
      setFormError('Enter your full name to continue.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setFormError('Enter a valid email address (e.g. name@company.com).');
      return;
    }
    setFormError('');
    setSubmittedRecord({
      name: trimmedName,
      email: trimmedEmail,
      tier: selectedTierName || template.pricingTiers[0]?.name || 'General Inquiry',
    });
  };

  const renderSection = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'hero':
        return (
          <section
            key="hero"
            id={`tpl-${template.id}-hero`}
            onClick={() => onSelectSection?.('hero')}
            className={`max-w-6xl mx-auto px-6 ${isMobilePreview ? 'py-10' : 'py-16 lg:py-20'}`}
          >
            <div
              className={
                template.heroVariant === 'split-media' && !isMobilePreview && !isTabletPreview
                  ? 'grid lg:grid-cols-12 gap-12 items-stretch'
                  : template.heroVariant === 'split-media'
                    ? 'grid gap-10'
                    : 'max-w-3xl mx-auto text-center'
              }
            >
              <div
                className={
                  template.heroVariant === 'split-media' && !isMobilePreview && !isTabletPreview
                    ? 'lg:col-span-6 flex flex-col justify-center'
                    : ''
                }
              >
                <p className={`text-sm font-medium ${mutedTextClass} mb-4`}>
                  {template.heroEyebrow}
                </p>
                <h1
                  className={`tpl-display font-semibold tracking-tight leading-[1.08] text-balance mb-5 ${
                    isMobilePreview ? 'text-3xl' : 'text-[clamp(2.25rem,3.6vw,3.35rem)]'
                  } ${isDark ? 'tracking-[-0.015em]' : ''}`}
                >
                  {template.heroHeadline}
                </h1>
                <p
                  className={`tpl-body text-base ${mutedTextClass} leading-relaxed mb-8 ${
                    template.heroVariant === 'editorial-centered' ? 'mx-auto max-w-2xl' : 'max-w-xl'
                  }`}
                >
                  {template.heroSubheadline}
                </p>
                <div
                  className={`flex flex-wrap items-center gap-4 ${
                    template.heroVariant === 'editorial-centered' ? 'justify-center' : ''
                  }`}
                >
                  {demoMode ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDemoButtonClick(template.primaryCtaLabel);
                      }}
                      style={{ backgroundColor: template.accentColor }}
                      className="px-6 py-3 text-sm font-semibold text-white rounded-lg transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {template.primaryCtaLabel}
                    </button>
                  ) : template.checkoutUrl?.trim() ? (
                    <a
                      href={template.checkoutUrl.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{ backgroundColor: template.accentColor }}
                      className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white rounded-lg transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap shrink-0"
                    >
                      {template.primaryCtaLabel}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToSection('capture');
                      }}
                      style={{ backgroundColor: template.accentColor }}
                      className="px-6 py-3 text-sm font-semibold text-white rounded-lg transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {template.primaryCtaLabel}
                    </button>
                  )}
                  <span className={`text-xs ${mutedTextClass}`}>{template.trustMarker}</span>
                </div>
                <p className={`text-xs ${mutedTextClass} mt-4`}>{template.secondaryNote}</p>
              </div>

              <div
                className={
                  template.heroVariant === 'split-media' && !isMobilePreview && !isTabletPreview
                    ? 'lg:col-span-6'
                    : 'mt-8'
                }
              >
                <ResilientImage
                  src={template.heroImage}
                  alt={template.heroImageAlt}
                  isDark={isDark}
                  className={`w-full rounded-xl object-cover border ${subtleBorderClass} ${
                    template.heroVariant === 'split-media' && !isMobilePreview && !isTabletPreview
                      ? 'lg:h-full min-h-[320px] max-h-[460px]'
                      : 'aspect-video'
                  }`}
                />
              </div>
            </div>

            <div
              className={`grid ${
                isMobilePreview ? 'grid-cols-2 gap-6' : 'grid-cols-2 lg:grid-cols-4 gap-8'
              } mt-14 pt-10 border-t ${subtleBorderClass}`}
            >
              {template.kpiStrip.map((kpi, idx) => (
                <div key={idx}>
                  <div className="tpl-display text-2xl md:text-3xl font-semibold tabular-nums tracking-tight">
                    {kpi.value}
                  </div>
                  <div className={`text-xs md:text-sm ${mutedTextClass} mt-1 leading-snug`}>
                    {kpi.label}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'contrast':
        return (
          <section
            key="contrast"
            id={`tpl-${template.id}-contrast`}
            onClick={() => onSelectSection?.('contrast')}
            className={`max-w-6xl mx-auto px-6 py-16 border-t ${subtleBorderClass}`}
          >
            <h2 className="tpl-display text-2xl md:text-3xl font-semibold tracking-tight text-balance max-w-2xl mb-10">
              {template.contrastHeading}
            </h2>
            <div className={`grid ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-2'} gap-6`}>
              <div className={`p-7 rounded-xl border ${cardSurfaceClass}`}>
                <h3 className={`tpl-display text-base font-semibold mb-4 ${mutedTextClass}`}>
                  {template.beforeTitle}
                </h3>
                <ul className="space-y-3 text-sm">
                  {template.beforePoints.map((pt, idx) => (
                    <li key={idx} className={`flex items-start gap-2.5 ${mutedTextClass}`}>
                      <XIcon className="w-4 h-4 mt-0.5 shrink-0 opacity-60" aria-hidden="true" />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={`p-7 rounded-xl border ${cardSurfaceClass}`}
                style={{ borderColor: template.accentColor }}
              >
                <h3 className="tpl-display text-base font-semibold mb-4">
                  {template.afterTitle}
                </h3>
                <ul className="space-y-3 text-sm">
                  {template.afterPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: isDark ? '#FBBF24' : template.accentColor }}
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        );

      case 'capabilities':
        return (
          <section
            key="capabilities"
            id={`tpl-${template.id}-capabilities`}
            onClick={() => onSelectSection?.('capabilities')}
            className={`max-w-6xl mx-auto px-6 py-16 border-t ${subtleBorderClass}`}
          >
            <div className="max-w-2xl mb-10">
              <h2 className="tpl-display text-2xl md:text-3xl font-semibold tracking-tight text-balance mb-3">
                {template.capabilitiesHeading}
              </h2>
              <p className={`text-base ${mutedTextClass} leading-relaxed`}>
                {template.capabilitiesIntro}
              </p>
            </div>
            <div className={`grid ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'} gap-6`}>
              {template.capabilities.map((cap) => (
                <div
                  key={cap.id}
                  className={`${
                    !isMobilePreview && cap.span === 2 ? 'md:col-span-2' : 'md:col-span-1'
                  } p-7 rounded-xl border ${cardSurfaceClass} flex flex-col justify-between gap-5`}
                >
                  <div>
                    <h3 className="tpl-display text-lg font-semibold mb-2.5">{cap.title}</h3>
                    <p className={`text-sm ${mutedTextClass} leading-relaxed`}>{cap.description}</p>
                  </div>
                  <div className={`text-xs font-medium ${mutedTextClass} pt-4 border-t ${subtleBorderClass}`}>
                    {cap.deliverable}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'proof':
        return (
          <section
            key="proof"
            id={`tpl-${template.id}-proof`}
            onClick={() => onSelectSection?.('proof')}
            className={`max-w-6xl mx-auto px-6 py-16 border-t ${subtleBorderClass}`}
          >
            <div className="max-w-2xl mb-10">
              <h2 className="tpl-display text-2xl md:text-3xl font-semibold tracking-tight text-balance mb-3">
                {template.proofHeading}
              </h2>
              <p className={`text-base ${mutedTextClass} leading-relaxed`}>
                {template.proofIntro}
              </p>
            </div>
            <div className={`grid ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-2'} gap-6`}>
              {template.proofCases.map((item) => (
                <article
                  key={item.id}
                  className={`p-7 rounded-xl border ${cardSurfaceClass} flex flex-col justify-between gap-6`}
                >
                  <div>
                    <div className={`text-xs ${mutedTextClass} mb-2`}>
                      <span>{item.client}</span>
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      <span>{item.sector}</span>
                    </div>
                    <div
                      className="tpl-display text-xl font-semibold tabular-nums mb-3"
                      style={{ color: isDark ? '#FBBF24' : template.accentColor }}
                    >
                      {item.metric}
                    </div>
                    <p className={`text-sm ${mutedTextClass} mb-5 leading-relaxed`}>
                      {item.context}
                    </p>
                    <blockquote className="text-sm leading-relaxed">
                      “{item.quote}”
                    </blockquote>
                  </div>
                  <div className={`pt-4 border-t ${subtleBorderClass} text-xs ${mutedTextClass}`}>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                      {item.authorName}
                    </span>
                    <span aria-hidden="true" className="mx-1.5">·</span>
                    <span>{item.authorRole}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'pricing':
        return (
          <section
            key="pricing"
            id={`tpl-${template.id}-pricing`}
            onClick={() => onSelectSection?.('pricing')}
            className={`max-w-6xl mx-auto px-6 py-16 border-t ${subtleBorderClass}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
              <h2 className="tpl-display text-2xl md:text-3xl font-semibold tracking-tight text-balance max-w-xl">
                {template.pricingHeading}
              </h2>
              <div
                className={`inline-flex items-center p-1 rounded-lg border ${subtleBorderClass} ${
                  isDark ? 'bg-[#131519]' : 'bg-[#E2E9F2]'
                } shrink-0 self-start sm:self-auto`}
              >
                {template.pricingBillingLabels.map((label, idx) => {
                  const active = billingIndex === idx;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBillingIndex(idx as 0 | 1);
                      }}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? isDark
                            ? 'bg-[#262930] text-white'
                            : 'bg-[#FAFCFE] text-[#0F172A] shadow-xs'
                          : `${mutedTextClass} hover:opacity-80`
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`grid ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-2'} gap-6 mb-8`}>
              {template.pricingTiers.map((tier) => {
                const price = billingIndex === 0 ? tier.monthlyPrice : tier.annualPrice;
                const isSelected = selectedTierName === tier.name;
                return (
                  <div
                    key={tier.id}
                    className={`p-7 rounded-xl border flex flex-col justify-between gap-8 transition-colors duration-150 ${cardSurfaceClass}`}
                    style={
                      isSelected || tier.highlighted
                        ? { borderColor: template.accentColor }
                        : undefined
                    }
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-4 mb-2">
                        <h3 className="tpl-display text-xl font-semibold">{tier.name}</h3>
                        {tier.highlighted && (
                          <span
                            className="text-xs font-medium whitespace-nowrap"
                            style={{ color: isDark ? '#FBBF24' : template.accentColor }}
                          >
                            Most popular
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${mutedTextClass} mb-6 leading-relaxed`}>
                        {tier.summary}
                      </p>
                      <div className="flex items-baseline gap-2 mb-6">
                        <span className="tpl-display text-3xl font-semibold tabular-nums">
                          {price}
                        </span>
                        <span className={`text-xs ${mutedTextClass}`}>{tier.unitLabel}</span>
                      </div>
                      <ul className="space-y-3 text-sm">
                        {tier.features.map((feat, fIdx) => (
                          <li key={fIdx} className={`flex items-start gap-2.5 ${mutedTextClass}`}>
                            <Check
                              className="w-4 h-4 mt-0.5 shrink-0"
                              style={{ color: isDark ? '#FBBF24' : template.accentColor }}
                              aria-hidden="true"
                            />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {demoMode ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDemoButtonClick(tier.ctaLabel);
                        }}
                        style={
                          tier.highlighted
                            ? { backgroundColor: template.accentColor, color: '#FFFFFF' }
                            : undefined
                        }
                        className={`w-full py-2.5 px-4 text-sm font-semibold rounded-lg transition-opacity duration-150 hover:opacity-90 whitespace-nowrap cursor-pointer ${
                          tier.highlighted
                            ? ''
                            : isDark
                              ? 'bg-[#20232A] text-white hover:bg-[#2A2E37]'
                              : 'bg-[#E2E8F0] text-[#0F172A] hover:bg-[#CBD5E1]'
                        }`}
                      >
                        {tier.ctaLabel}
                      </button>
                    ) : template.checkoutUrl?.trim() ? (
                      <a
                        href={template.checkoutUrl.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={
                          tier.highlighted
                            ? { backgroundColor: template.accentColor, color: '#FFFFFF' }
                            : undefined
                        }
                        className={`w-full py-2.5 px-4 text-sm font-semibold rounded-lg transition-opacity duration-150 hover:opacity-90 whitespace-nowrap flex items-center justify-center ${
                          tier.highlighted
                            ? ''
                            : isDark
                              ? 'bg-[#20232A] text-white hover:bg-[#2A2E37]'
                              : 'bg-[#E2E8F0] text-[#0F172A] hover:bg-[#CBD5E1]'
                        }`}
                      >
                        {tier.ctaLabel}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChooseTier(tier.name, tier.ctaLabel);
                        }}
                        style={
                          tier.highlighted || isSelected
                            ? { backgroundColor: template.accentColor, color: '#FFFFFF' }
                            : undefined
                        }
                        className={`w-full py-2.5 px-4 text-sm font-semibold rounded-lg transition-opacity duration-150 hover:opacity-90 whitespace-nowrap cursor-pointer ${
                          tier.highlighted || isSelected
                            ? ''
                            : isDark
                              ? 'bg-[#20232A] text-white hover:bg-[#2A2E37]'
                              : 'bg-[#E2E8F0] text-[#0F172A] hover:bg-[#CBD5E1]'
                        }`}
                      >
                        {isSelected ? `Selected: ${tier.name}` : tier.ctaLabel}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Optional Direct Mobile Money / Bank Instructions */}
            {template.mobileMoneyNote?.trim() && (
              <div className={`p-5 rounded-xl border ${cardSurfaceClass} flex items-start gap-3.5 mb-6`}>
                <Smartphone
                  className="w-5 h-5 mt-0.5 shrink-0"
                  style={{ color: isDark ? '#FBBF24' : template.accentColor }}
                  aria-hidden="true"
                />
                <div>
                  <h3 className="tpl-display text-sm font-semibold mb-1">
                    Direct Mobile Money / Bank Payment
                  </h3>
                  <p className={`text-sm ${mutedTextClass} leading-relaxed whitespace-pre-line`}>
                    {template.mobileMoneyNote.trim()}
                  </p>
                </div>
              </div>
            )}

            {/* Risk-Reversal Guarantee Callout */}
            <div className={`p-6 rounded-xl border ${cardSurfaceClass} flex items-start gap-4`}>
              <ShieldCheck
                className="w-5 h-5 mt-0.5 shrink-0"
                style={{ color: isDark ? '#FBBF24' : template.accentColor }}
                aria-hidden="true"
              />
              <div>
                <h3 className="tpl-display text-base font-semibold mb-1">
                  {template.guaranteeTitle}
                </h3>
                <p className={`text-sm ${mutedTextClass} leading-relaxed`}>
                  {template.guaranteeBody}
                </p>
              </div>
            </div>
          </section>
        );

      case 'faq':
        return (
          <section
            key="faq"
            id={`tpl-${template.id}-faq`}
            onClick={() => onSelectSection?.('faq')}
            className={`max-w-6xl mx-auto px-6 py-16 border-t ${subtleBorderClass}`}
          >
            <div className="grid md:grid-cols-12 gap-10">
              <div className="md:col-span-4">
                <h2 className="tpl-display text-2xl md:text-3xl font-semibold tracking-tight text-balance">
                  {template.faqHeading}
                </h2>
              </div>
              <div className="md:col-span-8 space-y-3">
                {template.faqs.map((item) => {
                  const isOpen = openFaqId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border ${cardSurfaceClass} overflow-hidden`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenFaqId(isOpen ? null : item.id);
                        }}
                        aria-expanded={isOpen}
                        className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <span className="text-sm font-semibold">{item.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 transition-transform duration-150 ${
                            isOpen ? 'rotate-180' : ''
                          } ${mutedTextClass}`}
                          aria-hidden="true"
                        />
                      </button>
                      {isOpen && (
                        <div className={`px-6 pb-5 text-sm ${mutedTextClass} leading-relaxed`}>
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case 'capture':
        return (
          <section
            key="capture"
            ref={captureRef}
            id={`tpl-${template.id}-capture`}
            onClick={() => onSelectSection?.('capture')}
            className={`max-w-6xl mx-auto px-6 py-16 border-t ${subtleBorderClass}`}
          >
            <div className="grid md:grid-cols-12 gap-10 items-start">
              <div className="md:col-span-5">
                <h2 className="tpl-display text-2xl md:text-3xl font-semibold tracking-tight text-balance mb-3">
                  {template.captureHeading}
                </h2>
                <p className={`text-sm md:text-base ${mutedTextClass} leading-relaxed`}>
                  {template.captureSubheading}
                </p>
                {selectedTierName && (
                  <p className={`text-xs font-medium mt-4 ${mutedTextClass}`}>
                    Selected option:{' '}
                    <span className={isDark ? 'text-white' : 'text-[#111827]'}>
                      {selectedTierName}
                    </span>
                  </p>
                )}
              </div>

              <div className="md:col-span-7">
                {submittedRecord ? (
                  <div className={`p-7 rounded-xl border ${cardSurfaceClass}`}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <Check
                        className="w-5 h-5 shrink-0"
                        style={{ color: isDark ? '#FBBF24' : template.accentColor }}
                        aria-hidden="true"
                      />
                      <h3 className="tpl-display text-lg font-semibold">
                        Inquiry logged for {submittedRecord.name}
                      </h3>
                    </div>
                    <p className={`text-sm ${mutedTextClass} leading-relaxed mb-5`}>
                      {demoMode
                        ? 'Demo inquiry preview only — no real message or order was sent. '
                        : `Inquiry preview logged for ${submittedRecord.tier} (${submittedRecord.email}). `}
                      On your exported webpage, submissions route via{' '}
                      <span className="font-medium">
                        {template.leadDestinationType === 'formspree'
                          ? 'Formspree'
                          : template.leadDestinationType === 'whatsapp'
                            ? 'WhatsApp'
                            : 'Email'}
                      </span>
                      {template.leadDestinationValue ? ` (${template.leadDestinationValue})` : ''}.
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSubmittedRecord(null);
                        setFormName('');
                        setFormEmail('');
                        setFormNotes('');
                      }}
                      className={`px-4 py-2 text-xs font-medium rounded-lg border ${subtleBorderClass} hover:opacity-80 cursor-pointer`}
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleFormSubmit}
                    onClick={(e) => e.stopPropagation()}
                    noValidate
                    className={`p-7 rounded-xl border ${cardSurfaceClass} space-y-4`}
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${mutedTextClass}`}>
                          Full name
                        </label>
                        <input
                          type="text"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Jordan Mercer"
                          className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition-colors ${inputClass}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${mutedTextClass}`}>
                          Work email
                        </label>
                        <input
                          type="email"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          placeholder="jordan@company.com"
                          className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition-colors ${inputClass}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${mutedTextClass}`}>
                        Project details or questions
                      </label>
                      <textarea
                        rows={3}
                        value={formNotes}
                        onChange={(e) => setFormNotes(e.target.value)}
                        placeholder="Share what you need and your target timeline..."
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition-colors ${inputClass}`}
                      />
                    </div>
                    {formError && (
                      <div
                        role="alert"
                        className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>{formError}</span>
                      </div>
                    )}
                    <button
                      type="submit"
                      style={{ backgroundColor: template.accentColor }}
                      className="px-6 py-3 text-sm font-semibold text-white rounded-lg transition-opacity duration-150 hover:opacity-90 whitespace-nowrap cursor-pointer"
                    >
                      {template.captureButtonLabel}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        );

      case 'footer':
        return (
          <footer
            key="footer"
            id={`tpl-${template.id}-footer`}
            onClick={() => onSelectSection?.('footer')}
            className={`max-w-6xl mx-auto px-6 py-10 border-t ${subtleBorderClass} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${mutedTextClass}`}
          >
            <span>{template.footerLegal}</span>
            <span>{template.footerContact}</span>
          </footer>
        );
    }
  };

  return (
    <div
      className={`tpl-body transition-colors duration-200 ${FONT_CLASS_MAP[template.fontPairing]} ${canvasClass}`}
    >
      {demoMode && (
        <div className="px-4 py-2 bg-[#0F172A] text-[#F8FAFC] text-[11px] flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B]">
          <span className="font-semibold">
            DEMONSTRATION SAMPLE — Example offer & pricing shown (not Page Studio checkout)
          </span>
          <span className="text-[#94A3B8]">
            Buttons below are safe previews
          </span>
        </div>
      )}

      {demoMode && demoActionMessage && (
        <div
          role="status"
          className="sticky top-0 z-30 px-4 py-2.5 bg-[#CCFBF1] text-[#0F172A] border-b border-[#0F766E] text-xs flex items-center justify-between gap-3"
        >
          <span>{demoActionMessage}</span>
          <button
            type="button"
            onClick={() => setDemoActionMessage('')}
            className="text-[11px] font-semibold underline underline-offset-2 shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Template Internal 3-Zone Top Navigation */}
      <header
        className={`max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-8 border-b ${subtleBorderClass}`}
      >
        <a
          href={`#tpl-${template.id}-hero`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero');
          }}
          className="tpl-display text-lg font-semibold tracking-tight whitespace-nowrap shrink-0"
        >
          {template.brandName}
        </a>

        {!isMobilePreview && (
          <nav className={`hidden md:flex items-center gap-6 text-sm ${mutedTextClass}`}>
            {template.navLinks.slice(0, 4).map((link, idx) => {
              const targetIds = ['contrast', 'capabilities', 'pricing', 'capture'];
              return (
                <a
                  key={link}
                  href={`#tpl-${template.id}-${targetIds[idx] || 'hero'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(targetIds[idx] || 'hero');
                  }}
                  className="hover:underline underline-offset-4 whitespace-nowrap shrink-0 transition-opacity"
                >
                  {link}
                </a>
              );
            })}
          </nav>
        )}

        {demoMode ? (
          <button
            type="button"
            onClick={() => handleDemoButtonClick(template.primaryCtaLabel)}
            style={{ backgroundColor: template.accentColor }}
            className="px-4 py-2 text-xs font-semibold text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
          >
            {template.primaryCtaLabel}
          </button>
        ) : template.checkoutUrl?.trim() ? (
          <a
            href={template.checkoutUrl.trim()}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: template.accentColor }}
            className="px-4 py-2 text-xs font-semibold text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
          >
            {template.primaryCtaLabel}
          </a>
        ) : (
          <button
            type="button"
            onClick={() => scrollToSection('capture')}
            style={{ backgroundColor: template.accentColor }}
            className="px-4 py-2 text-xs font-semibold text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
          >
            {template.primaryCtaLabel}
          </button>
        )}
      </header>

      <div>
        {template.sections.filter((s) => s.enabled).map((s) => renderSection(s.id))}
      </div>

      {(() => {
        const waDigits = (template.whatsappOrderNumber || '').replace(/[^0-9]/g, '');
        if (!waDigits) return null;
        if (demoMode) {
          return (
            <div className="sticky bottom-4 flex justify-end px-6 pb-4 pointer-events-none">
              <button
                type="button"
                onClick={() => handleDemoButtonClick('Order on WhatsApp')}
                className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#15803D] hover:bg-[#166534] rounded-lg shadow-lg transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Order on WhatsApp</span>
              </button>
            </div>
          );
        }
        const waHref = `https://wa.me/${waDigits}?text=${encodeURIComponent(
          `Hi, I'm interested in ${template.brandName}`
        )}`;
        return (
          <div className="sticky bottom-4 flex justify-end px-6 pb-4 pointer-events-none">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#15803D] hover:bg-[#166534] rounded-lg shadow-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        );
      })()}
    </div>
  );
}
