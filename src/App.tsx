/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, PanelLeftClose, PanelLeftOpen, ArrowRight } from 'lucide-react';
import { INITIAL_TEMPLATES } from './data/templates';
import { QUIET_PAGE_STUDIO_TEMPLATE } from './data/studioSalesTemplate';
import { SalesTemplate, SavedSnapshot } from './types/template';
import { QuietPageStudioSalesPage } from './components/QuietPageStudioSalesPage';
import { HomeOverview } from './components/HomeOverview';
import { SalesPageRenderer } from './components/SalesPageRenderer';
import { TemplateEditorRail } from './components/TemplateEditorRail';
import { TemplateGalleryView } from './components/TemplateGalleryView';
import { ExportCodeModal } from './components/ExportCodeModal';
import { OwnerLicenseModal } from './components/OwnerLicenseModal';

type AppView = 'sales' | 'pick' | 'edit' | 'saved';
type ViewportMode = 'desktop' | 'tablet' | 'mobile';

const SNAPSHOT_STORAGE_KEY = 'biashara_base_snapshots_v2';
const ACCESS_TOKEN_STORAGE_KEY = 'biashara_studio_access_token_v1';
const SELAR_URL_STORAGE_KEY = 'biashara_owner_selar_url_v1';
const DEVICE_ID_STORAGE_KEY = 'biashara_device_id_v1';

