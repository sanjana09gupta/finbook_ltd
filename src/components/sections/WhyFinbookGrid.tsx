import {
  PiggyBank,
  GraduationCap,
  Target,
  ShieldCheck,
  ClockCountdown,
  LockKey,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { DIFFERENTIATORS } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Highlight } from "@/components/ui/Highlight";
import { cn } from "@/lib/cn";

const ICONS: Record<string, Icon> = {
  PiggyBank,
  GraduationCap,
  Target,
  ShieldCheck,
  ClockCountdown,
  LockKey,
};

const SPANS = [
  "sm:col-span-2 lg:col-span-2",
  "sm:col-span-2 lg:col-span-1",
  "sm:col-span-1",
  "sm:col-span-1",
  "sm:col-span-2 lg:col-span-1",
  "sm:col-span-2 lg:col-span-3",
];

export function WhyFinbookGrid({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section className="border-b border-line py-20 md:py-28">
      <div className="container-page">
        {showHeading && (
          <SectionHeading
            eyebrow="Why Finbook"
            title={
              <>
                Six reasons founders <Highlight>stop worrying</Highlight> about the books.
              </>
            }
          />
        )}

        <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", showHeading && "mt-16")}>
          {DIFFERENTIATORS.map((item, i) => {
            const IconCmp = ICONS[item.icon];
            const dark = i === 0 || i === 5;
            const wide = i === 5;
            return (
              <Reveal key={item.title} delay={(i % 3) * 0.06} className={SPANS[i]}>
                <SpotlightCard
                  spotlightClassName={dark ? "mix-blend-screen" : undefined}
                  className={cn(
                    "flex h-full flex-col justify-between rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1",
                    dark
                      ? "border-ink bg-ink text-paper hover:border-accent/60"
                      : "border-line bg-paper text-ink hover:border-ink/30 hover:shadow-[0_20px_40px_-24px_rgba(20,20,20,0.25)]",
                    wide && "sm:flex-row sm:items-center sm:justify-start sm:gap-8",
                  )}
                >
                  <IconCmp weight="light" className="size-8 shrink-0 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                  <div className={cn(wide ? "mt-0" : "mt-8")}>
                    <h3 className="text-lg font-medium tracking-tight">{item.title}</h3>
                    <p
                      className={cn(
                        "mt-2 max-w-md text-sm leading-relaxed",
                        dark ? "text-paper/65" : "text-muted",
                      )}
                    >
                      {item.body}
                    </p>
                  </div>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
