export const SITE = {
  name: "Finbook Global",
  legalName: "A.R.M Finbook Global Private Limited",
  tagline: "Finance, off your plate.",
  description:
    "Outsourced bookkeeping, taxation, and CFO services for small and growing businesses in the USA and UK, run by chartered accountants in Kochi, India.",
  email: "info@finbookglobal.com",
};

export const CONTACT_CTA = "Talk to us";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About" },
  {
    href: "/services/accounting-and-bookkeeping",
    label: "Services",
    children: [
      { href: "/services/accounting-and-bookkeeping", label: "Accounting & Bookkeeping" },
      { href: "/services/cfo", label: "CFO Services" },
      { href: "/services/cpa-aca-assistance", label: "CPA / ACA Assistance" },
    ],
  },
  { href: "/why-finbook", label: "Why Finbook" },
  { href: "/blog", label: "Blog" },
  { href: "/contact-us", label: "Contact" },
] as const;

export const OFFICES = [
  {
    country: "India",
    address:
      "2nd Floor, KAP Sons Building, 521/3, near Aster Labs, Toll Junction, Edappally, Kochi, Ernakulam, Kerala 682024",
    phone: "+91 871 411 1851",
    phoneHref: "+918714111851",
  },
  {
    country: "United Kingdom (Headquarters)",
    address: "2nd Floor, 31-41 Worship Street, London, United Kingdom, EC2A 2DX",
    phone: "+44 7539 226151",
    phoneHref: "+447539226151",
  },
  {
    country: "United States",
    address: "Remote client support across all US time zones",
    phone: "+1 315 888 9950",
    phoneHref: "+13158889950",
  },
] as const;

export const MAP_LOCATIONS = [
  {
    label: "London — Headquarters",
    address: "2nd Floor, 31-41 Worship Street, London, United Kingdom, EC2A 2DX",
    lat: 51.5221333,
    lng: -0.0856327,
  },
] as const;

export const STATS = [
  {
    target: 50,
    prefix: "40-",
    suffix: "%",
    label: "Lower cost than an in-house accounting team",
  },
  { target: 5, prefix: "", suffix: "", label: "Chartered accountants leading client work" },
  { target: 2, prefix: "", suffix: "", label: "Countries served daily, USA and UK" },
  {
    target: 3,
    prefix: "",
    suffix: "",
    label: "Platforms supported: QuickBooks, Xero, Zoho",
  },
] as const;

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "You upload",
    body: "Invoices, receipts, and statements land in Finface the moment they exist. No inbox archaeology, no end-of-month scramble.",
    image: "/images/ourprocess-pic1.svg",
  },
  {
    number: "02",
    title: "We reconcile",
    body: "A dedicated chartered-accountant team categorizes, reconciles, and flags anything that looks off, on your existing software.",
    image: "/images/ourprocess-pic2.svg",
  },
  {
    number: "03",
    title: "You decide",
    body: "Real-time reports and a direct line to your accountant replace the quarterly guessing game with actual numbers.",
    image: "/images/ourprocess-pic3.svg",
  },
] as const;

export const DIFFERENTIATORS = [
  {
    icon: "PiggyBank",
    title: "Cost efficiency",
    body: "Save 40-50% against the cost of hiring, training, and retaining an in-house accounting team.",
  },
  {
    icon: "GraduationCap",
    title: "Qualified experts",
    body: "Every account is run by a chartered accountant, not a junior data-entry clerk on a learning curve.",
  },
  {
    icon: "Target",
    title: "Focus on the business",
    body: "Hand off the ledgers and spend your hours where they actually move the business forward.",
  },
  {
    icon: "ShieldCheck",
    title: "Quality assurance",
    body: "Stringent internal review at every step keeps errors and compliance risk close to zero.",
  },
  {
    icon: "ClockCountdown",
    title: "Timely reporting",
    body: "Books close on schedule, every month, so decisions are made on current numbers, not last quarter's.",
  },
  {
    icon: "LockKey",
    title: "Data security",
    body: "Financial data is handled under strict access controls and industry-standard security practice.",
  },
] as const;

