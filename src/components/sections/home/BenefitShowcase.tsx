"use client";

import { MoneyCollectOutlined, TeamOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { ComponentType } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { Highlight } from "@/components/ui/Highlight";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/cn";

const BENEFITS: {
  icon: ComponentType<{ className?: string }>;
  value?: string;
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

  return (
    <section
      className="group relative overflow-hidden border-b border-line bg-paper-dim py-10 md:py-20 lg:py-28"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 size-[28rem] rounded-full bg-teal/[0.10] blur-[140px]"
        animate={reduce ? undefined : { opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-page relative">
        <Reveal>
          <span className="mb-4 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            Why founders switch
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="max-w-2xl text-balance text-2xl font-medium leading-tight tracking-tight text-ink md:text-3xl lg:text-5xl">
            Three reasons growing businesses hand{" "}
            <Highlight>their books</Highlight> to Finbook.
          </h2>
        </Reveal>

        <div className="mt-6 grid gap-2.5 sm:mt-8 sm:grid-cols-2 md:mt-14 md:gap-4 lg:grid-cols-3 lg:grid-rows-2">
          {BENEFITS.map((item, i) => {
            const IconCmp = item.icon;
            const tall = i === 0;
            return (
              <Reveal
                key={item.title}
                delay={i * 0.08}
                className={cn(item.span, "group")}
              >
                <SpotlightCard
                  radius={tall ? 340 : 280}
                  intensity={0.14}
                  className={cn(
                    "flex h-full flex-row items-center gap-4 rounded-md border border-line bg-paper p-4 text-ink transition-all duration-300 hover:border-teal hover:shadow-[0_18px_40px_-30px_rgba(14,26,37,0.5)] md:p-8",
                    tall
                      ? "sm:flex-col sm:items-stretch sm:justify-between sm:gap-5 md:gap-10"
                      : "sm:flex-row sm:items-center sm:gap-8",
                  )}
                >
                  <IconCmp className="[&>svg]:size-7 md:[&>svg]:size-9 shrink-0 text-teal transition-transform duration-300 group-hover:scale-110" />
                  <div className={tall ? "" : "flex-1"}>
                    {item.value && (
                      <p
                        className={cn(
                          "font-mono font-medium tracking-tight text-teal",
                          tall ? "text-3xl md:text-5xl lg:text-6xl" : "text-2xl md:text-4xl",
                        )}
                      >
                        {item.value}
                      </p>
                    )}
                    <h3
                      className={cn(
                        "text-base tracking-tight text-ink md:text-lg",
                        item.value && "mt-2 md:mt-3",
                      )}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-1.5 hidden max-w-md text-sm leading-relaxed text-muted sm:block md:mt-2">
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
