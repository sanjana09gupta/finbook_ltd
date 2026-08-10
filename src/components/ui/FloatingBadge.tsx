"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type FloatingBadgeProps = {
  icon: ReactNode;
  value: string;
  label: string;
  className?: string;
  delay?: number;
  floatDelay?: number;
};

export function FloatingBadge({
  icon,
  value,
  label,
  className,
  delay = 0.6,
  floatDelay = 0,
}: FloatingBadgeProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.85, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("z-10", className)}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
        className="flex items-center gap-3 rounded-2xl border border-line bg-paper/90 px-4 py-3 shadow-[0_20px_50px_-20px_rgba(20,20,20,0.35)] backdrop-blur-md"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
          {icon}
        </span>
        <span className="leading-tight">
          <span className="block font-mono text-base font-medium text-ink">{value}</span>
          <span className="block text-[11px] text-muted">{label}</span>
        </span>
      </motion.div>
    </motion.div>
  );
}
