import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { TESTIMONIALS } from "@/lib/content";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials() {
  return (
    <section className="border-b border-line py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Client feedback"
          title="What clients say about working with Finbook."
          align="center"
        />

        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.06} className="mb-5 break-inside-avoid">
              <div className="rounded-2xl border border-line bg-paper-dim/50 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs text-paper">
                    {initials(t.name)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink/80">&ldquo;{t.quote}&rdquo;</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
