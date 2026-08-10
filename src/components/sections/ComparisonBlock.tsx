"use client";

import { Check, X } from "@phosphor-icons/react/dist/ssr";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

const ROWS = [
  { label: "Time to hire and onboard", inHouse: "6-10 weeks", finbook: "Under 2 weeks" },
  { label: "Access to a chartered accountant", inHouse: false, finbook: true },
  { label: "Backup when someone is out sick", inHouse: false, finbook: true },
  { label: "Software, training, and desk overhead", inHouse: true, finbook: false },
  { label: "Real-time reporting platform", inHouse: false, finbook: true },
  { label: "Typical monthly cost", inHouse: "Full salary + benefits", finbook: "40-50% less" },
];

function Cell({ value, tone }: { value: string | boolean; tone: "muted" | "accent" }) {
  if (typeof value === "boolean") {
    return value ? (
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
      >
        <Check weight="bold" className={tone === "accent" ? "size-4 text-accent" : "size-4 text-ink/60"} />
      </motion.span>
    ) : (
      <X weight="bold" className="size-4 text-ink/20" />
    );
  }
  return <>{value}</>;
}

export function ComparisonBlock() {
  return (
    <section className="border-b border-line py-20 md:py-28">
      <div className="container-page">
        <SectionHeading title="In-house hire, or Finbook. Here's the honest comparison." />

        <Reveal delay={0.1} className="mt-14 overflow-hidden rounded-2xl border border-line">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-paper-dim text-sm font-medium text-ink">
            <div className="px-5 py-4 md:px-7">Comparing</div>
            <div className="px-5 py-4 md:px-7">In-house hire</div>
            <div className="px-5 py-4 text-accent md:px-7">Finbook</div>
          </div>
          {ROWS.map((row) => (
            <div
              key={row.label}
              className="group grid grid-cols-[1.4fr_1fr_1fr] border-t border-line text-sm transition-colors duration-200 hover:bg-paper-dim/50"
            >
              <div className="px-5 py-4 text-ink/85 md:px-7">{row.label}</div>
              <div className="flex items-center px-5 py-4 text-muted md:px-7">
                <Cell value={row.inHouse} tone="muted" />
              </div>
              <div className="flex items-center px-5 py-4 text-ink md:px-7">
                <Cell value={row.finbook} tone="accent" />
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
