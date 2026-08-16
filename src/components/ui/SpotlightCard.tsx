"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  spotlightClassName?: string;
  radius?: number;
  intensity?: number;
};

export function SpotlightCard({
  children,
  className,
  spotlightClassName,
  radius = 240,
  intensity = 0.14,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn("group relative overflow-hidden", className)}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          spotlightClassName,
        )}
        style={{
          background: `radial-gradient(${radius}px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(218,36,13,${intensity}), transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
