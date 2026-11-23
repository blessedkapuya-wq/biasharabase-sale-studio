import { useState } from 'react';
import { ArrowRight, Monitor, Smartphone } from 'lucide-react';
import { INITIAL_TEMPLATES } from '../data/templates';
import { SalesPageRenderer } from './SalesPageRenderer';

interface FinishedPageExampleShowcaseProps {
  onLaunchBuilder: (templateId?: string) => void;
}

const EXAMPLE_TABS = [
  { id: 'quiet-editorial-kit', label: 'Digital Product' },
  { id: 'quiet-productized-service', label: 'Service & Consulting' },
  { id: 'quiet-b2b-technical', label: 'B2B Quote' },
  { id: 'validator-smoke-test', label: 'Idea Test' },
] as const;

export function FinishedPageExampleShowcase({
  onLaunchBuilder,
}: FinishedPageExampleShowcaseProps) {
  const [selectedId, setSelectedId] = useState<string>(EXAMPLE_TABS[0].id);

  const activeTemplate =
    INITIAL_TEMPLATES.find((tpl) => tpl.id === selectedId) ||
    INITIAL_TEMPLATES[1] ||
    INITIAL_TEMPLATES[0];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[#CFD9E4]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-[#0F766E] mb-2">
            LIVE DEMO — Example sales page created with Page Studio
          </p>
          <h2 className="font-display-studio text-2xl md:text-3xl font-semibold tracking-tight text-balance text-[#0F172A] mb-3">
            See a complete finished sales page before you buy.
          </h2>
          <p className="text-base text-[#475569] leading-relaxed">
            Scroll through the real desktop and mobile result below—complete with hero, Before vs. After contrast, proof, pricing, FAQ, and inquiry form. Everything shown is a sample business you replace with your own offer.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onLaunchBuilder(activeTemplate.id)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#0F172A] bg-[#FAFCFE] border border-[#C4D0DC] hover:border-[#0F172A] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Edit This Example Free</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Template Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-1 p-1 bg-[#DCE5F0] rounded-lg overflow-x-auto max-w-full">
          {EXAMPLE_TABS.map((tab) => {
            const active = tab.id === activeTemplate.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedId(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#FAFCFE] text-[#0F172A] shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <span className="text-xs text-[#64748B]">
          Sample brand: <strong className="font-medium text-[#0F172A]">{activeTemplate.brandName}</strong> · Scroll inside either preview
        </span>
      </div>

      {/* Full Scrollable Desktop + Mobile Finished Page Frames */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Finished Desktop Frame */}
        <div className="lg:col-span-8 rounded-xl border border-[#C4D0DC] bg-[#F4F7FA] overflow-hidden shadow-xs">
          <div className="px-4 py-2.5 bg-[#EDF2F7] border-b border-[#CFD9E4] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-medium text-[#0F172A]">
              <Monitor className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
              <span>Desktop Result · {activeTemplate.name}</span>
            </div>
            <span className="text-[11px] text-[#64748B]">
              Sample demo output
            </span>
          </div>
          <div className="h-[540px] overflow-y-auto">
            <SalesPageRenderer
              template={{
                ...activeTemplate,
                id: `example-desktop-${activeTemplate.id}`,
              }}
              viewportMode="tablet"
            />
          </div>
        </div>

        {/* Finished Mobile Frame */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-full max-w-[330px] rounded-2xl border-2 border-[#0F172A] bg-[#F4F7FA] overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 bg-[#0F172A] text-white flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-medium">
                <Smartphone className="w-3.5 h-3.5 text-[#5EEAD4]" aria-hidden="true" />
                <span>Mobile Result</span>
              </div>
              <span className="text-[11px] text-[#94A3B8] truncate">
                {activeTemplate.brandName}
              </span>
            </div>
            <div className="h-[540px] overflow-y-auto">
              <SalesPageRenderer
                template={{
                  ...activeTemplate,
                  id: `example-mobile-${activeTemplate.id}`,
                }}
                viewportMode="mobile"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
