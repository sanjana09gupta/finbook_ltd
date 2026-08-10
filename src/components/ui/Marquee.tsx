"use client";

import { useReducedMotion } from "motion/react";
import { Circle } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";

type MarqueeProps = {
  items: string[];
  className?: string;
  speed?: number;
};

export function Marquee({ items, className, speed = 32 }: MarqueeProps) {
  const reduce = useReducedMotion();
  const reps = reduce ? [0] : [0, 1];

  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className={cn("flex w-max items-center gap-8", !reduce && "animate-marquee")}
        style={!reduce ? { animationDuration: `${speed}s` } : undefined}
      >
        {reps.map((rep) => (
          <div key={rep} className="flex shrink-0 items-center gap-8" aria-hidden={rep === 1}>
            {items.map((item, i) => (
              <span key={`${rep}-${i}`} className="flex shrink-0 items-center gap-8">
                <span className="text-sm font-medium uppercase tracking-[0.18em] text-ink/40">
                  {item}
                </span>
                <Circle weight="fill" className="size-1.5 shrink-0 text-accent" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