function getOrCreateDeviceId(): string {
  try {
    const existing = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (existing && existing.length >= 8) return existing;
    const generated =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? `dev_${crypto.randomUUID().replace(/-/g, '')}`
        : `dev_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
    localStorage.setItem(DEVICE_ID_STORAGE_KEY, generated);
    return generated;
  } catch {
    return `dev_${Date.now()}`;
  }
}

export default function App() {
  const [view, setView] = useState<AppView>('sales');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [exportTemplate, setExportTemplate] = useState<SalesTemplate | null>(null);
  const [selarUrl, setSelarUrl] = useState<string>(() => {
    const defaultUrl =
      QUIET_PAGE_STUDIO_TEMPLATE.checkoutUrl || 'https://selar.com/n57778lu4q';
    try {
      const saved = localStorage.getItem(SELAR_URL_STORAGE_KEY)?.trim();
      if (
        !saved ||
        saved === 'https://selar.co/' ||
        saved === 'https://selar.co' ||
        saved === 'https://selar.co/your-product'
      ) {
        return defaultUrl;
      }
      return saved;
    } catch {
      return defaultUrl;
    }
  });
  const [ownerModalOpen, setOwnerModalOpen] = useState(false);
  const [deviceId] = useState<string>(() => getOrCreateDeviceId());
  const [personalAccessUrl, setPersonalAccessUrl] = useState<string | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<'claim' | 'code'>('claim');
  const [modalInitialError, setModalInitialError] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [isUnlocked, setIsUnlocked] = useState(false);

  const [templatesState, setTemplatesState] = useState<Record<string, SalesTemplate>>(() => {
    const map: Record<string, SalesTemplate> = {};
    for (const tpl of INITIAL_TEMPLATES) {
      map[tpl.id] = tpl;
    }
    return map;
  });

  const [activeTemplateId, setActiveTemplateId] = useState<string>(INITIAL_TEMPLATES[0].id);

  const [snapshots, setSnapshots] = useState<SavedSnapshot[]>(() => {
    try {
      const raw = localStorage.getItem(SNAPSHOT_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as SavedSnapshot[];
      }
    } catch {
      // Ignore storage read errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshots));
    } catch {
      // Ignore storage write errors
    }
  }, [snapshots]);

  useEffect(() => {
    try {
      localStorage.setItem(SELAR_URL_STORAGE_KEY, selarUrl);
    } catch {
      // Ignore storage write errors
    }
  }, [selarUrl]);

  const handleUnlock = (details: {
    token: string;
    accessUrl?: string;
  }) => {
    setAccessToken(details.token);
    setIsUnlocked(true);
    setModalInitialError('');
    if (details.accessUrl) {
      setPersonalAccessUrl(details.accessUrl);
    }
    try {
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, details.token);
    } catch {
      // Ignore storage write errors
    }
  };

  const handleLock = () => {
    setAccessToken(null);
    setIsUnlocked(false);
    setPersonalAccessUrl(null);
    try {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    } catch {
      // Ignore storage remove errors
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get('access');
    const urlPaid = params.get('paid');

    if (urlPaid === '1' && !urlCode) {
      setModalInitialTab('claim');
      setModalInitialError('');
      setView('pick');
      setExportTemplate(INITIAL_TEMPLATES[0]);
      params.delete('paid');
      const nextSearch = params.toString();
      const cleanUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
      window.history.replaceState({}, '', cleanUrl);
      return;
    }

    if (urlCode) {
      fetch('/api/access/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: urlCode, deviceId }),
      })
        .then((res) => res.json())
        .then(
          (data: {
            valid?: boolean;
            token?: string;
            accessUrl?: string;
            error?: string;
          }) => {
            if (data.valid && data.token) {
              handleUnlock({ token: data.token, accessUrl: data.accessUrl });
              setView('pick');
            } else if (data.error) {
              setModalInitialTab('code');
              setModalInitialError(data.error);
              setView('pick');
              setExportTemplate(INITIAL_TEMPLATES[0]);
            }
          }
        )
        .catch(() => {
          // Ignore network errors on auto-unlock
        })
        .finally(() => {
          params.delete('access');
          const nextSearch = params.toString();
          const cleanUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
          window.history.replaceState({}, '', cleanUrl);
        });
      return;
    }

    if (!accessToken) {
      setIsUnlocked(false);
      return;
    }

    fetch('/api/access/status', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data: { unlocked?: boolean; accessUrl?: string }) => {
        if (data.unlocked) {
          setIsUnlocked(true);
          if (data.accessUrl) setPersonalAccessUrl(data.accessUrl);
        } else {
          handleLock();
        }
      })
      .catch(() => {
        // Ignore network errors
      });
  }, []);

  const activeTemplate = templatesState[activeTemplateId] || INITIAL_TEMPLATES[0];

  const handleUpdateActiveTemplate = (updated: SalesTemplate) => {
    setTemplatesState((prev) => ({
      ...prev,
      [updated.id]: updated,
    }));
  };

  const handleResetActiveTemplate = () => {
    const original = INITIAL_TEMPLATES.find((t) => t.id === activeTemplateId);
    if (!original) return;
    setTemplatesState((prev) => ({
      ...prev,
      [original.id]: original,
    }));
  };

  const handlePromoteToEngine = () => {
    const validator = templatesState['validator-smoke-test'] || INITIAL_TEMPLATES[0];
    const targetId = 'quiet-editorial-kit';
    setTemplatesState((prev) => {
      const baseEngine = prev[targetId] || INITIAL_TEMPLATES[1];
      const promoted: SalesTemplate = {
        ...baseEngine,
        brandName: validator.brandName,
        heroEyebrow: validator.heroEyebrow,
        heroHeadline: validator.heroHeadline,
        heroSubheadline: validator.heroSubheadline,
        leadDestinationType: validator.leadDestinationType,
        leadDestinationValue: validator.leadDestinationValue,
        pricingTiers: baseEngine.pricingTiers.map((tier, idx) =>
          idx === 0 && validator.pricingTiers[0]?.monthlyPrice
            ? { ...tier, monthlyPrice: validator.pricingTiers[0].monthlyPrice }
            : tier
        ),
      };
      return {
        ...prev,
        [targetId]: promoted,
      };
    });
    setActiveTemplateId(targetId);
  };

  const handleStartTemplate = (templateId: string) => {
    setActiveTemplateId(templateId);
    setInspectorOpen(true);
    setView('edit');
  };

  const handleLoadSnapshot = (tpl: SalesTemplate) => {
    setTemplatesState((prev) => ({
      ...prev,
      [tpl.id]: tpl,
    }));
    setActiveTemplateId(tpl.id);
    setInspectorOpen(true);
    setView('edit');
  };

  const handleSaveSnapshot = (snapshotName: string) => {
    const newSnapshot: SavedSnapshot = {
      id: `snap-${Date.now()}`,
      savedAt: new Date().toISOString(),
      snapshotName,
      template: JSON.parse(JSON.stringify(activeTemplate)) as SalesTemplate,
    };
    setSnapshots((prev) => [newSnapshot, ...prev]);
  };

  const handleDeleteSnapshot = (id: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
  };

  const viewportContainerClass =
    viewportMode === 'mobile'
      ? 'max-w-[390px] mx-auto'
      : viewportMode === 'tablet'
        ? 'max-w-[768px] mx-auto'
        : 'w-full';

  return (
    <div className="min-h-screen bg-[#E8EEF5] text-[#0F172A] flex flex-col">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#E8EEF5]/95 backdrop-blur-xs border-b border-[#CFD9E4]">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#product"
            onClick={(e) => {
              e.preventDefault();
              setView('sales');
            }}
            className="font-display-studio text-xl font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0"
          >
            <strong>BiasharaBase Page Studio</strong>
          </a>

          {/* Zone 2: 4 Clean Navigation Links */}
          <nav className="flex items-center gap-6 text-sm font-medium text-[#475569] overflow-x-auto">
            {([
              { id: 'sales', label: 'Product' },
              { id: 'pick', label: '1. Pick Template' },
              { id: 'edit', label: '2. Edit Your Page' },
              { id: 'saved', label: `Saved (${snapshots.length})` },
            ] as const).map((item) => {
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'border-[#0F172A] text-[#0F172A]'
                      : 'border-transparent hover:text-[#0F172A]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="shrink-0">
            {view === 'sales' ? (
              <a
                href={
                  /^https?:\/\//i.test(selarUrl.trim())
                    ? selarUrl.trim()
                    : 'https://selar.com/n57778lu4q'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] rounded-lg hover:bg-[#115E59] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Get Studio — $24 / TSh 67,500
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setExportTemplate(activeTemplate)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0F172A] rounded-lg hover:bg-[#1E293B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Download HTML
              </button>
            )}
          </div>
        </div>
      </header>

      {view === 'sales' && (
        <div className="flex-1">
          <QuietPageStudioSalesPage
            selarUrl={selarUrl}
            onSelarUrlChange={setSelarUrl}
            onLaunchBuilder={(templateId) => {
              if (templateId) {
                handleStartTemplate(templateId);
              } else {
                setView('pick');
              }
            }}
            onExportSelfHtml={() =>
              setExportTemplate({
                ...QUIET_PAGE_STUDIO_TEMPLATE,
                checkoutUrl: selarUrl.trim() || 'https://selar.com/n57778lu4q',
              })
            }
            onOpenOwnerLicenses={() => setOwnerModalOpen(true)}
          />
        </div>
      )}

      {view === 'pick' && (
        <div className="flex-1">
          <HomeOverview
            templates={Object.values(templatesState)}
            onStartTemplate={handleStartTemplate}
          />
        </div>
      )}

      {view === 'saved' && (
        <main className="flex-1">
          <TemplateGalleryView
            templates={Object.values(templatesState)}
            activeTemplateId={activeTemplateId}
            snapshots={snapshots}
            onSelectTemplate={handleLoadSnapshot}
            onDeleteSnapshot={handleDeleteSnapshot}
            initialTab="saved"
          />
        </main>
      )}

      {view === 'edit' && (
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 md:px-6 py-5 flex flex-col gap-5">
          {/* Workspace Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#F4F7FA] border border-[#CFD9E4] rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-3 overflow-x-auto">
              <button
                type="button"
                onClick={() => setInspectorOpen((v) => !v)}
                aria-label={inspectorOpen ? 'Hide editor panel' : 'Show editor panel'}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#334155] hover:text-[#0F172A] bg-[#E2E9F2] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {inspectorOpen ? (
                  <PanelLeftClose className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <PanelLeftOpen className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span>{inspectorOpen ? 'Full Preview' : 'Edit Page'}</span>
              </button>

              <div className="flex items-center gap-1 p-1 bg-[#E2E9F2] rounded-lg">
                {INITIAL_TEMPLATES.map((tpl) => {
                  const active = tpl.id === activeTemplateId;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setActiveTemplateId(tpl.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#FAFCFE] text-[#0F172A] shadow-xs'
                          : 'text-[#475569] hover:text-[#0F172A]'
                      }`}
                    >
                      {tpl.name}
                    </button>
                  );
                })}
              </div>

              {activeTemplate.productLink === 'Test a New Idea' && (
                <button
                  type="button"
                  onClick={handlePromoteToEngine}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F766E] bg-[#F0FDFA] border border-[#99F6E4] rounded-lg hover:bg-[#CCFBF1] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Upgrade to Full Sales Page</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Viewport Width Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#E2E9F2] border border-[#CFD9E4] rounded-lg shrink-0">
              {([
                { id: 'desktop', label: 'Desktop', Icon: Monitor },
                { id: 'tablet', label: 'Tablet', Icon: Tablet },
                { id: 'mobile', label: 'Mobile', Icon: Smartphone },
              ] as const).map(({ id, label, Icon }) => {
                const active = viewportMode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setViewportMode(id)}
                    aria-label={`${label} preview`}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#FAFCFE] text-[#0F172A] shadow-xs'
                        : 'text-[#475569] hover:text-[#0F172A]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Studio Split Workspace */}
          <div className="flex flex-col lg:flex-row items-start gap-5 flex-1">
            {inspectorOpen && (
              <TemplateEditorRail
                template={activeTemplate}
                onChange={handleUpdateActiveTemplate}
                onReset={handleResetActiveTemplate}
                onSaveSnapshot={handleSaveSnapshot}
                onImportTemplate={handleLoadSnapshot}
              />
            )}

            <div className="flex-1 min-w-0 w-full space-y-2.5">
              <div className="flex items-center justify-between gap-4 px-1 text-xs text-[#475569]">
                <span>
                  Live Preview · Sample text for {activeTemplate.brandName}
                </span>
                <span>Changes on the left update this page immediately</span>
              </div>
              <div
                className={`${viewportContainerClass} rounded-xl border border-[#CFD9E4] overflow-hidden shadow-xs transition-all duration-200`}
              >
                <SalesPageRenderer
                  template={activeTemplate}
                  viewportMode={viewportMode}
                />
              </div>
            </div>
          </div>
        </main>
      )}

      {exportTemplate && (
        <ExportCodeModal
          template={exportTemplate}
          selarUrl={selarUrl}
          deviceId={deviceId}
          accessToken={accessToken}
          isUnlocked={isUnlocked}
          initialUnlockTab={modalInitialTab}
          initialError={modalInitialError}
          personalAccessUrl={personalAccessUrl}
          onUnlock={handleUnlock}
          onLock={handleLock}
          onClose={() => {
            setModalInitialError('');
            setExportTemplate(null);
          }}
        />
      )}

      {ownerModalOpen && (
        <OwnerLicenseModal onClose={() => setOwnerModalOpen(false)} />
      )}
    </div>
  );
}
