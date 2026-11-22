export type TemplateCategory =
  | 'Idea Test'
  | 'Digital Product'
  | 'Productized Service'
  | 'B2B Technical';

export type BiasharaProductLink = 'Test a New Idea' | 'Sell an Offer';

export type LeadDestinationType = 'email' | 'formspree' | 'whatsapp';

export type SectionId =
  | 'hero'
  | 'contrast'
  | 'capabilities'
  | 'proof'
  | 'pricing'
  | 'faq'
  | 'capture'
  | 'footer';

export type ThemeSurface = 'crisp-light' | 'warm-stone' | 'obsidian-dark';

export type FontPairingId =
  | 'jakarta-dm'
  | 'bricolage-manrope'
  | 'outfit-public'
  | 'archivo-public'
  | 'playfair-dm';

export type HeroVariant = 'split-media' | 'editorial-centered';

export interface CapabilityItem {
  id: string;
  title: string;
  description: string;
  deliverable: string;
  span: 1 | 2;
}

export interface ProofCaseItem {
  id: string;
  client: string;
  sector: string;
  metric: string;
  context: string;
  quote: string;
  authorName: string;
  authorRole: string;
}

export interface PricingTier {
  id: string;
  name: string;
  summary: string;
  monthlyPrice: string;
  annualPrice: string;
  unitLabel: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SectionConfig {
  id: SectionId;
  label: string;
  enabled: boolean;
}

export interface SalesTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  productLink: BiasharaProductLink;
  description: string;
  brandName: string;
  trustMarker: string;
  navLinks: string[];
  heroVariant: HeroVariant;
  surface: ThemeSurface;
  fontPairing: FontPairingId;
  accentColor: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  primaryCtaLabel: string;
  secondaryNote: string;
  heroImage: string;
  heroImageAlt: string;
  kpiStrip: Array<{ value: string; label: string }>;
  contrastHeading: string;
  beforeTitle: string;
  beforePoints: string[];
  afterTitle: string;
  afterPoints: string[];
  capabilitiesHeading: string;
  capabilitiesIntro: string;
  capabilities: CapabilityItem[];
  proofHeading: string;
  proofIntro: string;
  proofCases: ProofCaseItem[];
  pricingHeading: string;
  pricingBillingLabels: [string, string];
  pricingTiers: PricingTier[];
  guaranteeTitle: string;
  guaranteeBody: string;
  faqHeading: string;
  faqs: FaqItem[];
  captureHeading: string;
  captureSubheading: string;
  captureButtonLabel: string;
  leadDestinationType: LeadDestinationType;
  leadDestinationValue: string;
  checkoutUrl?: string;
  footerLegal: string;
  footerContact: string;
  sections: SectionConfig[];
}

export interface SavedSnapshot {
  id: string;
  savedAt: string;
  snapshotName: string;
  template: SalesTemplate;
}
