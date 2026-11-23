import { ArrowRight } from 'lucide-react';
import { SalesTemplate } from '../types/template';
import { ResilientImage } from './ResilientImage';

interface HomeOverviewProps {
  templates: SalesTemplate[];
  onStartTemplate: (templateId: string) => void;
}

export function HomeOverview({ templates, onStartTemplate }: HomeOverviewProps) {
  const validatorTemplate =
    templates.find((t) => t.productLink === 'Test a New Idea') || templates[0];
  const salesTemplates = templates.filter(
    (t) => t.productLink === 'Sell an Offer'
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 md:py-16">
      {/* Plain-English Value Proposition */}
      <section className="max-w-3xl mb-12">
        <p className="text-sm mb-2.5">
          <strong className="font-bold text-[#0F172A]">BiasharaBase Page Studio</strong>
          <span className="text-[#0F766E] font-medium"> · Template Library</span>
        </p>
        <h1 className="font-display-studio text-3xl md:text-5xl font-semibold tracking-tight text-[#0F172A] leading-[1.1] text-balance mb-4">
          Pick a sales page template, enter your offer, and download a ready-to-publish webpage.
        </h1>
        <p className="text-base md:text-lg text-[#475569] leading-relaxed">
          Every <strong className="font-bold text-[#0F172A]">BiasharaBase Page Studio</strong> template is structured to convert: clear problem-vs-solution contrast, verified customer proof, a risk-reversal guarantee, FAQ answers, and a working inquiry form.
        </p>
      </section>

      {/* Two Clear Page Stages */}
      <section className="space-y-12">
        {/* Stage 1: Test a New Idea */}
        <div>
          <div className="mb-4">
            <p className="text-xs font-medium text-[#0F766E] mb-1">
              Stage 1 · Test a New Idea
            </p>
            <h2 className="font-display-studio text-xl font-semibold text-[#0F172A]">
              Testing demand before you spend months building
            </h2>
          </div>

          <article className="bg-[#F4F7FA] border border-[#CFD9E4] rounded-xl overflow-hidden grid md:grid-cols-12 items-stretch">
            <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-[#DCE4EE]">
              <ResilientImage
                src={validatorTemplate.heroImage}
                alt={validatorTemplate.heroImageAlt}
                className="w-full h-full min-h-[220px] object-cover"
              />
            </div>
            <div className="md:col-span-7 p-7 flex flex-col justify-between gap-6">
              <div>
                <h3 className="font-display-studio text-xl font-semibold text-[#0F172A] mb-2">
                  {validatorTemplate.name}
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed mb-4">
                  {validatorTemplate.description} Includes a refundable founding pre-order vs. free waitlist, early buyer feedback, and an instant signup form.
                </p>
                <div className="text-xs text-[#64748B]">
                  Includes: Top Hero · Before vs. After · Deliverables · Proof · Pricing & Guarantee · FAQ · Inquiry Form
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#DCE4EE]">
                <span className="text-xs text-[#64748B]">
                  Demo sample: {validatorTemplate.brandName}
                </span>
                <button
                  type="button"
                  onClick={() => onStartTemplate(validatorTemplate.id)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#1E293B] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Customize This Page</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        </div>

        {/* Stage 2: Sell a Digital Product, Service, or Workshop */}
        <div>
          <div className="mb-4">
            <p className="text-xs font-medium text-[#1E40AF] mb-1">
              Stage 2 · Sell Your Offer
            </p>
            <h2 className="font-display-studio text-xl font-semibold text-[#0F172A]">
              Selling a digital product, service package, or live workshop
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {salesTemplates.map((tpl) => (
              <article
                key={tpl.id}
                className="bg-[#F4F7FA] border border-[#CFD9E4] hover:border-[#64748B] rounded-xl overflow-hidden flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="aspect-video w-full overflow-hidden border-b border-[#DCE4EE]">
                    <ResilientImage
                      src={tpl.heroImage}
                      alt={tpl.heroImageAlt}
                      isDark={tpl.surface === 'obsidian-dark'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-[#64748B] mb-1.5">
                      {tpl.category} · {tpl.surface === 'obsidian-dark' ? 'Dark Slate' : tpl.surface === 'warm-stone' ? 'Warm Paper' : 'Mineral Slate'}
                    </div>
                    <h3 className="font-display-studio text-lg font-semibold text-[#0F172A] mb-2">
                      {tpl.name}
                    </h3>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-[#DCE4EE] bg-[#EDF2F7]">
                  <button
                    type="button"
                    onClick={() => onStartTemplate(tpl.id)}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#1E293B] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Customize This Page</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
