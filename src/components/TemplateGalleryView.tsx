import { useState } from 'react';
import { Trash2, ArrowRight } from 'lucide-react';
import { SalesTemplate, SavedSnapshot, BiasharaProductLink } from '../types/template';
import { ResilientImage } from './ResilientImage';

interface TemplateGalleryViewProps {
  templates: SalesTemplate[];
  activeTemplateId: string;
  snapshots: SavedSnapshot[];
  onSelectTemplate: (template: SalesTemplate) => void;
  onDeleteSnapshot: (id: string) => void;
  initialTab?: 'templates' | 'saved';
}

const PRODUCT_FILTERS: Array<{ label: string; value: 'All' | BiasharaProductLink }> = [
  { label: 'All Templates', value: 'All' },
  { label: 'Test a New Idea', value: 'Test a New Idea' },
  { label: 'Sell a Product or Service', value: 'Sell an Offer' },
];

export function TemplateGalleryView({
  templates,
  activeTemplateId,
  snapshots,
  onSelectTemplate,
  onDeleteSnapshot,
  initialTab = 'templates',
}: TemplateGalleryViewProps) {
  const [productFilter, setProductFilter] = useState<'All' | BiasharaProductLink>('All');
  const [activeCollection, setActiveCollection] = useState<'templates' | 'saved'>(initialTab);

  const filteredTemplates =
    productFilter === 'All'
      ? templates
      : templates.filter((t) => t.productLink === productFilter);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-[#CFD9E4]">
        <div className="max-w-2xl">
          <h1 className="font-display-studio text-3xl md:text-4xl font-semibold tracking-tight text-[#0F172A] text-balance mb-3">
            {activeCollection === 'saved'
              ? 'Your saved page drafts.'
              : 'Pick a page template for your business.'}
          </h1>
          <p className="text-base text-[#475569] leading-relaxed">
            {activeCollection === 'saved'
              ? 'Load any page version you saved earlier to keep editing or download the HTML.'
              : 'Each template comes pre-filled with sample text so you can see the layout. Open any template to swap in your own business name, price, and story.'}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#E2E9F2] border border-[#CFD9E4] rounded-lg shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveCollection('templates')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeCollection === 'templates'
                ? 'bg-[#FAFCFE] text-[#0F172A] shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Templates ({templates.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCollection('saved')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeCollection === 'saved'
                ? 'bg-[#FAFCFE] text-[#0F172A] shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Saved Drafts ({snapshots.length})
          </button>
        </div>
      </div>

      {activeCollection === 'templates' ? (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#E2E9F2] border border-[#CFD9E4] rounded-lg">
              {PRODUCT_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setProductFilter(filter.value)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    productFilter === filter.value
                      ? 'bg-[#FAFCFE] text-[#0F172A] shadow-xs'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {filteredTemplates.map((tpl) => {
              const isSelected = tpl.id === activeTemplateId;
              const enabledCount = tpl.sections.filter((s) => s.enabled).length;
              const surfaceLabel =
                tpl.surface === 'obsidian-dark'
                  ? 'Dark Slate'
                  : tpl.surface === 'warm-stone'
                    ? 'Warm Paper'
                    : 'Mineral Slate';

              return (
                <article
                  key={tpl.id}
                  className={`bg-[#F4F7FA] rounded-xl border transition-colors duration-150 overflow-hidden flex flex-col justify-between ${
                    isSelected ? 'border-[#0F172A]' : 'border-[#CFD9E4] hover:border-[#94A3B8]'
                  }`}
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
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mb-2">
                        <span>{tpl.productLink}</span>
                        <span aria-hidden="true">·</span>
                        <span>{enabledCount} Sections</span>
                        <span aria-hidden="true">·</span>
                        <span>{surfaceLabel}</span>
                      </div>
                      <h2 className="font-display-studio text-xl font-semibold text-[#0F172A] mb-2">
                        {tpl.name}
                      </h2>
                      <p className="text-sm text-[#475569] leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-[#DCE4EE] bg-[#EDF2F7] flex items-center justify-between gap-4">
                    <span className="text-xs text-[#64748B] truncate">
                      Sample brand: {tpl.brandName}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectTemplate(tpl)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F172A] rounded-lg hover:bg-[#1E293B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Customize This Page</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      ) : snapshots.length === 0 ? (
        <div className="bg-[#F4F7FA] border border-[#CFD9E4] rounded-xl p-12 text-center max-w-xl mx-auto">
          <h2 className="font-display-studio text-lg font-semibold text-[#0F172A] mb-2">
            No saved drafts yet
          </h2>
          <p className="text-sm text-[#475569] mb-6 leading-relaxed">
            Open any template, enter your business details on the left, and click Save at the bottom of the panel to keep a copy here.
          </p>
          <button
            type="button"
            onClick={() => setActiveCollection('templates')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0F172A] rounded-lg hover:bg-[#1E293B] transition-colors cursor-pointer"
          >
            Browse Templates
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snapshots.map((snap) => (
            <article
              key={snap.id}
              className="bg-[#F4F7FA] border border-[#CFD9E4] rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video w-full overflow-hidden border-b border-[#DCE4EE]">
                  <ResilientImage
                    src={snap.template.heroImage}
                    alt={snap.template.heroImageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1.5">
                    <span>{snap.template.productLink}</span>
                    <span aria-hidden="true">·</span>
                    <span>{new Date(snap.savedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-display-studio text-lg font-semibold text-[#0F172A] mb-1">
                    {snap.snapshotName}
                  </h3>
                  <p className="text-xs text-[#475569] line-clamp-2">
                    {snap.template.heroHeadline}
                  </p>
                </div>
              </div>
              <div className="px-5 py-3.5 border-t border-[#DCE4EE] bg-[#EDF2F7] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onDeleteSnapshot(snap.id)}
                  aria-label={`Delete ${snap.snapshotName}`}
                  className="inline-flex items-center gap-1 text-xs text-[#64748B] hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Delete</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTemplate(snap.template)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0F172A] rounded-lg hover:bg-[#1E293B] transition-colors cursor-pointer"
                >
                  <span>Open Draft</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
