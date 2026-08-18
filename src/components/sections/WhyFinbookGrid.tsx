"use client";

import Image from "next/image";
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
  "col-span-2 lg:col-span-2",
  "col-span-1 lg:col-span-1",
  "col-span-1",
  "col-span-1",
  "col-span-1 lg:col-span-1",
  "col-span-2 lg:col-span-3",
];

export function WhyFinbookGrid({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section className="border-b border-line bg-paper py-20 md:py-28">
      <div className="container-page">
        {showHeading && (
          <SectionHeading
            title={
              <>
                Why choose <Highlight>Finbook</Highlight>?
              </>
            }
            body="Discover why businesses trust us with their finance function."
          />
        )}

        <div
          className={cn(
            showHeading
              ? "mt-10 grid items-center gap-12 md:mt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
              : "",
          )}
        >
          <div
            className={cn(
              "grid grid-cols-2 gap-2.5 md:gap-4",
              !showHeading && "lg:grid-cols-3",
            )}
          >
            {DIFFERENTIATORS.map((item, i) => {
              const IconCmp = ICONS[item.icon];
              const wide = !showHeading && i === 5;
              return (
                <Reveal
                  key={item.title}
                  delay={(i % 3) * 0.06}
                  className={showHeading ? "h-full" : SPANS[i]}
                >
                  <SpotlightCard
                    radius={showHeading ? 220 : i === 0 || i === 5 ? 320 : 240}
                    intensity={showHeading ? 0.12 : i === 0 || i === 5 ? 0.2 : 0.14}
                    className={cn(
                      "flex h-full rounded-md border text-ink transition-all duration-300 hover:-translate-y-1",
                      showHeading
                        ? "items-center gap-3 border-line bg-paper p-3 hover:border-teal md:gap-4 md:p-5"
                        : "flex-col justify-between p-4 md:p-7",
                      !showHeading &&
                        (i === 0 || i === 5
                          ? "border-teal/50 bg-teal/15 hover:border-teal"
                          : "border-line bg-paper-dim/70 hover:border-teal/60"),
                      wide && "md:flex-row md:items-center md:justify-start md:gap-8",
                    )}
                  >
                    <span className={cn(showHeading && "flex size-10 shrink-0 items-center justify-center rounded-full bg-paper-dim md:size-12")}>
                      <IconCmp className="[&>svg]:size-5 md:[&>svg]:size-7 shrink-0 text-teal transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                    </span>
                    <div className={cn(showHeading ? "min-w-0" : wide ? "mt-3 md:mt-0" : "mt-4 md:mt-8")}>
                      <h3 className="text-sm font-medium tracking-tight md:text-base">{item.title}</h3>
                      {!showHeading && (
                        <p className="mt-1.5 max-w-md text-xs leading-relaxed text-muted md:mt-2 md:text-sm">
                          {item.body}
                        </p>
                      )}
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>

          {showHeading && (
            <Reveal delay={0.12} className="relative">
              <div className="relative flex items-center justify-center">
                <span className="absolute left-4 top-4 z-10 max-w-40 rounded-md bg-teal px-4 py-3 text-sm font-medium leading-snug text-ink shadow-lg md:-left-4 md:top-2">
                  Finface, one-stop solution
                </span>
                <Image
                  src="/images/whychoosepic.png"
                  alt="Finface accounting analytics dashboard displayed on a desktop computer"
                  width={576}
                  height={414}
                  className="h-auto w-full max-w-[640px] object-contain"
                />
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
