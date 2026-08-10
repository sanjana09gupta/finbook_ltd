import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SplitImage } from "@/components/sections/SplitImage";
import { PlatformLogos } from "@/components/sections/PlatformLogos";
import { PricingTiers } from "@/components/sections/PricingTiers";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Accounting & Bookkeeping",
  description:
    "Daily bookkeeping and accounting for small and growing businesses, run by chartered accountants on QuickBooks, Xero, Sage, or Zoho.",
};

export default function AccountingBookkeepingPage() {
  return (
    <>
      <PageHero
        eyebrow="Accounting & Bookkeeping"
        title="Smart accounting, smarter decisions, success accelerated."
        body="A dedicated bookkeeping team works inside the software you already use, closing your books on schedule and keeping every account reconciled."
      />

      <SplitImage
        title="Your books, reconciled and ready"
        body="No re-platforming, no new logins to remember. Your Finbook team operates directly inside your existing QuickBooks, Xero, Sage, or Zoho account, categorizing transactions, reconciling statements, and flagging anything that needs your attention before it becomes a problem."
        image="/images/whychoosepic.png"
        imageAlt="Finbook Global bookkeeping team at work"
      />

      <PlatformLogos />
      <PricingTiers />
      <CtaBand
        title="Ready to get your books off your desk?"
        body="Tell us which platform you're on and we'll walk you through exactly how the handover works."
      />
    </>
  );
}
