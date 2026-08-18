import { SectionHeading } from "@/components/ui/SectionHeading";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function TeamTeaser() {
  return (
    <section className="border-b border-paper/10 bg-ink-soft py-20 md:py-28">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading tone="paper" eyebrow="People behind the work" title="Chartered accountants, not a call center." className="md:max-w-md" />
          <Reveal>
            <Button href="/about-us" variant="secondary">
              Meet the team
            </Button>
          </Reveal>
        </div>

        <div className="mt-12">
          <TeamGrid compact />
        </div>
      </div>
    </section>
  );
}
