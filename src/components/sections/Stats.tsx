"use client";

import { STATS } from "@/lib/content";
import { RevealGroup, staggerChild } from "@/components/motion/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { motion } from "motion/react";

export function Stats() {
  return (
    <section className="border-b border-line bg-paper-dim/60">
      <div className="container-page py-10 md:py-14">
        <RevealGroup className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerChild}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="cursor-default"
            >
              <p className="font-mono text-3xl font-medium tracking-tight text-ink md:text-4xl">
                <CountUp target={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="mt-1.5 text-sm leading-snug text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
