import { useState } from 'react';
import { ArrowRight, Check, Monitor, Smartphone } from 'lucide-react';
import { INITIAL_TEMPLATES } from '../data/templates';

interface HeroStudioShowcaseProps {
  onLaunchBuilder: (templateId?: string) => void;
}

const SHOWCASE_ORDER = [
  { id: 'quiet-editorial-kit', shortLabel: 'Digital Product' },
  { id: 'quiet-productized-service', shortLabel: 'Service' },
  { id: 'quiet-b2b-technical', shortLabel: 'Workshop' },
  { id: 'validator-smoke-test', shortLabel: 'Idea Test' },
] as const;

export function HeroStudioShowcase({ onLaunchBuilder }: HeroStudioShowcaseProps) {
  const [selectedId, setSelectedId] = useState<string>(SHOWCASE_ORDER[0].id);
  const [demoNotice, setDemoNotice] = useState(false);

  const activeTemplate =
    INITIAL_TEMPLATES.find((tpl) => tpl.id === selectedId) ||
    INITIAL_TEMPLATES[1] ||
    INITIAL_TEMPLATES[0];

  const primaryTier = activeTemplate.pricingTiers[0];
  const accent = activeTemplate.accentColor || '#0F766E';

  return (
    <div className="h-full flex flex-col justify-between rounded-xl border border-[#C4D0DC] bg-[#F4F7FA] overflow-hidden shadow-sm">
      {/* Unmistakable Demo Label Separating Example Product From Page Studio ($24 / TSh 67,500) */}
      <div className="px-4 py-2 bg-[#0F172A] text-[#F8FAFC] flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <span className="font-semibold tracking-tight">
          DEMONSTRATION ONLY — Sample offer inside builder
        </span>
        <span className="text-[#94A3B8]">
          Sample price shown (Page Studio is $24 / TSh 67,500)
        </span>
      </div>

      {/* Studio App Bar + Template Switcher */}
      <div className="px-4 py-2 bg-[#FAFCFE] border-b border-[#CFD9E4] flex items-center justify-between gap-2 text-[10px]">
        <span className="font-bold text-[#0F172A] truncate">BiasharaBase Page Studio</span>
        <div className="hidden sm:flex items-center gap-3 text-[#475569]">
          <span>1. Pick Template</span>
          <span className="font-semibold text-[#0F172A] border-b border-[#0F172A] pb-0.5">
            2. Edit Your Page
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#0F172A] text-white font-medium shrink-0">
          Download HTML
        </span>
      </div>

      <div className="px-4 py-2 bg-[#EDF2F7] border-b border-[#CFD9E4] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-1 bg-[#DCE5F0] rounded-lg overflow-x-auto max-w-full">
          {SHOWCASE_ORDER.map((tab) => {
            const active = tab.id === activeTemplate.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedId(tab.id);
                  setDemoNotice(false);
                }}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#FAFCFE] text-[#0F172A] shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {tab.shortLabel}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#475569] whitespace-nowrap shrink-0">
          <Monitor className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
          <span>Desktop</span>
          <span aria-hidden="true">·</span>
          <Smartphone className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
          <span>Mobile</span>
        </div>
      </div>

      {/* Studio Workspace Preview: Left Mini Editor + Desktop Page + Overlapping Mobile Preview */}
      <div className="relative flex-1 p-4 pb-6 bg-[#E2E9F2]">
        <div className="rounded-lg border border-[#CFD9E4] bg-[#FAFCFE] overflow-hidden shadow-xs grid grid-cols-12 min-h-[290px]">
          {/* Left Miniature Browser Editor Rail */}
          <div className="hidden sm:flex sm:col-span-4 flex-col justify-between p-3 bg-[#EDF2F7] border-r border-[#CFD9E4] text-[10px]">
            <div className="space-y-2.5">
              <div className="font-semibold text-[#0F172A] tracking-tight">
                Sample Fields (Demo)
              </div>
              <div className="space-y-1">
                <div className="text-[#64748B]">Sample Brand</div>
                <div className="px-2 py-1 rounded border border-[#CFD9E4] bg-[#FAFCFE] text-[#0F172A] font-medium truncate">
                  {activeTemplate.brandName}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[#64748B]">Sample Headline</div>
                <div className="px-2 py-1 rounded border border-[#CFD9E4] bg-[#FAFCFE] text-[#334155] line-clamp-2 leading-snug">
                  {activeTemplate.heroHeadline}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <div className="text-[#64748B] mb-0.5">Sample Price</div>
                  <div className="px-2 py-1 rounded border border-[#CFD9E4] bg-[#FAFCFE] text-[#0F172A] font-semibold tabular-nums truncate">
                    {primaryTier?.monthlyPrice || '$24'}
                  </div>
                </div>
                <div>
                  <div className="text-[#64748B] mb-0.5">Lead Route</div>
                  <div className="px-2 py-1 rounded border border-[#CFD9E4] bg-[#FAFCFE] text-[#0F766E] font-medium capitalize truncate">
                    {activeTemplate.leadDestinationType}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DCE4EE] text-[#475569]">
              Download HTML ($24 / TSh 67,500)
            </div>
          </div>

          {/* Right Desktop Finished Sales Page Preview */}
          <div className="col-span-12 sm:col-span-8 p-4 flex flex-col justify-between bg-[#FAFCFE]">
            <div>
              {/* Mini Page Nav */}
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#E2E9F2]">
                <span className="text-[11px] font-bold text-[#0F172A] truncate">
                  {activeTemplate.brandName} (Demo)
                </span>
                <span className="text-[9px] font-medium text-[#64748B] shrink-0">
                  Non-purchasable sample
                </span>
              </div>

              {/* Mini Hero */}
              <div className="pr-2 sm:pr-16 space-y-2">
                <div className="text-[9px] font-semibold uppercase tracking-wide text-[#0F766E]">
                  Demo Template · {activeTemplate.category}
                </div>
                <div className="font-display-studio text-sm font-semibold text-[#0F172A] leading-snug">
                  {activeTemplate.heroHeadline}
                </div>
                <p className="text-[10px] text-[#475569] line-clamp-2 leading-relaxed">
                  {activeTemplate.heroSubheadline}
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDemoNotice((v) => !v)}
                    className="inline-block px-2.5 py-1 text-[10px] font-semibold text-white rounded cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: accent }}
                  >
                    {activeTemplate.primaryCtaLabel}
                  </button>
                  <span className="text-[10px] font-medium text-[#64748B] tabular-nums">
                    Sample price: {primaryTier?.monthlyPrice || ''}
                  </span>
                </div>
                {demoNotice && (
                  <p className="text-[10px] text-[#0F766E] bg-[#F0FDFA] border border-[#99F6E4] rounded px-2 py-1 leading-snug">
                    Sample button preview only — no real purchase. On your exported page, this links to your own checkout or form.
                  </p>
                )}
              </div>
            </div>

            {/* Mini Proof & Offer Comparison Row */}
            <div className="mt-4 pt-3 border-t border-[#E2E9F2] grid grid-cols-2 gap-2 pr-0 sm:pr-24">
              <div className="p-2 rounded border border-[#E2E9F2] bg-[#F4F7FA]">
                <div className="text-[9px] font-semibold text-[#0F172A] mb-1">
                  Sample deliverables
                </div>
                <div className="space-y-0.5 text-[9px] text-[#475569]">
                  {(primaryTier?.features || []).slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1">
                      <Check
                        className="w-2.5 h-2.5 mt-0.5 shrink-0"
                        style={{ color: accent }}
                        aria-hidden="true"
                      />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-2 rounded border border-[#E2E9F2] bg-[#F4F7FA]">
                <div className="text-[9px] font-semibold text-[#0F172A] mb-1">
                  Sample proof
                </div>
                <div className="text-[10px] font-semibold text-[#0F766E] tabular-nums line-clamp-1">
                  {activeTemplate.kpiStrip[0]?.value}
                </div>
                <div className="text-[9px] text-[#64748B] line-clamp-1">
                  {activeTemplate.kpiStrip[0]?.label}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlapping Mobile Preview Frame */}
        <div
          aria-hidden="true"
          className="hidden sm:flex flex-col justify-between w-[148px] rounded-xl border-2 border-[#0F172A] bg-[#FAFCFE] shadow-lg overflow-hidden absolute right-6 bottom-3"
        >
          <div className="px-2.5 py-1.5 bg-[#0F172A] text-white flex items-center justify-between text-[8px]">
            <span className="font-semibold truncate">{activeTemplate.brandName}</span>
            <span className="text-[#94A3B8]">Demo</span>
          </div>
          <div className="p-2.5 space-y-1.5">
            <div className="text-[9px] font-semibold text-[#0F172A] leading-tight line-clamp-3">
              {activeTemplate.heroHeadline}
            </div>
            <div className="text-[8px] text-[#475569] line-clamp-2">
              {activeTemplate.heroSubheadline}
            </div>
            <div
              className="w-full py-1 px-2 text-center text-[8px] font-semibold text-white rounded"
              style={{ backgroundColor: accent }}
            >
              {activeTemplate.primaryCtaLabel}
            </div>
            <div className="pt-1.5 border-t border-[#E2E9F2] flex items-center justify-between text-[8px]">
              <span className="text-[#475569] truncate">
                Sample price
              </span>
              <span className="font-bold text-[#0F172A] tabular-nums shrink-0">
                {primaryTier?.monthlyPrice || ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Prompt */}
      <div className="px-4 py-2.5 bg-[#F4F7FA] border-t border-[#CFD9E4] flex items-center justify-between gap-3 text-xs">
        <span className="text-[#475569] truncate">
          Demo template: <strong className="font-semibold text-[#0F172A]">{activeTemplate.name}</strong> (sample data)
        </span>
        <button
          type="button"
          onClick={() => onLaunchBuilder(activeTemplate.id)}
          className="inline-flex items-center gap-1 font-semibold text-[#0F766E] hover:text-[#115E59] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Try editing free</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
