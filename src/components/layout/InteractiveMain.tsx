"use client";

import type { PointerEvent, ReactNode } from "react";

type InteractiveMainProps = {
  children: ReactNode;
};

export function InteractiveMain({ children }: InteractiveMainProps) {
  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const section = target.closest<HTMLElement>("main > section");
    if (!section || section.className.includes("bg-ink")) return;

    const rect = section.getBoundingClientRect();
    section.style.setProperty("--light-spotlight-x", `${event.clientX - rect.left}px`);
    section.style.setProperty("--light-spotlight-y", `${event.clientY - rect.top}px`);
  }

  return (
    <main className="flex-1" onPointerMove={handlePointerMove}>
      {children}
    </main>
  );
}
