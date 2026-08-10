"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Hero3D } from "@/components/three/Hero3D";
import { Marquee } from "@/components/ui/Marquee";
import { CONTACT_CTA } from "@/lib/content";

const HEADLINE = "The finance team you didn't have to hire.".split(" ");

const wordContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: 28, rotate: 1.5 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const MARQUEE_ITEMS = [
  "Bookkeeping",
  "Taxation",
  "CFO Advisory",
  "Reporting",
  "Compliance",
  "Payroll",
];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <>
      <section className="relative flex min-h-[calc(100dvh-72px)] items-center overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0">
          <Hero3D />
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/75 to-paper/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent" />
        </div>

        <div className="container-page relative pb-20 pt-16 md:pb-28">
          <div className="max-w-2xl">
            <motion.span
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted"
            >
              <motion.span
                className="inline-block size-1.5 rounded-full bg-accent"
                animate={reduce ? undefined : { scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              Accounting, tax, and CFO support
            </motion.span>

            <motion.h1
              variants={reduce ? undefined : wordContainer}
              initial={reduce ? false : "hidden"}
              animate="show"
              className="flex flex-wrap text-balance text-4xl font-medium leading-[1.05] tracking-tight text-ink md:text-6xl lg:text-[4.2rem]"
            >
              {HEADLINE.map((w, i) => (
                <motion.span key={i} variants={reduce ? undefined : word} className="mr-[0.28em] inline-block">
                  {w}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-lg text-balance text-base leading-relaxed text-muted md:text-lg"
            >
              Chartered accountants handle your books, taxes, and reporting, so you spend
              your hours on the business, not the balance sheet.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Button href="/contact-us">{CONTACT_CTA}</Button>
              <Button href="/why-finbook" variant="secondary" showArrow={false}>
                See how it works
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="border-b border-line bg-paper-dim/50 py-4">
        <Marquee items={MARQUEE_ITEMS} />
      </div>
    </>
  );
}
