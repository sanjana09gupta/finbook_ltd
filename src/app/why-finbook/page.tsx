import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { WhyFinbookGrid } from "@/components/sections/WhyFinbookGrid";
import { ComparisonBlock } from "@/components/sections/ComparisonBlock";
import { Stats } from "@/components/sections/Stats";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Why Finbook",
  description:
    "Six reasons growing businesses choose Finbook Global over hiring an in-house accounting team.",
};

export default function WhyFinbookPage() {
  return (
    <>
      <PageHero
        eyebrow="Why Finbook"
        title="The case for not hiring an in-house accountant yet."
        body="Managing finance and accounts is complex and time consuming. Here is what changes when Finbook runs it instead."
      />
      <WhyFinbookGrid showHeading={false} />
      <ComparisonBlock />
      <Stats />
      <CtaBand />
    </>
  );
}
