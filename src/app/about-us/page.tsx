import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SplitImage } from "@/components/sections/SplitImage";
import { Stats } from "@/components/sections/Stats";
import { TeamDetailed } from "@/components/sections/TeamDetailed";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/motion/Reveal";
import { MISSION } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Finbook Global is run by chartered accountants in Kochi, India, serving small and growing businesses in the USA and UK.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Finbook"
        title="Built by accountants who got tired of the slow way."
        body="Finbook Global started with a simple observation: growing businesses need real accounting expertise, not a bigger back office."
      />

      <section className="border-b border-line py-20 md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <span className="mb-4 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Our vision
            </span>
            <p className="text-balance text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">
              {MISSION.vision}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <span className="mb-4 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Our mission
            </span>
            <p className="text-balance text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">
              {MISSION.mission}
            </p>
          </Reveal>
        </div>
      </section>

      <SplitImage
        title="What we actually do all day"
        body="We plug a dedicated team of chartered accountants directly into your existing software, QuickBooks, Xero, Sage, or Zoho, and run your books the way an in-house hire would, at a fraction of the cost. Finface, our client platform, keeps every report and document one click away."
        image="/images/headerbannerpic.png"
        imageAlt="Finbook Global accounting workspace"
      />

      <Stats />

      <section className="py-20 md:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Meet the team"
            title="Five chartered accountants who lead every engagement."
          />
          <div className="mt-14">
            <TeamDetailed />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
