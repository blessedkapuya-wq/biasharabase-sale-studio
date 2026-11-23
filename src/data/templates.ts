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
  { id: 'outfit-public', label: 'Outfit + Public Sans', detail: 'Crisp guide & toolkit' },
  { id: 'archivo-public', label: 'Archivo + Public Sans', detail: 'Structured workshop & cohort' },
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
      'Test if real buyers will pre-order your ebook, template pack, or mini-course before you spend weeks creating it.',
    brandName: 'Content Starter Pack',
    trustMarker: '100% Refundable Pre-Order · Only 20 Founding Spots',
    navLinks: ['Why It Matters', 'What You Get', 'Pre-Order', 'Join List'],
    heroVariant: 'split-media',
    surface: 'crisp-light',
    fontPairing: 'outfit-public',
    accentColor: '#0F766E',
    heroEyebrow: 'For Beginner Creators & Small Shop Owners',
    heroHeadline: 'Stop guessing what to post—get 30 plug-and-play WhatsApp & Instagram templates.',
    heroSubheadline:
      'Before we finish recording all walkthrough videos, reserve your founding copy at 50% off or join the free early-access list to vote on the niches included.',
    primaryCtaLabel: 'Reserve Early Access — $15',
    secondaryNote: 'Only 12 pre-orders needed to finalize launch. Full refund if we cancel.',
    heroImage: '/src/assets/images/tpl_idea_test_1795440535070.jpg',
    heroImageAlt: 'Solo digital creator sketching a product launch plan in a notebook beside a laptop.',
    kpiStrip: [
      { value: '30 Prompts', label: 'Fill-in-the-blank captions & post ideas' },
      { value: '14 / 20', label: 'Early buyers who already requested access' },
      { value: '$15 / TSh 39,000', label: 'Founding pre-order price (50% off)' },
      { value: '14 Days', label: 'Expected delivery date for full kit' },
    ],
    contrastHeading: 'Why test your digital product idea before spending a month building it.',
    beforeTitle: 'Building blindly in silence',
    beforePoints: [
      'Spending 6 weeks designing a 90-page guide nobody asked to buy',
      'Guessing which price or bonus beginners actually care about',
      'Feeling discouraged when launch day gets zero sales',
    ],
    afterTitle: 'Validating with a clear pre-order page',
    afterPoints: [
      'Measure real interest with a refundable $15 pre-order or free waitlist',
      'Collect buyer questions upfront so your guide answers what matters',
      'Finish building knowing real customers are already waiting',
    ],
    capabilitiesHeading: 'What founding buyers receive on launch day.',
    capabilitiesIntro:
      'Designed around the three bottlenecks beginner digital sellers told us slow them down every week.',
    capabilities: [
      {
        id: 'val-1',
        title: '01. 30 Ready-to-Customize Post Templates',
        description:
          'Copy-paste captions for WhatsApp Status, Instagram carousels, and Facebook tailored for beginners selling guides or services.',
        deliverable: 'Includes Canva links + plain-text scripts',
        span: 2,
      },
      {
        id: 'val-2',
        title: '02. 10-Minute Daily Posting Checklist',
        description:
          'Know exactly what to post Monday to Saturday without staring at a blank screen.',
        deliverable: 'Printable PDF & mobile sheet',
        span: 1,
      },
      {
        id: 'val-3',
        title: '03. DM & WhatsApp Reply Scripts',
        description:
          'Polite, clear replies for turning price inquiries into paid Selar or Mobile Money orders.',
        deliverable: '12 real conversation examples',
        span: 1,
      },
      {
        id: 'val-4',
        title: '04. Vote on the Bonus Niche Templates',
        description:
          'Founding members tell us their exact product or service so we include relevant examples in Week 1.',
        deliverable: 'Direct email & WhatsApp feedback',
        span: 2,
      },
    ],
    proofHeading: 'What beginners told us before we started building.',
    proofIntro: 'Real feedback collected from 14 early creators and small service sellers.',
    proofCases: [
      {
        id: 'val-proof-1',
        client: 'Neema Digital Guides',
        sector: 'Beginner Ebook Creator',
        metric: '5 Hours Saved Every Week',
        context: 'Shared feedback during our pre-build audience survey.',
        quote:
          'I finished my PDF guide two weeks ago, but I freeze every morning when it is time to write a post on Instagram or WhatsApp Status.',
        authorName: 'Neema Joseph',
        authorRole: 'Creator, Career Prep Guides',
      },
      {
        id: 'val-proof-2',
        client: 'Baraka Design Studio',
        sector: 'Freelance Logo & Flyer Services',
        metric: '1st Paid Pre-Order in 48 Hours',
        context: 'Tested a starter service bundle using an Idea Test page first.',
        quote:
          'Putting a simple pre-order page out showed me what clients actually wanted to pay for before I spent days making full sample portfolios.',
        authorName: 'Baraka Ally',
        authorRole: 'Freelance Designer, Dar es Salaam',
      },
    ],
    pricingHeading: 'Choose how you want to join.',
    pricingBillingLabels: ['Founding Pre-Order', 'Free Waitlist'],
    pricingTiers: [
      {
        id: 'val-tier-1',
        name: 'Founding Pre-Order Spot',
        summary: 'Lock the 50% early-bird price and receive the full starter pack first on release day.',
        monthlyPrice: '$15 · TSh 39,000',
        annualPrice: '$0',
        unitLabel: 'refundable pre-order',
        highlighted: true,
        features: [
          'Full 30-template Content Starter Pack on launch',
          '50% discount off the regular $29 price',
          'Request 1 custom niche example before release',
          '100% refund if not delivered within 14 days',
        ],
        ctaLabel: 'Reserve Founding Spot',
      },
      {
        id: 'val-tier-2',
        name: 'Free Early-Access Waitlist',
        summary: 'Get notified when the kit launches and tell us what topics you need most.',
        monthlyPrice: '$0',
        annualPrice: '$0',
        unitLabel: 'free to join',
        features: [
          'Launch-day email notification',
          '3 free sample post templates when you join',
          'Vote on future digital product examples',
          'Zero payment required today',
        ],
        ctaLabel: 'Join Free Waitlist',
      },
    ],
    guaranteeTitle: 'Zero-Risk Pre-Order Guarantee',
    guaranteeBody:
      'If the Content Starter Pack does not launch within 14 days—or if you open it and do not find it useful within 30 days—reply to your receipt for a full refund.',
    faqHeading: 'Common questions before joining.',
    faqs: [
      {
        id: 'val-faq-1',
        question: 'What happens if fewer than 12 people pre-order?',
        answer:
          'We refund every pre-order in full within 48 hours and still email everyone the 3 free sample templates as a thank-you.',
      },
      {
        id: 'val-faq-2',
        question: 'Do I need paid design software to use this?',
        answer:
          'No. All templates work with a free Canva account and plain text you can copy straight into WhatsApp or Instagram.',
      },
      {
        id: 'val-faq-3',
        question: 'Can I pay via Mobile Money as well as card?',
        answer:
          'Yes. You can reserve using Selar (Card, M-Pesa, Mobile Money) or leave your WhatsApp/email below to confirm your spot.',
      },
    ],
    captureHeading: 'Reserve your spot or ask a question.',
    captureSubheading:
      'Enter your details below and we will reply within one business day with your pre-order or waitlist confirmation.',
    captureButtonLabel: 'Confirm My Spot',
    leadDestinationType: 'email',
    leadDestinationValue: 'hello@contentstarter.example',
    footerLegal: 'Content Starter Pack · Built with BiasharaBase Page Studio',
    footerContact: 'hello@contentstarter.example · Ask a question anytime',
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
      'Sell an ebook, PDF guide, Notion/Canva template kit, or recorded mini-course calmly without hype.',
    brandName: 'Freelancer Starter Kit',
    trustMarker: 'Instant Download · 30-Day Money-Back Guarantee',
    navLinks: ['Why It Works', 'What Is Inside', 'Pricing', 'Get Instant Access'],
    heroVariant: 'split-media',
    surface: 'obsidian-dark',
    fontPairing: 'bricolage-manrope',
    accentColor: '#B45309',
    heroEyebrow: 'For Beginner Freelancers & Digital Creators',
    heroHeadline: 'Package your skills into a clear offer clients actually pay for.',
    heroSubheadline:
      'Get the exact 48-page starter handbook, pricing calculator, client proposal templates, and follow-up scripts used by 320+ beginners to land their first digital & freelance sales.',
    primaryCtaLabel: 'Get Instant Access — $19',
    secondaryNote: 'One-time payment ($19 / TSh 49,000). Instant PDF + template download with a 30-day guarantee.',
    heroImage: '/src/assets/images/tpl_digital_guide_1795440536109.jpg',
    heroImageAlt: 'Tablet showing a clean digital workbook beside a dark notebook and brass pen.',
    kpiStrip: [
      { value: '320+', label: 'Beginners using this starter kit' },
      { value: '48 Pages', label: 'Actionable handbook with zero fluff' },
      { value: '$19 / TSh 49,000', label: 'One-time download (yours forever)' },
      { value: '30 Days', label: 'Full money-back guarantee' },
    ],
    contrastHeading: 'Why clear starter offers sell faster than long, confusing pitches.',
    beforeTitle: 'What slows most beginners down',
    beforePoints: [
      'Guessing how much to charge and underpricing every project',
      'Writing messy DMs that make prospects say "I will get back to you"',
      'Watching endless tutorials instead of shipping one clear offer',
    ],
    afterTitle: 'What you get inside the Freelancer Starter Kit',
    afterPoints: [
      'Clear pricing menus in USD & TSh so clients understand your value fast',
      'Copy-paste proposal and WhatsApp scripts that earn confident replies',
      'A step-by-step launch checklist you can finish over a single weekend',
    ],
    capabilitiesHeading: 'Everything included inside the digital kit.',
    capabilitiesIntro:
      'Practical files you can open on your phone or laptop and start using today.',
    capabilities: [
      {
        id: 'qse-1',
        title: '01. The 48-Page Offer & Pricing Handbook (PDF)',
        description:
          'Plain-English steps for turning a skill—design, writing, social media, tutoring, or admin—into a clear fixed-price package.',
        deliverable: 'Readable on phone, tablet, or laptop',
        span: 2,
      },
      {
        id: 'qse-2',
        title: '02. 5 Client Message & Follow-Up Scripts',
        description:
          'Friendly WhatsApp and email scripts for answering price questions and following up without feeling pushy.',
        deliverable: 'Copy-paste Word & Google Docs',
        span: 1,
      },
      {
        id: 'qse-3',
        title: '03. 1-Page Proposal & Invoice Templates',
        description:
          'Clean, trustworthy templates that make beginners look organized from client #1.',
        deliverable: 'Editable in Canva & Google Docs',
        span: 1,
      },
      {
        id: 'qse-4',
        title: '04. First-10-Sales Weekend Action Plan',
        description:
          'A calm 7-day checklist showing where to share your offer, what proof to collect, and how to ask for referrals.',
        deliverable: 'Includes real beginner examples',
        span: 2,
      },
    ],
    proofHeading: 'Real results from beginners using this kit.',
    proofIntro: 'Stories from creators, coaches, and solo freelancers selling their first offers.',
    proofCases: [
      {
        id: 'qse-proof-1',
        client: 'Tala Career Guides',
        sector: 'Digital PDF Product',
        metric: '42 Copies Sold in First 30 Days',
        context: 'Bundled CV templates and interview answers into a $15 PDF on Selar.',
        quote:
          'Instead of posting random career tips with no link, I used the kit to build one clear offer and sold 42 copies in my first month.',
        authorName: 'Grace Mwikali',
        authorRole: 'Creator, Tala Career Guides',
      },
      {
        id: 'qse-proof-2',
        client: 'Juma Social Setup',
        sector: 'Beginner Freelance Service',
        metric: '3 Paid Clients in 2 Weeks',
        context: 'Replaced vague hourly pricing with a clear 1-page starter package.',
        quote:
          'The proposal template and WhatsApp reply scripts stopped prospects from ghosting me after asking my price.',
        authorName: 'Juma Bakari',
        authorRole: 'Social Media Freelancer',
      },
    ],
    pricingHeading: 'One-time payment. Instant download.',
    pricingBillingLabels: ['Starter Kit', 'Kit + Templates Bundle'],
    pricingTiers: [
      {
        id: 'qse-tier-1',
        name: 'Starter Kit (PDF + Scripts)',
        summary: 'The complete 48-page handbook, WhatsApp reply scripts, and 7-day launch checklist.',
        monthlyPrice: '$19 · TSh 49,000',
        annualPrice: '$29 · TSh 75,000',
        unitLabel: 'one-time payment',
        features: [
          '48-page Offer & Pricing Handbook (PDF)',
          '5 WhatsApp & email client scripts',
          '7-day First-Sales checklist',
          'Lifetime free updates',
        ],
        ctaLabel: 'Get Starter Kit — $19',
      },
      {
        id: 'qse-tier-2',
        name: 'Complete Creator Bundle',
        summary: 'Everything in the Starter Kit plus editable Canva proposal, invoice, and social post templates.',
        monthlyPrice: '$35 · TSh 89,000',
        annualPrice: '$49 · TSh 125,000',
        unitLabel: 'one-time payment',
        highlighted: true,
        features: [
          'Everything in the Starter Kit',
          'Editable Canva proposal & invoice templates',
          '15 promotional post templates for IG & WhatsApp',
          'Priority email support for offer questions',
        ],
        ctaLabel: 'Get Complete Bundle — $35',
      },
    ],
    guaranteeTitle: '30-Day "Try It & Judge for Yourself" Guarantee',
    guaranteeBody:
      'Download the kit, read the handbook, and customize the scripts for your offer. If it does not help you package and present your offer more clearly within 30 days, reply to your receipt email for a full refund.',
    faqHeading: 'Questions buyers usually ask.',
    faqs: [
      {
        id: 'qse-faq-1',
        question: 'How do I receive the files after paying?',
        answer:
          'Right after checkout you receive an email with your instant download link for the PDF handbook, scripts, and editable templates—ready to open in minutes.',
      },
      {
        id: 'qse-faq-2',
        question: 'Is this useful if I am starting from zero with no big audience?',
        answer:
          'Yes. The examples are built specifically for beginners selling to their first 10–50 buyers via WhatsApp, Instagram, LinkedIn, or referrals.',
      },
      {
        id: 'qse-faq-3',
        question: 'Are there any monthly fees after I buy?',
        answer:
          'Zero. You pay once and keep every file forever.',
      },
    ],
    captureHeading: 'Have a question before downloading?',
    captureSubheading: 'Send a quick message below and we will reply within one business day.',
    captureButtonLabel: 'Send Question',
    leadDestinationType: 'email',
    leadDestinationValue: 'hello@freelancestarter.example',
    footerLegal: 'Freelancer Starter Kit · Built with BiasharaBase Page Studio',
    footerContact: 'hello@freelancestarter.example · Instant digital delivery',
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
    name: 'Service & Coaching Page',
    category: 'Service Package',
    productLink: 'Sell an Offer',
    description:
      'Sell a clear freelance service, 1-on-1 coaching session, or done-for-you starter package with transparent pricing.',
    brandName: 'Amina Brand Studio',
    trustMarker: 'Fixed-Price Package · Delivered in 7 Days',
    navLinks: ['Why Us', 'What You Get', 'Packages', 'Book Now'],
    heroVariant: 'split-media',
    surface: 'crisp-light',
    fontPairing: 'jakarta-dm',
    accentColor: '#1E40AF',
    heroEyebrow: 'For Small Shops, Creators & Solo Founders',
    heroHeadline: 'Get a clean brand kit, Instagram setup, and sales visuals in 7 days.',
    heroSubheadline:
      'No confusing hourly billing or month-long agency delays. Pick a simple fixed-price package and launch your online storefront looking organized and trustworthy.',
    primaryCtaLabel: 'Book Your Starter Setup',
    secondaryNote: 'Free 15-minute WhatsApp discovery chat before you pay a deposit.',
    heroImage: '/src/assets/images/tpl_service_starter_1795440535205.jpg',
    heroImageAlt: 'Digital designer reviewing brand identity and page layouts on a laptop with a client.',
    kpiStrip: [
      { value: '45+', label: 'Small brands & creators launched' },
      { value: '7 Days', label: 'Average turnaround from kickoff' },
      { value: 'Fixed Fee', label: 'Zero surprise hourly charges' },
      { value: '100%', label: 'Editable Canva source files included' },
    ],
    contrastHeading: 'How a clear starter package beats messy freelance back-and-forth.',
    beforeTitle: 'Hiring without clear scope',
    beforePoints: [
      'Waiting weeks for inconsistent designs with no clear timeline',
      'Receiving static files you cannot update yourself later',
      'Paying extra every time you need a small price or text change',
    ],
    afterTitle: 'Working with Amina Brand Studio',
    afterPoints: [
      'Fixed 7-day delivery schedule with two clear review check-ins',
      'All templates handed over in free Canva so you can edit anytime',
      'Consistent colors, bio, highlight covers, and launch graphics ready to post',
    ],
    capabilitiesHeading: 'What is included in your setup week.',
    capabilitiesIntro:
      'Everything a new creator or small business needs to look credible on Instagram, WhatsApp, and Selar.',
    capabilities: [
      {
        id: 'ps-1',
        title: '01. Clean Logo, Colors & Typography Kit',
        description:
          'A simple, readable wordmark, 2 brand colors, and font pairing that look sharp on mobile screens and receipts.',
        deliverable: 'PNG, SVG & 1-page brand sheet',
        span: 2,
      },
      {
        id: 'ps-2',
        title: '02. Instagram & WhatsApp Profile Makeover',
        description:
          'Clear bio copy, WhatsApp Business catalog setup, and 5 matching highlight icons.',
        deliverable: 'Ready for mobile visitors',
        span: 1,
      },
      {
        id: 'ps-3',
        title: '03. 10 Reusable Canva Post & Story Templates',
        description:
          'Custom-branded templates for product promos, customer reviews, FAQs, and price lists.',
        deliverable: '100% editable in free Canva',
        span: 1,
      },
      {
        id: 'ps-4',
        title: '04. 30-Minute Handoff Walkthrough',
        description:
          'A calm screen-share walkthrough showing you exactly how to swap photos and update prices yourself.',
        deliverable: 'Recorded video to keep forever',
        span: 2,
      },
    ],
    proofHeading: 'Recent launches from solo founders.',
    proofIntro: 'Real small businesses and creators who upgraded their online presence in one week.',
    proofCases: [
      {
        id: 'ps-proof-1',
        client: 'Zuri Skincare TZ',
        sector: 'Natural Beauty Shop',
        metric: '3x More WhatsApp Inquiries in Week 1',
        context: 'Replaced mismatched phone photos with clean price cards and a clear Instagram bio.',
        quote:
          'Buyers used to ask "Are you legit?" Now they click my link, see the price list clearly, and send their order directly on WhatsApp.',
        authorName: 'Zuhura Khamis',
        authorRole: 'Founder, Zuri Skincare',
      },
      {
        id: 'ps-proof-2',
        client: 'Musa Career Coaching',
        sector: '1-on-1 CV & Interview Coaching',
        metric: '11 Paid Bookings in First Month',
        context: 'Organized coaching packages and Selar checkout visuals.',
        quote:
          'Having my Canva templates and clear package breakdown saved me hours every week and made clients trust my service faster.',
        authorName: 'Musa Emmanuel',
        authorRole: 'Career Coach',
      },
    ],
    pricingHeading: 'Two straightforward starter packages.',
    pricingBillingLabels: ['50% Deposit', 'Full Payment'],
    pricingTiers: [
      {
        id: 'ps-tier-1',
        name: 'Essential Profile & Kit',
        summary: 'Best for solo creators who need a clean logo, brand colors, and profile setup fast.',
        monthlyPrice: '$49 · TSh 125,000',
        annualPrice: '$89 · TSh 225,000',
        unitLabel: 'starter package',
        features: [
          'Simple brand logo & color palette',
          'Instagram bio + WhatsApp Business setup',
          '5 reusable Canva promo templates',
          'Delivered in 5 business days',
        ],
        ctaLabel: 'Book Essential Setup',
      },
      {
        id: 'ps-tier-2',
        name: 'Full Launch Brand Package',
        summary: 'Complete visual kit, 10 custom Canva templates, Selar cover graphics, and 1-on-1 handoff.',
        monthlyPrice: '$95 · TSh 245,000',
        annualPrice: '$175 · TSh 450,000',
        unitLabel: 'complete launch kit',
        highlighted: true,
        features: [
          'Everything in Essential Setup',
          '10 reusable Canva post & story templates',
          'Selar product cover & banner graphics',
          '30-minute recorded handoff walkthrough',
        ],
        ctaLabel: 'Book Full Launch Kit',
      },
    ],
    guaranteeTitle: 'On-Time & Revision Guarantee',
    guaranteeBody:
      'If your first brand concepts are not delivered within 7 business days—or if you need tweaks to colors and wording—we include two full revision rounds at no extra cost.',
    faqHeading: 'Questions before booking.',
    faqs: [
      {
        id: 'ps-faq-1',
        question: 'How do we get started?',
        answer:
          'Send a quick inquiry below with your business name and what you sell. We reply on WhatsApp or email within 24 hours with a short 5-question intake form.',
      },
      {
        id: 'ps-faq-2',
        question: 'Can I edit the templates myself later?',
        answer:
          'Yes. Everything is delivered inside a free Canva account so you can change prices, photos, and text anytime without hiring a designer again.',
      },
    ],
    captureHeading: 'Book your slot or ask a quick question.',
    captureSubheading: 'Share what you sell and your timeline. We reply within one business day.',
    captureButtonLabel: 'Request Booking Slot',
    leadDestinationType: 'email',
    leadDestinationValue: 'hello@aminabrand.example',
    footerLegal: 'Amina Brand Studio · Built with BiasharaBase Page Studio',
    footerContact: 'hello@aminabrand.example · +255 700 000 123',
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
    name: 'Workshop & Cohort Page',
    category: 'Workshop & Cohort',
    productLink: 'Sell an Offer',
    description:
      'Fill seats for a live weekend workshop, online training cohort, or small-group bootcamp with clear dates and agenda.',
    brandName: 'Saturday Skills Lab',
    trustMarker: 'Live Weekend Workshop · Limited to 25 Seats',
    navLinks: ['Why Join', 'Curriculum', 'Ticket Options', 'Save Your Seat'],
    heroVariant: 'split-media',
    surface: 'warm-stone',
    fontPairing: 'archivo-public',
    accentColor: '#0369A1',
    heroEyebrow: 'Live 2-Day Online & Dar es Salaam Workshop',
    heroHeadline: 'Launch your first digital product or paid service in one focused weekend.',
    heroSubheadline:
      'Join 25 founders in a practical, step-by-step live workshop. Walk out on Sunday afternoon with a validated offer, finished sales page, and 14 days of launch posts ready.',
    primaryCtaLabel: 'Reserve Your Seat — $25',
    secondaryNote: 'Includes live Q&A, step-by-step workbook, and full video replay for 12 months.',
    heroImage: '/src/assets/images/tpl_workshop_cohort_1795440535508.jpg',
    heroImageAlt: 'Small group of founders learning together around a stone table with laptops and notebooks.',
    kpiStrip: [
      { value: '2 Days', label: 'Hands-on weekend implementation' },
      { value: '25 Seats', label: 'Small group so everyone gets feedback' },
      { value: '$25 / TSh 65,000', label: 'Early-bird live workshop ticket' },
      { value: '12 Months', label: 'Replay & workbook access included' },
    ],
    contrastHeading: 'Why live implementation beats watching prerecorded videos alone.',
    beforeTitle: 'Learning alone from scattered videos',
    beforePoints: [
      'Buying courses that sit unwatched in your downloads folder',
      'Getting stuck on a technical step with nobody to ask',
      'Spending months tweaking instead of launching to real buyers',
    ],
    afterTitle: 'Building together in Saturday Skills Lab',
    afterPoints: [
      'Dedicated 3-hour work blocks on Saturday and Sunday to finish on the call',
      'Live feedback on your headline, pricing, and WhatsApp offer',
      'Accountability with 24 other beginners launching the same weekend',
    ],
    capabilitiesHeading: 'What we build together over the weekend.',
    capabilitiesIntro:
      'Zero fluff theory—every session ends with a finished piece of your launch ready to share.',
    capabilities: [
      {
        id: 'oem-1',
        title: '01. Saturday Morning: Pick & Package Your Offer',
        description:
          'Turn your knowledge or service into a crystal-clear offer with beginner-friendly pricing in USD and TSh.',
        deliverable: 'Session 1 · Offer Clarity Worksheet',
        span: 2,
      },
      {
        id: 'oem-2',
        title: '02. Saturday Afternoon: Build Your Sales Page',
        description:
          'Set up your headline, Before vs. After story, FAQ, and Selar or WhatsApp checkout live with our help.',
        deliverable: 'Session 2 · Live Page Review',
        span: 1,
      },
      {
        id: 'oem-3',
        title: '03. Sunday: Create Your First 14 Launch Posts',
        description:
          'Write and schedule two weeks of WhatsApp Status, Instagram, and LinkedIn announcements.',
        deliverable: 'Session 3 · 14-Day Promo Plan',
        span: 1,
      },
      {
        id: 'oem-4',
        title: '04. 7-Day Post-Workshop WhatsApp Check-In',
        description:
          'Stay in our private group for one week after the workshop to ask questions as your first buyers come in.',
        deliverable: 'Includes full HD replay recordings',
        span: 2,
      },
    ],
    proofHeading: 'What past workshop attendees shipped.',
    proofIntro: 'Feedback from beginners who joined previous weekend cohorts.',
    proofCases: [
      {
        id: 'oem-proof-1',
        client: 'Fatma Baking Guides',
        sector: 'Home Bakery PDF & Recipes',
        metric: 'First 18 Copies Sold on Monday Morning',
        context: 'Finished her recipe guide sales page and WhatsApp promo posts on Sunday.',
        quote:
          'I had talked about selling my pastry costing sheet for six months. Finishing it live during the weekend workshop got me 18 sales in 48 hours.',
        authorName: 'Fatma Salim',
        authorRole: 'Founder, Fatma Baking Guides',
      },
      {
        id: 'oem-proof-2',
        client: 'Kelvin Bookkeeping',
        sector: 'Small Shop Accounting Service',
        metric: '4 New Monthly Retainer Clients',
        context: 'Rewrote his service offer and pricing tiers during Session 1.',
        quote:
          'Getting real feedback on my price and headline in the workshop gave me the confidence to post my offer publicly the very next day.',
        authorName: 'Kelvin Mwakyusa',
        authorRole: 'Independent Bookkeeper',
      },
    ],
    pricingHeading: 'Two simple ways to attend.',
    pricingBillingLabels: ['Early-Bird Ticket', 'Standard Ticket'],
    pricingTiers: [
      {
        id: 'oem-tier-1',
        name: 'Live Workshop Seat',
        summary: 'Full access to both live weekend sessions, the PDF workbook, and 12-month video replays.',
        monthlyPrice: '$25 · TSh 65,000',
        annualPrice: '$35 · TSh 89,000',
        unitLabel: 'per attendee',
        features: [
          '6 hours of live hands-on workshop sessions',
          'Step-by-step Offer & Launch Workbook',
          '12-month access to full HD video replays',
          '7-day post-workshop Q&A check-in',
        ],
        ctaLabel: 'Reserve Live Seat',
      },
      {
        id: 'oem-tier-2',
        name: 'VIP Seat + 1-on-1 Page Audit',
        summary: 'Includes your live workshop ticket plus a private 30-minute review of your finished page and posts.',
        monthlyPrice: '$45 · TSh 115,000',
        annualPrice: '$59 · TSh 149,000',
        unitLabel: 'limited to 8 VIP seats',
        highlighted: true,
        features: [
          'Everything in Live Workshop Seat',
          'Private 30-min 1-on-1 review after the weekend',
          'Personalized headline & pricing feedback',
          'Priority feedback during live sessions',
        ],
        ctaLabel: 'Reserve VIP Seat',
      },
    ],
    guaranteeTitle: '100% "Attend Day 1" Guarantee',
    guaranteeBody:
      'Join Saturday’s session and download the workbook. If by the end of Day 1 you do not feel the workshop is practical and worth every shilling, let us know before Sunday and we will refund your ticket in full.',
    faqHeading: 'Common workshop questions.',
    faqs: [
      {
        id: 'oem-faq-1',
        question: 'What if I miss part of the live session?',
        answer:
          'Every attendee receives the full HD video replays and PDF workbook within 3 hours after each day wraps up.',
      },
      {
        id: 'oem-faq-2',
        question: 'Do I need to have a finished product before joining?',
        answer:
          'No. Coming with an idea or a skill you want to package as a guide, template, or service is enough—we help you shape it on Saturday morning.',
      },
    ],
    captureHeading: 'Save your seat or ask about group tickets.',
    captureSubheading: 'Leave your details below and we will send the next cohort dates and payment link.',
    captureButtonLabel: 'Send My Seat Request',
    leadDestinationType: 'email',
    leadDestinationValue: 'team@saturdayskills.example',
    footerLegal: 'Saturday Skills Lab · Built with BiasharaBase Page Studio',
    footerContact: 'team@saturdayskills.example · Next cohort opens monthly',
    sections: [
      { id: 'hero', label: 'Top Hero & Headline', enabled: true },
      { id: 'contrast', label: 'Before vs. After Comparison', enabled: true },
      { id: 'capabilities', label: 'Weekend Agenda', enabled: true },
      { id: 'proof', label: 'Attendee Results', enabled: true },
      { id: 'pricing', label: 'Tickets & Guarantee', enabled: true },
      { id: 'faq', label: 'Common Questions (FAQ)', enabled: true },
      { id: 'capture', label: 'Seat Request Form', enabled: true },
      { id: 'footer', label: 'Bottom Footer', enabled: true },
    ],
  },
];
