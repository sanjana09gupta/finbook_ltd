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
        "relative overflow-hidden border-b border-paper/10 bg-ink pb-16 pt-14 text-paper md:pb-20 md:pt-20",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-teal/[0.08] blur-3xl"
      />
      <div className="container-page relative">
        <div className="max-w-2xl">
          <Reveal>
            <span className="mb-5 block text-[11px] font-medium uppercase tracking-[0.18em] text-teal">
              {eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-balance text-4xl leading-[1.1] tracking-tight text-paper md:text-5xl lg:text-6xl">
              {title}
            </h1>
          </Reveal>
          {body && (
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-paper/65 md:text-lg">
                {body}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