export const SERVICES = [
  {
    slug: "accounting-and-bookkeeping",
    title: "Accounting & Bookkeeping",
    short: "Daily books, reconciled and reported, on QuickBooks, Xero, Sage, or Zoho.",
    body: "A dedicated bookkeeping team works inside the software you already use, closing your books on schedule and keeping every account reconciled.",
    icon: "Books",
  },
  {
    slug: "cfo",
    title: "CFO Services",
    short: "Forecasting, budgeting, and board-ready reporting without a full-time hire.",
    body: "A virtual CFO reads your numbers the way an investor would, building forecasts, budgets, and the reporting a growing business needs to raise or borrow.",
    icon: "ChartLineUp",
  },
  {
    slug: "cpa-aca-assistance",
    title: "CPA / ACA Assistance",
    short: "Exam-ready support for accountants working toward CPA or ACA certification.",
    body: "Structured mentorship and practical case exposure for accountants preparing for CPA or ACA examinations, built around real client work.",
    icon: "Certificate",
  },
] as const;

export const PLANS = [
  {
    name: "Basic",
    body: "For early-stage businesses that need clean books and nothing more.",
    features: [
      "Dedicated bookkeeping team",
      "Monthly financial reports",
      "Access to the Finface platform",
    ],
    featured: false,
  },
  {
    name: "Standard",
    body: "For growing businesses that need an accountant in the room, not just a bookkeeper.",
    features: [
      "Everything in Basic",
      "Accounting advisory sessions",
      "Tax-ready annual statements",
    ],
    featured: true,
  },
  {
    name: "Premium",
    body: "For businesses raising, borrowing, or bidding, and need the paperwork to prove it.",
    features: [
      "Everything in Standard",
      "Budgeting and tax advisory",
      "Custom reports for loans and tenders",
    ],
    featured: false,
  },
] as const;

export const TEAM = [
  {
    name: "Raj Anindya Mitra",
    role: "Principal Oversight & Technical Review, Director",
    credentials: "CA (ICAI), ACA (ICAEW)",
    bio: "Provides firm-level supervision and technical review, and holds final accountability for engagement quality across the accounting and CFO teams.",
    image: "/images/raj.png",
  },
  {
    name: "Ruble Francis",
    role: "Director, UK Operations",
    credentials: "BSc, Actuarial Science",
    bio: "Leads client coordination and compliance for Finbook's UK operations and client relationships, based in London.",
    image: "/images/ruble.png",
  },
  {
    name: "Allen Jose",
    role: "Service Delivery & Review",
    credentials: "CA (ICAI)",
    bio: "Four years in corporate revival under insolvency law, plus six years across taxation, audit, and accounting.",
    image: "/images/teampiclg4.jpg",
  },
  {
    name: "Reuben Jose",
    role: "Service Delivery & Review",
    credentials: "CA (ICAI)",
    bio: "Christ University alumnus with audit experience at Grant Thornton, working across technology, manufacturing, banking, and healthcare.",
    image: "/images/teampiclg2.jpg",
  },
  {
    name: "Alen T Jose",
    role: "Service Delivery & Review",
    credentials: "CA (ICAI)",
    bio: "Six years across bookkeeping, audit, and consultancy in finance, medical, hospitality, retail, and shipbuilding.",
    image: "/images/teampiclg1.jpg",
  },
] as const;

export const CREDENTIALS = [
  {
    icon: "Certificate",
    title: "ICAEW oversight",
    body: "Member principal partner providing firm supervision, technical review, and accountability.",
  },
  {
    icon: "ShieldCheck",
    title: "Regulated & AML supervised",
    body: "ICAEW-regulated practice with anti-money laundering controls and compliance procedures.",
  },
  {
    icon: "Bank",
    title: "HMRC Registered Agent",
    body: "Authorised agent support for tax registrations, submissions, and correspondence.",
  },
  {
    icon: "Buildings",
    title: "Companies House ACSP",
    body: "Authorised Corporate Service Provider for filing and identity verification support.",
  },
  {
    icon: "UsersThree",
    title: "10 skilled staff",
    body: "Delivery capacity across bookkeeping, accounts, tax, payroll, and compliance.",
  },
  {
    icon: "GearSix",
    title: "Flexible support model",
    body: "Scalable resourcing aligned to recurring, project-based, and deadline-led needs.",
  },
] as const;

