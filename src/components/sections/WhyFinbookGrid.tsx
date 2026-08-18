"use client";

import {
  MoneyCollectOutlined,
  ReadOutlined,
  AimOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";
import { DIFFERENTIATORS } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Highlight } from "@/components/ui/Highlight";
import { cn } from "@/lib/cn";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  PiggyBank: MoneyCollectOutlined,
  GraduationCap: ReadOutlined,
  Target: AimOutlined,
  ShieldCheck: SafetyOutlined,
  ClockCountdown: ClockCircleOutlined,
  LockKey: LockOutlined,
};

const SPANS = [
  "sm:col-span-2 lg:col-span-2",
  "sm:col-span-2 lg:col-span-1",
  "sm:col-span-1",
  "sm:col-span-1",
  "sm:col-span-2 lg:col-span-1",
  "sm:col-span-2 lg:col-span-3",
];

export function WhyFinbookGrid({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section className="border-b border-paper/10 bg-ink py-20 md:py-28">
      <div className="container-page">
        {showHeading && (
          <SectionHeading
            tone="paper"
            eyebrow="Why Finbook"
            title={
              <>
                Six reasons founders <Highlight>stop worrying</Highlight> about the books.
              </>
            }
          />
        )}

        <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", showHeading && "mt-16")}>
          {DIFFERENTIATORS.map((item, i) => {
            const IconCmp = ICONS[item.icon];
            const dark = i === 0 || i === 5;
            const wide = i === 5;
            return (
              <Reveal key={item.title} delay={(i % 3) * 0.06} className={SPANS[i]}>
                <SpotlightCard
                  spotlightClassName={dark ? "mix-blend-screen" : undefined}
                  radius={dark ? 320 : 240}
                  intensity={dark ? 0.22 : 0.14}
                  className={cn(
                    "flex h-full flex-col justify-between rounded-md border p-7 transition-all duration-300 hover:-translate-y-1",
                    dark
                      ? "border-teal/30 bg-ink-soft bg-grid-dark text-paper hover:border-teal/60"
                      : "border-paper/10 bg-ink-soft text-paper hover:border-teal/40",
                    wide && "sm:flex-row sm:items-center sm:justify-start sm:gap-8",
                  )}
                >
                  <IconCmp className="[&>svg]:size-8 shrink-0 text-teal transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                  <div className={cn(wide ? "mt-0" : "mt-8")}>
                    <h3 className="text-lg font-medium tracking-tight">{item.title}</h3>
                    <p
                      className={cn(
                        "mt-2 max-w-md text-sm leading-relaxed",
                        "text-paper/60",
                      )}
                    >
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
