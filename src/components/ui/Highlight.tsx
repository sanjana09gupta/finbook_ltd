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
    <span className={cn("relative inline", className)}>
      <motion.span
        aria-hidden
        className={cn(
          "absolute inset-x-[-0.06em] bottom-[0.04em] top-[0.08em] -z-10 origin-left rounded-[0.15em]",
          tone === "accent" ? "bg-accent/20" : "bg-paper/20",
        )}
        initial={reduce ? false : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
        style={{ transformOrigin: "left" }}
      />
      {children}
    </span>
  );
}