export const DELIVERY_STEPS = [
  {
    number: "01",
    title: "Onboarding",
    body: "Due diligence and scope agreed before a single record moves.",
  },
  {
    number: "02",
    title: "Information collection",
    body: "Records and source data gathered securely from your existing systems.",
  },
  {
    number: "03",
    title: "Processing",
    body: "Bookkeeping, reconciliation, and compliance work carried out on schedule.",
  },
  {
    number: "04",
    title: "Professional review",
    body: "Quality control by a qualified accountant before anything goes out.",
  },
  {
    number: "05",
    title: "Authorised filing",
    body: "Submission to the regulator through an authorised, registered agent.",
  },
  {
    number: "06",
    title: "Reporting",
    body: "Clear confirmation and management reporting land in your inbox.",
  },
  {
    number: "07",
    title: "Ongoing support",
    body: "Deadline monitoring continues, cycle after cycle, without a reminder from you.",
  },
] as const;

// Placeholder client quotes for the "Wall of love" section -- swap these
// for real client testimonials as they come in.
export const TESTIMONIALS = [
  {
    quote:
      "Finbook took bookkeeping off our plate completely. Our books close on the same day every month now, not three weeks later.",
    name: "Jordan Fernandez",
    role: "Founder, D2C Retail Brand",
  },
  {
    quote:
      "Having a chartered accountant actually review our numbers, not just enter them, is the difference. They caught a VAT error before it became a problem.",
    name: "Priya Nair",
    role: "Operations Lead, SaaS Startup",
  },
  {
    quote:
      "Onboarding was faster than I expected. They plugged straight into our Xero account and we didn't have to touch a thing.",
    name: "Tom Baxter",
    role: "Managing Director, Logistics Company",
  },
  {
    quote:
      "We use the CFO service for board reporting now. It's the first time our numbers have looked investor-ready without a scramble.",
    name: "Maria Gomez",
    role: "Co-founder, Fintech Startup",
  },
  {
    quote:
      "Real-time reporting through Finface means I'm not waiting until month-end to know how the business is actually doing.",
    name: "Alex Turner",
    role: "Owner, Hospitality Group",
  },
  {
    quote:
      "Switching from an in-house bookkeeper saved us close to 45%, and we get faster turnaround than we did before.",
    name: "Sam Whitfield",
    role: "Finance Manager, Professional Services Firm",
  },
] as const;

