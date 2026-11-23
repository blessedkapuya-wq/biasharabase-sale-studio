import { useState, ChangeEvent } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  RotateCcw,
  BookmarkPlus,
  Check,
  Upload,
  ChevronDown,
  Plus,
  Trash2,
  Download,
  FolderOpen,
} from 'lucide-react';
import { SalesTemplate, SectionId, LeadDestinationType } from '../types/template';
import { ACCENT_PRESETS, FONT_PAIRINGS, SURFACE_OPTIONS, INITIAL_TEMPLATES } from '../data/templates';

interface TemplateEditorRailProps {
  template: SalesTemplate;
  onChange: (updated: SalesTemplate) => void;
  onReset: () => void;
  onSaveSnapshot: (name: string) => void;
  onImportTemplate: (imported: SalesTemplate) => void;
}

export function TemplateEditorRail({
  template,
  onChange,
  onReset,
  onSaveSnapshot,
  onImportTemplate,
}: TemplateEditorRailProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'offer' | 'design'>('content');
  const [openContentGroup, setOpenContentGroup] = useState<
    'basics' | 'kpis' | 'contrast' | 'proof'
  >('basics');
  const [openOfferGroup, setOpenOfferGroup] = useState<'checkout' | 'tiers' | 'faq'>('checkout');
  const [snapshotName, setSnapshotName] = useState('');
  const [justSaved, setJustSaved] = useState(false);
  const [importError, setImportError] = useState('');

  const updateField = <K extends keyof SalesTemplate>(key: K, value: SalesTemplate[K]) => {
    onChange({ ...template, [key]: value });
  };

  const updateKpi = (idx: number, field: 'value' | 'label', val: string) => {
    const updated = template.kpiStrip.map((item, i) =>
      i === idx ? { ...item, [field]: val } : item
    );
    updateField('kpiStrip', updated);
  };

  const updateComparisonPoint = (
    listKey: 'beforePoints' | 'afterPoints',
    idx: number,
    val: string
  ) => {
    const updated = template[listKey].map((pt, i) => (i === idx ? val : pt));
    updateField(listKey, updated);
  };

  const updateProofCase = (
    id: string,
    field: 'client' | 'metric' | 'quote' | 'authorName' | 'authorRole',
    val: string
  ) => {
    const updated = template.proofCases.map((item) =>
      item.id === id ? { ...item, [field]: val } : item
    );
    updateField('proofCases', updated);
  };

  const updatePricingTier = (
    id: string,
    field: 'name' | 'summary' | 'monthlyPrice' | 'annualPrice' | 'unitLabel' | 'ctaLabel',
    val: string
  ) => {
    const updated = template.pricingTiers.map((tier) =>
      tier.id === id ? { ...tier, [field]: val } : tier
    );
    updateField('pricingTiers', updated);
  };

  const updateTierFeatures = (id: string, rawText: string) => {
    const features = rawText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const updated = template.pricingTiers.map((tier) =>
      tier.id === id ? { ...tier, features } : tier
    );
    updateField('pricingTiers', updated);
  };

  const updateFaq = (id: string, field: 'question' | 'answer', value: string) => {
    const updated = template.faqs.map((faq) =>
      faq.id === id ? { ...faq, [field]: value } : faq
    );
    updateField('faqs', updated);
  };

  const addFaq = () => {
    const nextFaq = {
      id: `faq-${Date.now()}`,
      question: 'New question from buyers',
      answer: 'Clear, direct answer that removes buyer hesitation.',
    };
    updateField('faqs', [...template.faqs, nextFaq]);
  };

  const removeFaq = (id: string) => {
    if (template.faqs.length <= 1) return;
    updateField(
      'faqs',
      template.faqs.filter((f) => f.id !== id)
    );
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('heroImage', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = () => {
    const original = INITIAL_TEMPLATES.find((t) => t.id === template.id);
    if (original) {
      updateField('heroImage', original.heroImage);
    }
  };

  const toggleSection = (id: SectionId) => {
    const updated = template.sections.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    updateField('sections', updated);
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= template.sections.length) return;
    const copy = [...template.sections];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    updateField('sections', copy);
  };

  const handleSave = () => {
    const label = snapshotName.trim() || `${template.brandName} Draft`;
    onSaveSnapshot(label);
    setSnapshotName('');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleExportProjectJson = () => {
    const payload = JSON.stringify(template, null, 2);
    const blob = new Blob([payload], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${template.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'page'}-project.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImportProjectJson = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '')) as Partial<SalesTemplate>;
        if (!parsed.id || !parsed.brandName || !parsed.heroHeadline || !Array.isArray(parsed.sections)) {
          setImportError('That file is not a valid BiasharaBase Page Studio project.');
          return;
        }
        setImportError('');
        onImportTemplate(parsed as SalesTemplate);
      } catch {
        setImportError('Unable to read that .json project file.');
      }
    };
    reader.readAsText(file);
  };

  const destinationPlaceholder =
    template.leadDestinationType === 'formspree'
      ? 'https://formspree.io/f/your-form-id'
      : template.leadDestinationType === 'whatsapp'
        ? '+254700000000'
        : 'you@yourbusiness.com';

  const inputClass =
    'w-full px-3 py-2 text-sm bg-[#FAFCFE] border border-[#C4D0DC] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#0F172A]';
  const compactInputClass =
    'w-full px-2.5 py-1.5 text-xs bg-[#FAFCFE] border border-[#C4D0DC] rounded-md text-[#0F172A] focus:outline-none focus:border-[#0F172A]';

  return (
    <aside className="w-full lg:w-[364px] shrink-0 bg-[#F4F7FA] border border-[#CFD9E4] rounded-xl flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[#DCE4EE] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-[#0F172A] truncate">{template.name}</h2>
          <p className="text-xs text-[#64748B] truncate">{template.productLink}</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          title="Reset to sample text"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#475569] hover:text-[#0F172A] bg-[#E2E9F2] rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      {/* 3 Simple Tabs: Content, Offer & FAQ, Design */}
      <div className="p-2 border-b border-[#DCE4EE] bg-[#EDF2F7]">
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#E2E9F2] rounded-lg">
          {([
            { id: 'content', label: 'Content' },
            { id: 'offer', label: 'Offer & FAQ' },
            { id: 'design', label: 'Design' },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#FAFCFE] text-[#0F172A] shadow-xs'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-310px)]">
        {activeTab === 'content' && (
          <>
            {/* Group 1: Core Headlines & Inquiry Routing */}
            <div className="rounded-lg border border-[#CFD9E4] bg-[#EDF2F7] overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setOpenContentGroup(openContentGroup === 'basics' ? 'kpis' : 'basics')
                }
                className="w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-2 cursor-pointer"
              >
                <span className="text-xs font-semibold text-[#0F172A]">
                  Headlines & Inquiry Form
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#64748B] transition-transform ${
                    openContentGroup === 'basics' ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {openContentGroup === 'basics' && (
                <div className="p-3.5 pt-2 bg-[#F4F7FA] border-t border-[#DCE4EE] space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Your Business Name
                    </label>
                    <input
                      type="text"
                      value={template.brandName}
                      onChange={(e) => updateField('brandName', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Who Is This For?
                    </label>
                    <input
                      type="text"
                      value={template.heroEyebrow}
                      onChange={(e) => updateField('heroEyebrow', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Main Headline (The Big Promise)
                    </label>
                    <textarea
                      rows={3}
                      value={template.heroHeadline}
                      onChange={(e) => updateField('heroHeadline', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Short Explanation
                    </label>
                    <textarea
                      rows={3}
                      value={template.heroSubheadline}
                      onChange={(e) => updateField('heroSubheadline', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="pt-2 border-t border-[#DCE4EE]">
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Where should customer inquiries go?
                    </label>
                    <p className="text-[11px] text-[#64748B] mb-2">
                      Wired directly into your contact form on HTML download.
                    </p>
                    <div className="grid grid-cols-3 gap-1.5 mb-2">
                      {([
                        { id: 'email', label: 'Email' },
                        { id: 'formspree', label: 'Formspree' },
                        { id: 'whatsapp', label: 'WhatsApp' },
                      ] as const).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            updateField('leadDestinationType', opt.id as LeadDestinationType)
                          }
                          className={`py-1.5 px-2 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                            template.leadDestinationType === opt.id
                              ? 'bg-[#0F172A] text-white border-[#0F172A]'
                              : 'bg-[#FAFCFE] text-[#334155] border-[#C4D0DC] hover:border-[#0F172A]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={template.leadDestinationValue}
                      onChange={(e) => updateField('leadDestinationValue', e.target.value)}
                      placeholder={destinationPlaceholder}
                      className={inputClass}
                    />
                  </div>

                  <div className="pt-2 border-t border-[#DCE4EE]">
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Floating WhatsApp Order Button (Optional)
                    </label>
                    <input
                      type="text"
                      value={template.whatsappOrderNumber || ''}
                      onChange={(e) => updateField('whatsappOrderNumber', e.target.value)}
                      placeholder="e.g. 255712345678 (shows chat button)"
                      className={inputClass}
                    />
                    <p className="text-[11px] text-[#64748B] mt-1">
                      Add your country code + phone number to show a quick WhatsApp order button on the page.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Group 2: 4 Key Numbers (KPI Strip) */}
            <div className="rounded-lg border border-[#CFD9E4] bg-[#EDF2F7] overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setOpenContentGroup(openContentGroup === 'kpis' ? 'basics' : 'kpis')
                }
                className="w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-2 cursor-pointer"
              >
                <span className="text-xs font-semibold text-[#0F172A]">
                  Key Numbers ({template.kpiStrip.length} Stats)
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#64748B] transition-transform ${
                    openContentGroup === 'kpis' ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {openContentGroup === 'kpis' && (
                <div className="p-3.5 pt-2 bg-[#F4F7FA] border-t border-[#DCE4EE] space-y-2.5">
                  {template.kpiStrip.map((kpi, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-[#CFD9E4] bg-[#EDF2F7] space-y-1.5"
                    >
                      <input
                        type="text"
                        value={kpi.value}
                        onChange={(e) => updateKpi(idx, 'value', e.target.value)}
                        placeholder="Stat number (e.g. 12 hrs)"
                        className={`${compactInputClass} font-semibold`}
                      />
                      <input
                        type="text"
                        value={kpi.label}
                        onChange={(e) => updateKpi(idx, 'label', e.target.value)}
                        placeholder="Short description"
                        className={compactInputClass}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Group 3: Before vs After Comparison */}
            <div className="rounded-lg border border-[#CFD9E4] bg-[#EDF2F7] overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setOpenContentGroup(openContentGroup === 'contrast' ? 'basics' : 'contrast')
                }
                className="w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-2 cursor-pointer"
              >
                <span className="text-xs font-semibold text-[#0F172A]">
                  Before vs. After Points
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#64748B] transition-transform ${
                    openContentGroup === 'contrast' ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {openContentGroup === 'contrast' && (
                <div className="p-3.5 pt-2 bg-[#F4F7FA] border-t border-[#DCE4EE] space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#475569] mb-1">
                      Comparison Headline
                    </label>
                    <input
                      type="text"
                      value={template.contrastHeading}
                      onChange={(e) => updateField('contrastHeading', e.target.value)}
                      className={compactInputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-[#334155]">
                      Old Way (Before)
                    </label>
                    <input
                      type="text"
                      value={template.beforeTitle}
                      onChange={(e) => updateField('beforeTitle', e.target.value)}
                      className={compactInputClass}
                    />
                    {template.beforePoints.map((pt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={pt}
                        onChange={(e) =>
                          updateComparisonPoint('beforePoints', idx, e.target.value)
                        }
                        className={compactInputClass}
                      />
                    ))}
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-[#DCE4EE]">
                    <label className="block text-[11px] font-semibold text-[#0F766E]">
                      With Your Offer (After)
                    </label>
                    <input
                      type="text"
                      value={template.afterTitle}
                      onChange={(e) => updateField('afterTitle', e.target.value)}
                      className={compactInputClass}
                    />
                    {template.afterPoints.map((pt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={pt}
                        onChange={(e) =>
                          updateComparisonPoint('afterPoints', idx, e.target.value)
                        }
                        className={compactInputClass}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Group 4: Customer Proof & Testimonials */}
            <div className="rounded-lg border border-[#CFD9E4] bg-[#EDF2F7] overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setOpenContentGroup(openContentGroup === 'proof' ? 'basics' : 'proof')
                }
                className="w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-2 cursor-pointer"
              >
                <span className="text-xs font-semibold text-[#0F172A]">
                  Customer Proof & Quotes ({template.proofCases.length})
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#64748B] transition-transform ${
                    openContentGroup === 'proof' ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {openContentGroup === 'proof' && (
                <div className="p-3.5 pt-2 bg-[#F4F7FA] border-t border-[#DCE4EE] space-y-3">
                  {template.proofCases.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg border border-[#CFD9E4] bg-[#EDF2F7] space-y-1.5"
                    >
                      <div className="text-[11px] font-semibold text-[#475569]">
                        Customer #{idx + 1}
                      </div>
                      <input
                        type="text"
                        value={item.client}
                        onChange={(e) => updateProofCase(item.id, 'client', e.target.value)}
                        placeholder="Company or client name"
                        className={compactInputClass}
                      />
                      <input
                        type="text"
                        value={item.metric}
                        onChange={(e) => updateProofCase(item.id, 'metric', e.target.value)}
                        placeholder="Key result (e.g. +42% Sales)"
                        className={`${compactInputClass} font-semibold`}
                      />
                      <textarea
                        rows={2}
                        value={item.quote}
                        onChange={(e) => updateProofCase(item.id, 'quote', e.target.value)}
                        placeholder="Customer quote..."
                        className={compactInputClass}
                      />
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={item.authorName}
                          onChange={(e) =>
                            updateProofCase(item.id, 'authorName', e.target.value)
                          }
                          placeholder="Author name"
                          className={compactInputClass}
                        />
                        <input
                          type="text"
                          value={item.authorRole}
                          onChange={(e) =>
                            updateProofCase(item.id, 'authorRole', e.target.value)
                          }
                          placeholder="Role"
                          className={compactInputClass}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'offer' && (
          <>
            {/* Group 1: Checkout Link, Button Text & Guarantee */}
            <div className="rounded-lg border border-[#CFD9E4] bg-[#EDF2F7] overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setOpenOfferGroup(openOfferGroup === 'checkout' ? 'tiers' : 'checkout')
                }
                className="w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-2 cursor-pointer"
              >
                <span className="text-xs font-semibold text-[#0F172A]">
                  Button, Checkout Link & Guarantee
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#64748B] transition-transform ${
                    openOfferGroup === 'checkout' ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {openOfferGroup === 'checkout' && (
                <div className="p-3.5 pt-2 bg-[#F4F7FA] border-t border-[#DCE4EE] space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Main Button Text
                    </label>
                    <input
                      type="text"
                      value={template.primaryCtaLabel}
                      onChange={(e) => updateField('primaryCtaLabel', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Payment / Checkout Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={template.checkoutUrl || ''}
                      onChange={(e) => updateField('checkoutUrl', e.target.value)}
                      placeholder="https://selar.co/your-offer (optional)"
                      className={inputClass}
                    />
                    <p className="text-[11px] text-[#64748B] mt-1">
                      Paste your Selar, Paystack, Stripe, or WhatsApp link. Leave blank to scroll buyers to your inquiry form.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Mobile Money / Lipa Namba Details (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={template.mobileMoneyNote || ''}
                      onChange={(e) => updateField('mobileMoneyNote', e.target.value)}
                      placeholder="e.g. M-Pesa Lipa Namba: 5432109 · Account: Launch Co."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Trust Line Next to Main Button
                    </label>
                    <input
                      type="text"
                      value={template.trustMarker}
                      onChange={(e) => updateField('trustMarker', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Guarantee Headline
                    </label>
                    <input
                      type="text"
                      value={template.guaranteeTitle}
                      onChange={(e) => updateField('guaranteeTitle', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Guarantee Promise
                    </label>
                    <textarea
                      rows={3}
                      value={template.guaranteeBody}
                      onChange={(e) => updateField('guaranteeBody', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Group 2: Pricing Options */}
            <div className="rounded-lg border border-[#CFD9E4] bg-[#EDF2F7] overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setOpenOfferGroup(openOfferGroup === 'tiers' ? 'checkout' : 'tiers')
                }
                className="w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-2 cursor-pointer"
              >
                <span className="text-xs font-semibold text-[#0F172A]">
                  Pricing Options ({template.pricingTiers.length})
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#64748B] transition-transform ${
                    openOfferGroup === 'tiers' ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {openOfferGroup === 'tiers' && (
                <div className="p-3.5 pt-2 bg-[#F4F7FA] border-t border-[#DCE4EE] space-y-3">
                  {template.pricingTiers.map((tier, idx) => (
                    <div
                      key={tier.id}
                      className="p-2.5 rounded-lg border border-[#CFD9E4] bg-[#EDF2F7] space-y-2"
                    >
                      <div className="text-[11px] font-semibold text-[#475569]">
                        Option #{idx + 1}
                      </div>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => updatePricingTier(tier.id, 'name', e.target.value)}
                        placeholder="Option name"
                        className={`${compactInputClass} font-semibold`}
                      />
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={tier.monthlyPrice}
                          onChange={(e) =>
                            updatePricingTier(tier.id, 'monthlyPrice', e.target.value)
                          }
                          placeholder={template.pricingBillingLabels[0]}
                          className={compactInputClass}
                        />
                        <input
                          type="text"
                          value={tier.annualPrice}
                          onChange={(e) =>
                            updatePricingTier(tier.id, 'annualPrice', e.target.value)
                          }
                          placeholder={template.pricingBillingLabels[1]}
                          className={compactInputClass}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={tier.unitLabel}
                          onChange={(e) =>
                            updatePricingTier(tier.id, 'unitLabel', e.target.value)
                          }
                          placeholder="Unit (e.g. one-time)"
                          className={compactInputClass}
                        />
                        <input
                          type="text"
                          value={tier.ctaLabel}
                          onChange={(e) =>
                            updatePricingTier(tier.id, 'ctaLabel', e.target.value)
                          }
                          placeholder="Button text"
                          className={compactInputClass}
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={tier.summary}
                        onChange={(e) => updatePricingTier(tier.id, 'summary', e.target.value)}
                        placeholder="Short option summary"
                        className={compactInputClass}
                      />
                      <div>
                        <label className="block text-[11px] text-[#64748B] mb-1">
                          Included items (one per line)
                        </label>
                        <textarea
                          rows={3}
                          value={tier.features.join('\n')}
                          onChange={(e) => updateTierFeatures(tier.id, e.target.value)}
                          className={compactInputClass}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Group 3: Frequently Asked Questions */}
            <div className="rounded-lg border border-[#CFD9E4] bg-[#EDF2F7] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenOfferGroup(openOfferGroup === 'faq' ? 'checkout' : 'faq')}
                className="w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-2 cursor-pointer"
              >
                <span className="text-xs font-semibold text-[#0F172A]">
                  Frequently Asked Questions ({template.faqs.length})
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#64748B] transition-transform ${
                    openOfferGroup === 'faq' ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {openOfferGroup === 'faq' && (
                <div className="p-3.5 pt-2 bg-[#F4F7FA] border-t border-[#DCE4EE] space-y-2.5">
                  {template.faqs.map((faq, idx) => (
                    <div
                      key={faq.id}
                      className="p-2.5 rounded-lg border border-[#CFD9E4] bg-[#EDF2F7] space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-[#475569]">
                          Q{idx + 1}
                        </span>
                        {template.faqs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFaq(faq.id)}
                            aria-label={`Remove question ${idx + 1}`}
                            className="text-[#64748B] hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(faq.id, 'question', e.target.value)}
                        placeholder={`Question ${idx + 1}`}
                        className={`${compactInputClass} font-medium`}
                      />
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => updateFaq(faq.id, 'answer', e.target.value)}
                        placeholder="Answer..."
                        className={compactInputClass}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFaq}
                    className="w-full py-2 px-3 text-xs font-medium text-[#0F172A] bg-[#E2E9F2] hover:bg-[#D5DFEC] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Add Question</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'design' && (
          <>
            <div>
              <span className="block text-xs font-medium text-[#334155] mb-2">
                Page Photo
              </span>
              <div className="flex items-center gap-2">
                <label className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-[#0F172A] bg-[#E2E9F2] hover:bg-[#D5DFEC] border border-[#C4D0DC] rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Upload Your Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {template.heroImage.startsWith('data:') && (
                  <button
                    type="button"
                    onClick={handleResetPhoto}
                    className="py-2 px-3 text-xs font-medium text-[#475569] hover:text-[#0F172A] bg-[#FAFCFE] border border-[#C4D0DC] rounded-lg cursor-pointer"
                  >
                    Default
                  </button>
                )}
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-[#334155] mb-2">
                Top Layout
              </span>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: 'split-media', label: 'Side-by-Side Photo' },
                  { id: 'editorial-centered', label: 'Centered Text' },
                ] as const).map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => updateField('heroVariant', variant.id)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                      template.heroVariant === variant.id
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-[#FAFCFE] text-[#334155] border-[#C4D0DC] hover:border-[#0F172A]'
                    }`}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-[#334155] mb-2">
                Background Color
              </span>
              <div className="grid grid-cols-3 gap-2">
                {SURFACE_OPTIONS.map((surf) => (
                  <button
                    key={surf.id}
                    type="button"
                    onClick={() => updateField('surface', surf.id)}
                    className={`py-2 px-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                      template.surface === surf.id
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-[#FAFCFE] text-[#334155] border-[#C4D0DC] hover:border-[#0F172A]'
                    }`}
                  >
                    {surf.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-[#334155] mb-2">
                Button Color
              </span>
              <div className="grid grid-cols-5 gap-2">
                {ACCENT_PRESETS.map((preset) => {
                  const active = template.accentColor === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => updateField('accentColor', preset.value)}
                      title={preset.label}
                      aria-label={preset.label}
                      className={`h-9 rounded-lg border flex items-center justify-center transition-transform cursor-pointer ${
                        active ? 'border-[#0F172A] scale-[1.04]' : 'border-black/15'
                      }`}
                      style={{ backgroundColor: preset.value }}
                    >
                      {active && <Check className="w-4 h-4 text-white" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#334155] mb-2">
                Font Style
              </label>
              <div className="space-y-1.5">
                {FONT_PAIRINGS.map((pair) => {
                  const active = template.fontPairing === pair.id;
                  return (
                    <button
                      key={pair.id}
                      type="button"
                      onClick={() => updateField('fontPairing', pair.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#E2E9F2] border-[#0F172A]'
                          : 'bg-[#FAFCFE] border-[#CFD9E4] hover:border-[#94A3B8]'
                      }`}
                    >
                      <div className="text-xs font-semibold text-[#0F172A]">{pair.label}</div>
                      <div className="text-[11px] text-[#64748B]">{pair.detail}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#DCE4EE] space-y-2">
              <div className="text-xs font-semibold text-[#0F172A]">
                Show, Hide & Reorder Sections
              </div>
              {template.sections.map((section, idx) => (
                <div
                  key={section.id}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-[#CFD9E4] bg-[#EDF2F7]"
                >
                  <span
                    className={`text-xs font-medium ${
                      section.enabled ? 'text-[#0F172A]' : 'text-[#94A3B8] line-through'
                    }`}
                  >
                    {section.label}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveSection(idx, -1)}
                      disabled={idx === 0}
                      aria-label={`Move ${section.label} up`}
                      className="p-1 text-[#475569] hover:text-[#0F172A] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(idx, 1)}
                      disabled={idx === template.sections.length - 1}
                      aria-label={`Move ${section.label} down`}
                      className="p-1 text-[#475569] hover:text-[#0F172A] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      aria-label={section.enabled ? `Hide ${section.label}` : `Show ${section.label}`}
                      className="p-1 text-[#475569] hover:text-[#0F172A] cursor-pointer"
                    >
                      {section.enabled ? (
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Save Draft & Project Backup Bar */}
      <div className="p-4 border-t border-[#DCE4EE] bg-[#EDF2F7] mt-auto space-y-2.5">
        <label className="block text-xs font-medium text-[#334155]">
          Save draft or backup file
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={snapshotName}
            onChange={(e) => setSnapshotName(e.target.value)}
            placeholder={`${template.brandName} draft`}
            className="flex-1 min-w-0 px-3 py-2 text-xs bg-[#FAFCFE] border border-[#C4D0DC] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#0F172A]"
          />
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#0F172A] rounded-lg hover:bg-[#1E293B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {justSaved ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleExportProjectJson}
            className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-[11px] font-medium text-[#334155] hover:text-[#0F172A] bg-[#FAFCFE] border border-[#C4D0DC] rounded-md transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3" aria-hidden="true" />
            <span>Backup .json</span>
          </button>
          <label className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-[11px] font-medium text-[#334155] hover:text-[#0F172A] bg-[#FAFCFE] border border-[#C4D0DC] rounded-md transition-colors cursor-pointer">
            <FolderOpen className="w-3 h-3" aria-hidden="true" />
            <span>Load .json</span>
            <input
              type="file"
              accept="application/json,.json"
              onChange={handleImportProjectJson}
              className="hidden"
            />
          </label>
        </div>
        {importError && <p className="text-[11px] text-red-600">{importError}</p>}
      </div>
    </aside>
  );
}
