"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type HighlightProps = {
  children: ReactNode;
  className?: string;
  tone?: "accent" | "paper";
  delay?: number;
};

export function Highlight({ children, className, tone = "accent", delay = 0.3 }: HighlightProps) {
  const reduce = useReducedMotion();

  return (
    // inline-block, not inline: an absolutely positioned full-width child
    // needs a single well-defined containing-block box. A plain `inline`
    // parent can fragment across line boxes, and browsers then size the
    // absolutely positioned child against just one fragment -- this is what
    // was producing the ~5px sliver instead of a box spanning the text.
    // whitespace-nowrap: an inline-block with auto width still wraps its
    // OWN text internally when it doesn't fit the remaining line -- turning
    // it into a two-line box whose auto width collapses to a sliver at the
    // wrap point. Forcing nowrap keeps the highlighted phrase as a single
    // atomic unit that moves to the next line whole, never splits mid-phrase.
    <span className={cn("relative inline-block whitespace-nowrap", className)}>
      {/* Pure opacity fade, deliberately not a scaleX sweep, as extra
          insurance: an interrupted scaleX-from-0 animation also renders as
          a thin colored sliver, which an opacity-only transition can't
          produce. */}
      <motion.span
        aria-hidden
        className={cn(
          "absolute inset-x-[-0.06em] bottom-[0.04em] top-[0.08em] -z-10 rounded-[0.15em]",
          tone === "accent" ? "bg-accent/20" : "bg-paper/20",
        )}
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, ease: "easeOut", delay }}
      />
      {children}
    </span>
  );
}
