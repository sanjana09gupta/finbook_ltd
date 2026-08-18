import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SplitImage } from "@/components/sections/SplitImage";
import { FeatureChecklist } from "@/components/sections/FeatureChecklist";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "CFO Services",
  description:
    "Virtual CFO services for growing businesses: forecasting, budgeting, and board-ready reporting without a full-time hire.",
};

const CFO_ITEMS = [
  {
    title: "Cash flow forecasting",
    body: "Rolling forecasts that show you what's coming before it lands in the bank account.",
  },
  {
    title: "Budgeting and variance review",
    body: "A working budget checked against actuals every month, not once a year.",
  },
  {
    title: "Investor and lender reporting",
    body: "Financials formatted the way a bank, VC, or board actually wants to read them.",
  },
  {
    title: "Pricing and margin analysis",
    body: "A clear view of what each product or service line actually earns, after costs.",
  },
  {
    title: "Scenario planning",
    body: "Model a new hire, a price change, or a slow quarter before you commit to it.",
  },
  {
    title: "Direct advisory access",
    body: "A standing call with your CFO, not a quarterly email summary.",
  },
];

export default function CfoPage() {
  return (
    <>
      <PageHero
        eyebrow="CFO Services"
        title="The financial judgment of a CFO, without the full-time salary."
        body="A virtual CFO reads your numbers the way an investor would, building the forecasts and reporting a growing business needs to raise or borrow."
      />

      <SplitImage
        title="Strategy, not just spreadsheets"
        body="Your virtual CFO sits above the day-to-day bookkeeping, translating your numbers into decisions: where to cut, where to invest, and what to show the bank or your board next quarter."
        image="/images/service-cfo.jpg"
        imageAlt="Virtual CFO financial planning and reporting"
        reverse
        compactImage
      />

      <FeatureChecklist title="What a Finbook CFO actually covers" items={CFO_ITEMS} />

      <CtaBand
        title="Need a CFO's eyes on your numbers?"
        body="Bring your current financials to the call and we'll show you what we'd change first."
      />
    </>
  );
}
