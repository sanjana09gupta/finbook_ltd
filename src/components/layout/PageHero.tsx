import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  className?: string;
};

export function PageHero({ eyebrow, title, body, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-line pb-16 pt-14 md:pb-20 md:pt-20",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-accent/[0.07] blur-3xl"
      />
      <div className="container-page relative">
        <div className="max-w-2xl">
          <Reveal>
            <span className="mb-5 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              {eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-balance text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl lg:text-6xl">
              {title}
            </h1>
          </Reveal>
          {body && (
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-muted md:text-lg">
                {body}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
