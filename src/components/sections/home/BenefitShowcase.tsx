"use client";

import { useRef } from "react";
import { MoneyCollectOutlined, TeamOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { ComponentType } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { Highlight } from "@/components/ui/Highlight";
import { cn } from "@/lib/cn";

const BENEFITS: {
  icon: ComponentType<{ className?: string }>;
  value: string;
  title: string;
  body: string;
  span: string;
}[] = [
  {
    icon: MoneyCollectOutlined,
    value: "40-50%",
    title: "Lower cost, same expertise",
    body: "You get chartered-accountant-level work for less than half the cost of an in-house hire, benefits and overhead included.",
    span: "lg:col-span-1 lg:row-span-2",
  },
  {
    icon: TeamOutlined,
    value: "5",
    title: "Chartered accountants, not a call center",
    body: "Every engagement is led by a qualified CA who knows your business, not a rotating support queue.",
    span: "lg:col-span-2 lg:row-span-1",
  },
  {
    icon: ClockCircleOutlined,
    value: "Real-time",
    title: "Numbers that are never stale",
    body: "Reports and reconciliation update as transactions happen, not once a quarter.",
    span: "lg:col-span-2 lg:row-span-1",
  },
];

export function BenefitShowcase() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden bg-ink bg-grid-dark py-20 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(560px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(218,36,13,0.16), transparent 70%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 size-[28rem] rounded-full bg-accent/[0.12] blur-[140px]"
        animate={reduce ? undefined : { opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-page relative">
        <Reveal>
          <span className="mb-4 block text-[11px] font-medium uppercase tracking-[0.18em] text-paper/45">
            Why founders switch
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="max-w-2xl text-balance text-3xl font-medium leading-tight tracking-tight text-paper md:text-5xl">
            Three reasons growing businesses hand{" "}
            <Highlight>their books</Highlight> to Finbook.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          {BENEFITS.map((item, i) => {
            const IconCmp = item.icon;
            const tall = i === 0;
            return (
              <Reveal
                key={item.title}
                delay={i * 0.08}
                className={cn(item.span, "group")}
              >
                <div
                  className={cn(
                    "flex h-full flex-col justify-between rounded-2xl border border-paper/10 bg-paper/[0.04] p-8 transition-colors duration-300 hover:border-accent/40 hover:bg-paper/[0.06]",
                    tall ? "gap-10" : "sm:flex-row sm:items-center sm:gap-8",
                  )}
                >
                  <IconCmp className="[&>svg]:size-9 shrink-0 text-accent transition-transform duration-300 group-hover:scale-110" />
                  <div className={tall ? "" : "flex-1"}>
                    <p
                      className={cn(
                        "font-mono font-medium tracking-tight text-paper",
                        tall ? "text-5xl md:text-6xl" : "text-4xl",
                      )}
                    >
                      {item.value}
                    </p>
                    <h3 className="mt-3 text-lg font-medium tracking-tight text-paper">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-paper/60">
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
