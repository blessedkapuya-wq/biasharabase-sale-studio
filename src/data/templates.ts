import { SalesTemplate } from '../types/template';

export const ACCENT_PRESETS: Array<{ label: string; value: string }> = [
  { label: 'Cobalt', value: '#1E40AF' },
  { label: 'Forest Teal', value: '#0F766E' },
  { label: 'Warm Amber', value: '#B45309' },
  { label: 'Steel Blue', value: '#0369A1' },
  { label: 'Crimson', value: '#B91C1C' },
];

export const FONT_PAIRINGS: Array<{ id: SalesTemplate['fontPairing']; label: string; detail: string }> = [
  { id: 'jakarta-dm', label: 'Plus Jakarta Sans + DM Sans', detail: 'Clean modern business' },
  { id: 'bricolage-manrope', label: 'Bricolage Grotesque + DM Sans', detail: 'Expressive product style' },
  { id: 'outfit-public', label: 'Outfit + Public Sans', detail: 'Crisp software & tech' },
  { id: 'archivo-public', label: 'Archivo + Public Sans', detail: 'Structured industrial & B2B' },
  { id: 'playfair-dm', label: 'Playfair Display + DM Sans', detail: 'Editorial & consulting' },
];

export const SURFACE_OPTIONS: Array<{ id: SalesTemplate['surface']; label: string }> = [
  { id: 'crisp-light', label: 'Mineral Slate' },
  { id: 'warm-stone', label: 'Warm Paper' },
  { id: 'obsidian-dark', label: 'Dark Slate' },
];

