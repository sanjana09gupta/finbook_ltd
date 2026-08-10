export const SITE = {
  name: "Finbook Global",
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
  { href: "/contact-us", label: "Contact" },
] as const;

export const OFFICES = [
  {
    country: "India",
    address: "2nd Floor, KAP Sons Building, 521/3, Toll Junction, Edappally, Kochi, Kerala 682024",
    phone: "+91 871 411 1851",
    phoneHref: "+918714111851",
  },
  {
    country: "United Kingdom",
    address: "2nd Floor, 31-41 Worship Street, London EC2A 2DX",
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
    name: "Alen T Jose",
    role: "Director",
    credentials: "B.Com, ACA",
    bio: "Six years across bookkeeping, audit, and consultancy in finance, medical, hospitality, retail, and shipbuilding.",
    image: "/images/teampiclg1.jpg",
  },
  {
    name: "Reuben Jose",
    role: "Director",
    credentials: "B.Com, ACA",
    bio: "Christ University alumnus with audit experience at Grant Thornton, working across technology, manufacturing, banking, and healthcare.",
    image: "/images/teampiclg2.jpg",
  },
  {
    name: "Allen Jose",
    role: "Director",
    credentials: "B.Com, ACA",
    bio: "Four years in corporate revival under insolvency law, plus six years across taxation, audit, and accounting.",
    image: "/images/teampiclg4.jpg",
  },
  {
    name: "Ruble Francis",
    role: "Director, UK Operations",
    credentials: "BSc, Actuarial Science",
    bio: "Leads Finbook's UK client relationships and operations from London.",
    image: "/images/ruble.png",
  },
  {
    name: "Raj Anindya Mitra",
    role: "Chartered Accountant",
    credentials: "CA",
    bio: "Oversees engagement quality across the accounting and CFO teams.",
    image: "/images/raj.png",
  },
] as const;

export const MISSION = {
  vision: "To become the leading finance and accounts partner for businesses worldwide.",
  mission:
    "To empower businesses by automating finance and accounting processes and contributing to sustainable growth.",
};