export const BLOG_POSTS = [
  {
    slug: "vat-registration-uk-businesses",
    category: "Tax & Compliance",
    icon: "Bank",
    title: "VAT registration for new UK businesses: what you actually need",
    excerpt:
      "When registration becomes mandatory, how Making Tax Digital changes your filing obligations, and where the Flat Rate Scheme can help.",
    readMinutes: 6,
    body: [
      "Most UK businesses only think about VAT once they're close to the £90,000 taxable turnover threshold, and by then the registration process is competing with everything else on a founder's plate. Registration itself is done through a VAT1 application, but the real work is in the setup that follows: choosing an accounting scheme, deciding on your VAT return periods, and making sure your bookkeeping software is configured for Making Tax Digital (MTD) from day one.",
      "MTD for VAT means returns have to be submitted digitally through compatible software, with a clear digital link between your records and the figures on the return. If you're still exporting numbers into a spreadsheet before filing, that's exactly the kind of manual step MTD is designed to close off.",
      "The Flat Rate Scheme is worth a look for smaller businesses with limited VATable expenses. Instead of reclaiming VAT on individual purchases, you apply a fixed percentage to your turnover based on your trade sector. It simplifies quarterly filing considerably, but it isn't always the cheaper option, so it's worth running the numbers both ways before committing.",
      "Whichever route you take, registration, scheme selection, and your first few returns are where most avoidable errors happen. Getting a second set of eyes on the setup early is usually cheaper than correcting it later.",
    ],
  },
  {
    slug: "companies-house-compliance-checklist",
    category: "Companies House",
    icon: "Buildings",
    title: "Companies House compliance: a founder's checklist",
    excerpt:
      "Incorporation, annual accounts, confirmation statements, and the new identity verification rules under ECCTA 2023.",
    readMinutes: 5,
    body: [
      "Incorporating a company through an IN01 filing is the easy part. Staying compliant afterward is the part that quietly slips down the priority list, until a confirmation statement or accounts deadline is suddenly a week away.",
      "Every UK company has two recurring filing obligations: annual accounts (the format depends on company size, ranging from dormant accounts through to full statutory accounts) and a confirmation statement (CS01), which confirms your registered details are current at least once every 12 months. On top of these, any change to directors, registered office, share capital, or persons with significant control (PSC) needs to be filed as it happens, not batched up for the next annual return.",
      "The Economic Crime and Corporate Transparency Act 2023 (ECCTA) has added a new layer: identity verification for directors and PSCs, administered either directly or through an Authorised Corporate Service Provider (ACSP). This is a genuine change in how Companies House confirms who's actually behind a company, and it's being phased in rather than optional.",
      "A simple compliance calendar, next accounts due, next confirmation statement due, and a standing note to file company changes as they happen, removes most of the risk here. The filings themselves are rarely complicated; missing them is what causes problems.",
    ],
  },
  {
    slug: "cis-payroll-for-contractors",
    category: "Payroll",
    icon: "UsersThree",
    title: "CIS and payroll: what UK contractors need to know",
    excerpt:
      "How the Construction Industry Scheme interacts with standard PAYE payroll, and where contractors most often get the two mixed up.",
    readMinutes: 5,
    body: [
      "If you run a construction business that pays both employees and subcontractors, you're actually managing two separate compliance systems at once: standard PAYE payroll for employees, and the Construction Industry Scheme (CIS) for subcontractors. Treating them as one process is where most of the confusion starts.",
      "Under CIS, contractors deduct money from a subcontractor's payments and pass it to HMRC as an advance payment toward the subcontractor's tax and National Insurance. That deduction rate depends on the subcontractor's registration status, and it needs to be reported through a monthly CIS300 return, separate from your regular payroll RTI submissions.",
      "PAYE payroll, meanwhile, still runs on its own schedule: Full Payment Submissions (FPS) each pay run, Employer Payment Summaries (EPS) where relevant, and the usual employee lifecycle paperwork, P45s for leavers, P60s at year-end, and starter records for new hires.",
      "The businesses that stay clean on both fronts are the ones that keep CIS and payroll as clearly separated processes, with their own checklists and deadlines, rather than trying to run them through the same monthly routine.",
    ],
  },
  {
    slug: "gdpr-accounting-data-uk-small-business",
    category: "Data & Compliance",
    icon: "ShieldCheck",
    title: "GDPR and your accounting data: a practical guide",
    excerpt:
      "What UK GDPR actually requires when a third party is handling your financial records, in plain terms.",
    readMinutes: 4,
    body: [
      "Handing your books to an external accounting team means handing over genuinely sensitive data, bank statements, payroll records, sometimes customer payment details. UK GDPR and the Data Protection Act 2018 set out how that data has to be handled, and it's worth knowing what to actually expect from a provider, not just what the regulation says on paper.",
      "The core principles that matter in practice: data minimisation (only collecting what's actually needed for the engagement), defined retention periods (records shouldn't sit indefinitely once they're no longer required), and role-based access (not everyone on a service team needs access to everything).",
      "A serious provider will also have a documented incident response process, so if something does go wrong, there's a clear procedure rather than an improvised one, and appropriate safeguards for any cross-border data transfer, which matters if your books are being handled by a team outside the UK.",
      "None of this needs to be complicated on your end. The right questions to ask a provider are simple: who has access to our data, how long do you keep it, and what happens if there's a breach. If those answers are vague, that's worth treating as a warning sign.",
    ],
  },
] as const;

export const MISSION = {
  vision: "To become the leading finance and accounts partner for businesses worldwide.",
  mission:
    "To empower businesses by automating finance and accounting processes and contributing to sustainable growth.",
};