export const INITIAL_TEMPLATES: SalesTemplate[] = [
  {
    id: 'validator-smoke-test',
    name: 'Idea Test & Pre-Order Page',
    category: 'Idea Test',
    productLink: 'Test a New Idea',
    description:
      'Test if real customers will pay or join a waitlist before you spend months building.',
    brandName: 'LedgerPulse',
    trustMarker: '100% Refundable Pilot Deposit · 25 Founding Spots',
    navLinks: ['Why It Matters', 'What You Get', 'Pricing', 'Join Pilot'],
    heroVariant: 'split-media',
    surface: 'crisp-light',
    fontPairing: 'outfit-public',
    accentColor: '#0F766E',
    heroEyebrow: 'For Import & Wholesale Businesses',
    heroHeadline: 'Stop losing 12 hours a month matching supplier invoices by hand.',
    heroSubheadline:
      'Forward your supplier PDFs and bank receipts. LedgerPulse matches every payment automatically and flags hidden currency fees before you price your stock.',
    primaryCtaLabel: 'Reserve Your Pilot Spot',
    secondaryNote: 'Only 15 founding businesses needed to greenlight launch. Full refund if we do not ship.',
    heroImage: '/src/assets/images/template_saas_workspace_1795357728097.jpg',
    heroImageAlt: 'Small operations team reviewing invoices in a bright office.',
    kpiStrip: [
      { value: '12 hrs', label: 'Saved every month on invoice matching' },
      { value: '18 / 25', label: 'Business owners interviewed before build' },
      { value: '$49/mo', label: 'Locked founding member price' },
      { value: '21 Days', label: 'Guaranteed first-version delivery' },
    ],
    contrastHeading: 'Why we are building a simpler alternative to bloated accounting tools.',
    beforeTitle: 'How most importers handle it today',
    beforePoints: [
      'Spending late nights copying numbers from supplier PDFs into Excel',
      'Discovering 3% hidden bank and clearing fees weeks after selling stock',
      'Paying for heavy ERP software nobody on your team actually uses',
    ],
    afterTitle: 'What changes with LedgerPulse',
    afterPoints: [
      'Forward supplier invoices to one email and see matched totals in minutes',
      'Instant alert whenever a bank debit differs from your supplier quote',
      'True landed cost per item calculated before you set retail prices',
    ],
    capabilitiesHeading: 'What is included in the founding pilot.',
    capabilitiesIntro:
      'Built directly around the three tasks 18 importers told us cost them the most time and margin.',
    capabilities: [
      {
        id: 'val-1',
        title: '01. Automatic Invoice & Currency Reading',
        description:
          'Forward supplier proforma and commercial invoices to a private inbox to pull itemized costs, exchange rates, and freight fees automatically.',
        deliverable: 'Works with PDF, photo, and email attachments',
        span: 2,
      },
      {
        id: 'val-2',
        title: '02. Bank Fee & Rate Alerts',
        description:
          'Flags exchange-rate slippage and unexpected wire charges before your monthly books close.',
        deliverable: 'Exports to Xero, QuickBooks, or CSV',
        span: 1,
      },
      {
        id: 'val-3',
        title: '03. True Cost Per Item',
        description:
          'Calculates exact landed cost per SKU after customs duties, clearing fees, and local transit.',
        deliverable: 'Updated for every shipment batch',
        span: 1,
      },
      {
        id: 'val-4',
        title: '04. Custom Setup for Your Suppliers',
        description:
          'We personally configure your top 5 supplier invoice formats during Week 1 so nothing breaks on launch.',
        deliverable: 'Direct founder support included',
        span: 2,
      },
    ],
    proofHeading: 'Real problems shared during our pre-build interviews.',
    proofIntro: 'Why 16 of 18 interviewed business owners asked to test the first version.',
    proofCases: [
      {
        id: 'val-proof-1',
        client: 'Kariuki Hardware Imports',
        sector: 'Wholesale Distribution · 9 Staff',
        metric: '14 Hours / Month Lost to Spreadsheets',
        context: 'Tracked manual entry across 42 monthly supplier shipments.',
        quote:
          'By the time we catch a 3% clearing fee mistake, we have already priced the batch to retail buyers. Catching that before we invoice pays for this tool on day one.',
        authorName: 'Samuel Kariuki',
        authorRole: 'Managing Director, Kariuki Hardware Imports',
      },
      {
        id: 'val-proof-2',
        client: 'Mombasa Spice Traders',
        sector: 'Specialty Export · 14 Staff',
        metric: '$1,850 Annual Fee Leakage Caught',
        context: 'Reviewed Q2 customs bills and bank transfer receipts.',
        quote:
          'We do not want complicated accounting software. We just want our supplier PDFs matched to bank payments without typing numbers at 10 PM.',
        authorName: 'Amina Hassan',
        authorRole: 'Finance Lead, Mombasa Spice Traders',
      },
    ],
    pricingHeading: 'Choose how you want to join.',
    pricingBillingLabels: ['Paid Pilot Deposit', 'Free Waitlist'],
    pricingTiers: [
      {
        id: 'val-tier-1',
        name: 'Founding Pilot Spot',
        summary: 'Reserve your spot with a fully refundable $49 deposit and lock founding pricing for two years.',
        monthlyPrice: '$49',
        annualPrice: '$0',
        unitLabel: 'refundable deposit',
        highlighted: true,
        features: [
          'Guaranteed slot in the first 25 businesses',
          'Price locked at $49/mo for 24 months after launch',
          'Custom setup for your top 5 supplier templates',
          'Automatic full refund if we miss the 21-day launch date',
        ],
        ctaLabel: 'Lock Founding Spot',
      },
      {
        id: 'val-tier-2',
        name: 'Free Observer Waitlist',
        summary: 'Stay updated on our build progress and join later when public accounts open.',
        monthlyPrice: '$0',
        annualPrice: '$0',
        unitLabel: 'no commitment',
        features: [
          'Progress updates every two weeks',
          'Early notice when public pricing opens',
          'Short survey to request specific integrations',
          'No card or deposit needed',
        ],
        ctaLabel: 'Join Free Waitlist',
      },
    ],
    guaranteeTitle: 'Zero-Risk Pilot Guarantee',
    guaranteeBody:
      'Your $49 deposit sits in reserve until the first working version is live with your supplier invoices. If we miss our 21-day build deadline—or if the tool does not save you time in the first 30 days—you get every cent back automatically.',
    faqHeading: 'Common questions before joining.',
    faqs: [
      {
        id: 'val-faq-1',
        question: 'What happens if fewer than 15 businesses join?',
        answer:
          'We refund every founding deposit in full within 48 hours and send you the summary notes from our research.',
      },
      {
        id: 'val-faq-2',
        question: 'Do we have to switch away from QuickBooks or Xero?',
        answer:
          'No. LedgerPulse sits in front of your accounting software and exports clean, matched spreadsheets you can import in two clicks.',
      },
      {
        id: 'val-faq-3',
        question: 'How long does onboarding take?',
        answer:
          'Less than 15 minutes. Just forward 3–5 sample supplier invoices and we handle the initial setup for you.',
      },
    ],
    captureHeading: 'Reserve your spot or ask a question.',
    captureSubheading:
      'Enter your details below. We reply personally within one business day with next steps.',
    captureButtonLabel: 'Confirm My Request',
    leadDestinationType: 'email',
    leadDestinationValue: 'founder@ledgerpulse.example',
    footerLegal: 'LedgerPulse · Built with BiasharaBase Page Studio',
    footerContact: 'founder@ledgerpulse.example · Ask a question anytime',
    sections: [
      { id: 'hero', label: 'Top Hero & Headline', enabled: true },
      { id: 'contrast', label: 'Before vs. After Comparison', enabled: true },
      { id: 'capabilities', label: 'What Is Included', enabled: true },
      { id: 'proof', label: 'Customer Proof', enabled: true },
      { id: 'pricing', label: 'Pricing & Guarantee', enabled: true },
      { id: 'faq', label: 'Common Questions (FAQ)', enabled: true },
      { id: 'capture', label: 'Order / Inquiry Form', enabled: true },
      { id: 'footer', label: 'Bottom Footer', enabled: true },
    ],
  },
  {
    id: 'quiet-editorial-kit',
    name: 'Digital Product Sales Page',
    category: 'Digital Product',
    productLink: 'Sell an Offer',
    description:
      'High-converting sales page for a digital kit, course, software tool, or handbook—built to sell calmly without hype.',
    brandName: 'Launch Handbook',
    trustMarker: 'Instant Download · 30-Day Money-Back Guarantee',
    navLinks: ['Why It Works', 'What Is Inside', 'Pricing', 'Get Instant Access'],
    heroVariant: 'split-media',
    surface: 'obsidian-dark',
    fontPairing: 'bricolage-manrope',
    accentColor: '#B45309',
    heroEyebrow: 'For Solo Founders, Consultants & Digital Creators',
    heroHeadline: 'Turn validated customer problems into steady weekly sales without loud marketing.',
    heroSubheadline:
      'Get the exact sales page layouts, plain-text email sequences, and pricing playbooks used by 410+ lean founders to sell consistently without fake timers or popups.',
    primaryCtaLabel: 'Get Instant Access — $129',
    secondaryNote: 'One-time payment. Instant download with lifetime updates and a 30-day full refund guarantee.',
    heroImage: '/src/assets/images/template_hardware_product_1795357727808.jpg',
    heroImageAlt: 'Matte black desktop speaker and brass dial representing durable, well-crafted tools.',
    kpiStrip: [
      { value: '410+', label: 'Founders using these sales templates' },
      { value: '4.8%', label: 'Average visitor-to-buyer conversion rate' },
      { value: '0 Calls', label: 'Sales calls needed to close digital offers' },
      { value: '30 Days', label: 'Full money-back guarantee' },
    ],
    contrastHeading: 'Why calm, clear pages outsell noisy hype funnels.',
    beforeTitle: 'What hurts conversion on most pages',
    beforePoints: [
      'Vague buzzwords that fail to explain what the buyer actually receives',
      'Fake countdown clocks and popups that make skeptical buyers close the tab',
      'Weak pricing sections with no proof or risk-reversal guarantee',
    ],
    afterTitle: 'What a calm, clear sales page delivers',
    afterPoints: [
      'A clear Before vs. After story that makes the value obvious in 10 seconds',
      'Real customer numbers and quotes placed right next to every claim',
      'Honest pricing + a bold guarantee that removes hesitation at checkout',
    ],
    capabilitiesHeading: 'Everything you get inside the kit.',
    capabilitiesIntro:
      'No 40-hour video fluff. Practical, fill-in-the-blank templates you can publish this weekend.',
    capabilities: [
      {
        id: 'qse-1',
        title: '01. 6 Proven Sales Page Blueprints',
        description:
          'Complete page structures for digital products, productized services, waitlists, and B2B quotes—ready to customize and export.',
        deliverable: 'Includes HTML + copy prompts',
        span: 2,
      },
      {
        id: 'qse-2',
        title: '02. 5 Plain-Text Follow-Up Emails',
        description:
          'Helpful, conversational emails that answer real buyer questions and bring readers back to buy naturally.',
        deliverable: 'Works in any email tool',
        span: 1,
      },
      {
        id: 'qse-3',
        title: '03. Objection & Guarantee Scripts',
        description:
          'Word-for-word templates for writing risk-reversal guarantees, FAQs, and clear offer boundaries.',
        deliverable: '18 field-tested examples',
        span: 1,
      },
      {
        id: 'qse-4',
        title: '04. Idea-to-Offer Mapping Workbook',
        description:
          'Turn customer interview notes directly into sharp headlines, pricing tiers, and proof blocks in under an hour.',
        deliverable: 'Annotated before-and-after examples',
        span: 2,
      },
    ],
    proofHeading: 'Real sales from business owners using this approach.',
    proofIntro: 'Measured across digital downloads, templates, and niche B2B workshops.',
    proofCases: [
      {
        id: 'qse-proof-1',
        client: 'Tala Operations Manual',
        sector: 'Retail SOP Digital Kit',
        metric: '$14,200 in 90 Days with Zero Ad Spend',
        context: 'Replaced a noisy webinar funnel with one clear, honest sales page.',
        quote:
          'Removing fake scarcity actually doubled our conversion rate from 2.1% to 4.6%. Buyers told us the page felt trustworthy and respected their time.',
        authorName: 'Grace Mwikali',
        authorRole: 'Founder, Tala Operations',
      },
      {
        id: 'qse-proof-2',
        client: 'Kibo Ledger Templates',
        sector: 'Spreadsheet & Automation Pack',
        metric: '3.4x Higher Average Order Value',
        context: 'Offered both a Single-User edition and a Team License side by side.',
        quote:
          'Adding a simple Team License option let small businesses buy for their whole staff on the spot without scheduling a phone call.',
        authorName: 'Daniel Osei',
        authorRole: 'Creator, Kibo Ledger',
      },
    ],
    pricingHeading: 'One-time payment. Yours forever.',
    pricingBillingLabels: ['Single Business', 'Team / Multi-Brand'],
    pricingTiers: [
      {
        id: 'qse-tier-1',
        name: 'Single Business License',
        summary: 'All 6 sales page blueprints, plain-text email sequences, and objection scripts for one business.',
        monthlyPrice: '$129',
        annualPrice: '$249',
        unitLabel: 'one-time payment',
        features: [
          'All 6 high-converting sales page blueprints',
          '5-part plain-text email follow-up sequence',
          'Headline & guarantee writing workbook',
          'Lifetime template updates included',
        ],
        ctaLabel: 'Get Single License',
      },
      {
        id: 'qse-tier-2',
        name: 'Team & Agency Bundle',
        summary: 'Includes full commercial rights for up to 5 brands—plus a personal review of your live page.',
        monthlyPrice: '$219',
        annualPrice: '$349',
        unitLabel: 'one-time payment',
        highlighted: true,
        features: [
          'Everything in Single Business License',
          'Idea-testing & pre-order blueprints included',
          'Commercial license for up to 5 brands or clients',
          'Written teardown review of your live page',
        ],
        ctaLabel: 'Get Team Bundle',
      },
    ],
    guaranteeTitle: '30-Day "Use It & Judge for Yourself" Guarantee',
    guaranteeBody:
      'Download the entire kit, customize your page, and test it with your audience. If you do not feel it gave you a sharper, higher-converting sales page within 30 days, reply to your receipt email for a full refund.',
    faqHeading: 'Questions buyers usually ask.',
    faqs: [
      {
        id: 'qse-faq-1',
        question: 'Do I need coding skills to publish my page?',
        answer:
          'No. Fill in your details, download the single HTML file, and drop it onto free hosting like Netlify Drop in minutes.',
      },
      {
        id: 'qse-faq-2',
        question: 'Does this work for services as well as digital products?',
        answer:
          'Yes. The bundle includes layouts tailored for digital downloads, consulting retainers, pre-orders, and B2B quotes.',
      },
      {
        id: 'qse-faq-3',
        question: 'Are there any monthly fees after I buy?',
        answer:
          'Zero. You pay once, own your downloaded pages forever, and receive future updates free.',
      },
    ],
    captureHeading: 'Get instant access or request a company invoice.',
    captureSubheading: 'Enter your email below to receive your download link immediately or request a VAT invoice.',
    captureButtonLabel: 'Send My Access Link',
    leadDestinationType: 'email',
    leadDestinationValue: 'hello@biasharabase.example',
    footerLegal: 'Launch Handbook · Built with BiasharaBase Page Studio',
    footerContact: 'hello@biasharabase.example · Replies within 1 business day',
    sections: [
      { id: 'hero', label: 'Top Hero & Headline', enabled: true },
      { id: 'contrast', label: 'Before vs. After Comparison', enabled: true },
      { id: 'capabilities', label: 'What Is Included', enabled: true },
      { id: 'proof', label: 'Customer Proof', enabled: true },
      { id: 'pricing', label: 'Pricing & Guarantee', enabled: true },
      { id: 'faq', label: 'Common Questions (FAQ)', enabled: true },
      { id: 'capture', label: 'Order / Inquiry Form', enabled: true },
      { id: 'footer', label: 'Bottom Footer', enabled: true },
    ],
  },
  {
    id: 'quiet-productized-service',
    name: 'Service & Consulting Page',
    category: 'Productized Service',
    productLink: 'Sell an Offer',
    description:
      'Sell a monthly consulting retainer or fixed-price service package with clear scope, proof, and risk-free onboarding.',
    brandName: 'Meridian Desk',
    trustMarker: 'Fixed Monthly Scope · Cancel Any Quarter',
    navLinks: ['Why Us', 'Deliverables', 'Packages', 'Request Review'],
    heroVariant: 'split-media',
    surface: 'crisp-light',
    fontPairing: 'jakarta-dm',
    accentColor: '#1E40AF',
    heroEyebrow: 'For B2B Software & Advisory Firms',
    heroHeadline: 'Predictable inbound leads every month—without agency retainers that drag on.',
    heroSubheadline:
      'We research, write, and launch high-converting sales pages and outreach systems for one flat monthly fee. Clear weekly deliverables, zero long-term lock-in.',
    primaryCtaLabel: 'Get a Free 10-Min Page Review',
    secondaryNote: 'We send a personalized video teardown of your current page within 48 hours—no sales call required.',
    heroImage: '/src/assets/images/template_agency_studio_1795357726293.jpg',
    heroImageAlt: 'Consulting partners meeting around a stone table in a bright modern office.',
    kpiStrip: [
      { value: '$18.4M', label: 'Qualified sales pipeline built for clients' },
      { value: '+140%', label: 'Average lift in qualified buyer inquiries' },
      { value: '4.2x', label: 'Median return across 12-month sprints' },
      { value: '14 Days', label: 'From kickoff to your first live asset' },
    ],
    contrastHeading: 'How a fixed-scope sprint compares to traditional agencies.',
    beforeTitle: 'Typical agency headaches',
    beforePoints: [
      'Waiting 3 weeks for custom proposals and 6 weeks for a first draft',
      'Junior account managers who do not understand your technical buyers',
      '12-month lock-in contracts tied to vanity clicks instead of pipeline',
    ],
    afterTitle: 'Working with Meridian Desk',
    afterPoints: [
      'Clear quarterly scope with new live pages shipping every 14 days',
      'Senior writers and designers interviewing your best customers directly',
      'Plain-English reporting tied strictly to qualified leads and revenue',
    ],
    capabilitiesHeading: 'What ships every month.',
    capabilitiesIntro:
      'One tight-knit pod handles buyer research, copywriting, page design, and CRM attribution together.',
    capabilities: [
      {
        id: 'ps-1',
        title: '01. High-Intent Search & Comparison Pages',
        description:
          'Pages built around the exact comparisons and pricing questions buyers search right before choosing a vendor.',
        deliverable: '12 buyer-ready pages per quarter',
        span: 2,
      },
      {
        id: 'ps-2',
        title: '02. Targeted Decision-Maker Outreach',
        description:
          'Clean, verified contact lists paired with concise, respectful emails that earn real replies.',
        deliverable: '1,200 decision-makers reached monthly',
        span: 1,
      },
      {
        id: 'ps-3',
        title: '03. Conversion-Focused Landing Pages',
        description:
          'Sharp headlines, clear pricing boundaries, and fast quote forms wired directly into your CRM.',
        deliverable: 'Continuous headline & form testing',
        span: 1,
      },
      {
        id: 'ps-4',
        title: '04. Closed-Loop Revenue Tracking',
        description:
          'Bi-weekly summaries showing exactly which pages turned into qualified sales conversations and closed deals.',
        deliverable: 'Plain-English digest every 2 weeks',
        span: 2,
      },
    ],
    proofHeading: 'Measured client outcomes.',
    proofIntro: 'Audited CRM performance across multi-quarter engagements.',
    proofCases: [
      {
        id: 'ps-proof-1',
        client: 'Vantage Freight Systems',
        sector: 'Supply Chain Software',
        metric: '+140% Qualified Inbound Leads in 6 Months',
        context: 'Rebuilt 18 commercial product pages and simplified enterprise demo intake.',
        quote:
          'Qualified demos rose from 14 to 34 a month while our cost per new customer dropped 28%.',
        authorName: 'Claire Halstead',
        authorRole: 'VP of Revenue, Vantage Freight Systems',
      },
      {
        id: 'ps-proof-2',
        client: 'Kaldor Compliance Group',
        sector: 'Financial Risk Advisory',
        metric: '$2.4M Net-New Pipeline in 120 Days',
        context: 'Launched a diagnostic offer page targeting European banking controllers.',
        quote:
          'They turned six complex compliance audits into a clear three-step offer buyers understood immediately.',
        authorName: 'Henrik Lindqvist',
        authorRole: 'Managing Partner, Kaldor Compliance Group',
      },
    ],
    pricingHeading: 'Flat monthly pricing. No ad-spend markups.',
    pricingBillingLabels: ['Quarterly Plan', 'Annual Plan'],
    pricingTiers: [
      {
        id: 'ps-tier-1',
        name: 'Starter Growth Sprint',
        summary: 'Best for B2B teams building a steady stream of qualified inbound demos.',
        monthlyPrice: '$4,800',
        annualPrice: '$3,900',
        unitLabel: 'per month',
        features: [
          'Messaging & offer positioning blueprint',
          '2 custom high-intent sales pages monthly',
          'CRM lead routing & tracking setup',
          'Weekly async video progress updates',
        ],
        ctaLabel: 'Choose Starter Sprint',
      },
      {
        id: 'ps-tier-2',
        name: 'Full Revenue Partner',
        summary: 'Complete page creation, targeted outbound, and ongoing conversion optimization.',
        monthlyPrice: '$8,900',
        annualPrice: '$7,400',
        unitLabel: 'per month',
        highlighted: true,
        features: [
          'Dedicated senior writer, designer & strategist',
          '4 custom sales pages built each month',
          'Managed outreach to 1,200 target accounts',
          'Bi-weekly pipeline & ROI attribution report',
        ],
        ctaLabel: 'Choose Full Partner',
      },
    ],
    guaranteeTitle: 'First 14-Day Deliverable Guarantee',
    guaranteeBody:
      'If your first messaging blueprint and redesigned flagship sales page are not live and approved within 14 days of kickoff, your second month is free until they are.',
    faqHeading: 'Questions before starting.',
    faqs: [
      {
        id: 'ps-faq-1',
        question: 'How much of our team time does this take each week?',
        answer:
          'About 30 minutes for a kickoff interview in Week 1, then async Loom reviews you can watch on your own schedule.',
      },
      {
        id: 'ps-faq-2',
        question: 'Are we locked into a 12-month contract?',
        answer:
          'No. Quarterly plans renew every 90 days and can be paused or canceled with 14 days notice.',
      },
    ],
    captureHeading: 'Request a free 10-minute review of your current page.',
    captureSubheading: 'Share your URL and what you sell. We send back concrete conversion improvements within two business days.',
    captureButtonLabel: 'Send for Free Review',
    leadDestinationType: 'email',
    leadDestinationValue: 'partners@meridiandesk.example',
    footerLegal: 'Meridian Desk · Built with BiasharaBase Page Studio',
    footerContact: 'partners@meridiandesk.example · +1 (312) 555-0148',
    sections: [
      { id: 'hero', label: 'Top Hero & Headline', enabled: true },
      { id: 'contrast', label: 'Before vs. After Comparison', enabled: true },
      { id: 'capabilities', label: 'What Is Included', enabled: true },
      { id: 'proof', label: 'Customer Proof', enabled: true },
      { id: 'pricing', label: 'Pricing & Guarantee', enabled: true },
      { id: 'faq', label: 'Common Questions (FAQ)', enabled: true },
      { id: 'capture', label: 'Order / Inquiry Form', enabled: true },
      { id: 'footer', label: 'Bottom Footer', enabled: true },
    ],
  },
  {
    id: 'quiet-b2b-technical',
    name: 'B2B & Manufacturing Quote Page',
    category: 'B2B Technical',
    productLink: 'Sell an Offer',
    description:
      'Win high-value B2B or manufacturing contracts with clear technical tolerances, inspection proof, and 24-hour quoting.',
    brandName: 'Bauer Precision',
    trustMarker: 'ISO 9001 Certified · Quotes Returned in 24 Hours',
    navLinks: ['Why Bauer', 'Capabilities', 'Order Options', 'Request Quote'],
    heroVariant: 'split-media',
    surface: 'warm-stone',
    fontPairing: 'archivo-public',
    accentColor: '#0369A1',
    heroEyebrow: 'Contract CNC Machining & Sub-Assemblies',
    heroHeadline: 'Precision aluminum and titanium parts machined to ±0.005 mm—on schedule.',
    heroSubheadline:
      'From 10-piece validation batches to 50,000-unit annual supply contracts, we machine, anodize, and inspect parts under one roof with zero sub-tier delays.',
    primaryCtaLabel: 'Request a 24-Hour Quote',
    secondaryNote: 'Line-item pricing and manufacturability feedback returned within one business day.',
    heroImage: '/src/assets/images/template_oem_manufacturing_1795357728751.jpg',
    heroImageAlt: 'Clean modern CNC machining center and precision inspection arm on a factory floor.',
    kpiStrip: [
      { value: '±0.005 mm', label: 'Repeatable geometric accuracy' },
      { value: '99.4%', label: 'On-time dock delivery in 2025' },
      { value: '38 Cells', label: 'Automated 5-axis machines running daily' },
      { value: '24 Hours', label: 'Turnaround on technical RFQ quotes' },
    ],
    contrastHeading: 'Eliminate multi-vendor delays from your supply chain.',
    beforeTitle: 'Splitting work across job shops',
    beforePoints: [
      'Waiting weeks for quotes while parts ship back and forth for anodizing',
      'Missing material certificates and inconsistent tolerance inspections',
      'Assembly line stoppages when one sub-vendor misses a delivery window',
    ],
    afterTitle: 'Single-source production with Bauer',
    afterPoints: [
      'Machining, surface finishing, and CMM inspection inside one certified facility',
      'Serialized dimensional reports and mill certificates included in every box',
      '48-hour call-off releases from finished safety stock on blanket orders',
    ],
    capabilitiesHeading: 'Machining, finishing, and metrology under one roof.',
    capabilitiesIntro:
      'Single-source accountability from raw certified bar stock to finished parts ready for intake.',
    capabilities: [
      {
        id: 'oem-1',
        title: '01. Simultaneous 5-Axis Milling & Turning',
        description:
          'Automated palletized cells running titanium, 316L stainless, aluminum 6061, and engineering plastics.',
        deliverable: 'Max envelope: 850 × 700 × 550 mm',
        span: 2,
      },
      {
        id: 'oem-2',
        title: '02. Full Zeiss CMM Dimensional Inspection',
        description:
          'Every shipment includes serialized GD&T measurement reports and raw material certificates.',
        deliverable: 'ISO 9001 & AS9100D traceability',
        span: 1,
      },
      {
        id: 'oem-3',
        title: '03. In-House Anodizing & Passivation',
        description:
          'Controlled Type II/III hardcoat anodizing and passivation performed on-site without outside transit.',
        deliverable: 'Faster turnaround, zero transit damage',
        span: 1,
      },
      {
        id: 'oem-4',
        title: '04. Kanban Safety Stock & Blanket Orders',
        description:
          'Lock annual material pricing while drawing finished parts on 48-hour notice as production needs them.',
        deliverable: 'Quarterly or annual supply schedules',
        span: 2,
      },
    ],
    proofHeading: 'Trusted by hardware and medical engineering teams.',
    proofIntro: 'Audited quality and delivery records from active multi-year contracts.',
    proofCases: [
      {
        id: 'oem-proof-1',
        client: 'Vektor Medical Robotics',
        sector: 'Medical Actuator Housings',
        metric: 'Zero Rejected Lots Across 14,200 Units',
        context: 'Consolidated a 7-part surgical housing from three shops into one palletized cell.',
        quote:
          'Combining machining and anodizing under Bauer cut our incoming inspection queue by 60% and eliminated line stoppages for six straight quarters.',
        authorName: 'Dr. Lukas Weber',
        authorRole: 'Director of Supply Chain, Vektor Medical',
      },
      {
        id: 'oem-proof-2',
        client: 'Helios Photonics GmbH',
        sector: 'Optical Bench Mounts',
        metric: '41% Faster Ramp to Series Production',
        context: 'Simplified fixturing from five manual setups down to two automated steps.',
        quote:
          'Their engineers flagged two thin-wall ribs during quoting that saved us €18 per housing before tooling even started.',
        authorName: 'Sabine Hartmann',
        authorRole: 'Lead Mechanical Engineer, Helios Photonics',
      },
    ],
    pricingHeading: 'Two straightforward ways to order.',
    pricingBillingLabels: ['Pilot Batch', 'Series Contract'],
    pricingTiers: [
      {
        id: 'oem-tier-1',
        name: 'Prototype & Pilot Lot',
        summary: 'Fast validation runs (5–100 units) with full inspection reports and design feedback.',
        monthlyPrice: '10 Days',
        annualPrice: '7 Days',
        unitLabel: 'standard lead time',
        features: [
          '3.1 material certificates included',
          'CMM measurement report on critical tolerances',
          'Written cost-reduction DFM notes',
          'Direct call with a manufacturing engineer',
        ],
        ctaLabel: 'Request Pilot Quote',
      },
      {
        id: 'oem-tier-2',
        name: 'Ongoing Series Supply',
        summary: 'Reserved machine capacity (500–50,000 units/yr) with ready-to-ship safety stock.',
        monthlyPrice: 'Blanket PO',
        annualPrice: '20% Stocked',
        unitLabel: 'scheduled delivery',
        highlighted: true,
        features: [
          'Guaranteed machine capacity & locked alloy pricing',
          '48-hour call-off from finished safety stock',
          'Full PPAP & AS9100D quality documentation',
          'Dedicated program coordinator',
        ],
        ctaLabel: 'Request Series Quote',
      },
    ],
    guaranteeTitle: 'Spec-Match & On-Time Guarantee',
    guaranteeBody:
      'Every lot ships with serialized inspection data matching your drawing tolerances. Any out-of-spec component is air-freighted as a priority replacement within 72 hours at our cost.',
    faqHeading: 'Technical & quoting questions.',
    faqs: [
      {
        id: 'oem-faq-1',
        question: 'Which CAD file formats do you accept?',
        answer:
          'STEP (.stp/.step), IGES, Parasolid, and native SolidWorks files paired with 2D PDF tolerance drawings.',
      },
      {
        id: 'oem-faq-2',
        question: 'What is your minimum order quantity?',
        answer:
          'No minimum for pilot validation runs—we regularly machine batches as small as 5 prototypes prior to series contracts.',
      },
    ],
    captureHeading: 'Submit your part requirements for a 24-hour quote.',
    captureSubheading: 'Share your quantity, material, and timeline. Our engineers return line-item pricing within one business day.',
    captureButtonLabel: 'Submit Quote Request',
    leadDestinationType: 'email',
    leadDestinationValue: 'rfq@bauerprecision.example',
    footerLegal: 'Bauer Precision GmbH · Built with BiasharaBase Page Studio',
    footerContact: 'rfq@bauerprecision.example · +49 711 555 0134',
    sections: [
      { id: 'hero', label: 'Top Hero & Headline', enabled: true },
      { id: 'contrast', label: 'Before vs. After Comparison', enabled: true },
      { id: 'capabilities', label: 'Capabilities', enabled: true },
      { id: 'proof', label: 'Quality Proof', enabled: true },
      { id: 'pricing', label: 'Order Options & Guarantee', enabled: true },
      { id: 'faq', label: 'Common Questions (FAQ)', enabled: true },
      { id: 'capture', label: 'Quote Request Form', enabled: true },
      { id: 'footer', label: 'Bottom Footer', enabled: true },
    ],
  },
];
