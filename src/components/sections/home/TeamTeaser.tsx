import { SectionHeading } from "@/components/ui/SectionHeading";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function TeamTeaser() {
  return (
    <section className="border-b border-line py-20 md:py-28">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading title="Chartered accountants, not a call center." className="md:max-w-md" />
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
