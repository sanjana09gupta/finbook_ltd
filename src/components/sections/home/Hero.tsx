"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { PiggyBank, UsersThree, ClockCountdown } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { Hero3D } from "@/components/three/Hero3D";
import { Marquee } from "@/components/ui/Marquee";
import { Highlight } from "@/components/ui/Highlight";
import { FloatingBadge } from "@/components/ui/FloatingBadge";
import { CONTACT_CTA } from "@/lib/content";

const HEADLINE_A = "The finance team you".split(" ");
const HEADLINE_B = "didn't have to hire.";

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
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-1/4 size-96 rounded-full bg-accent/[0.06] blur-[120px]"
        />

        <div className="container-page relative grid items-center gap-16 py-16 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="max-w-xl">
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
              className="flex flex-wrap items-baseline text-balance text-4xl font-medium leading-[1.05] tracking-tight text-ink md:text-6xl lg:text-[3.75rem]"
            >
              {HEADLINE_A.map((w, i) => (
                <motion.span key={i} variants={reduce ? undefined : word} className="mr-[0.28em] inline-block">
                  {w}
                </motion.span>
              ))}
              <motion.span variants={reduce ? undefined : word} className="inline-block">
                <Highlight delay={0.9}>{HEADLINE_B}</Highlight>
              </motion.span>
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

            <div className="mt-10 flex gap-3 overflow-x-auto pb-2 lg:hidden">
              <FloatingBadge
                icon={<PiggyBank weight="bold" className="size-4" />}
                value="40-50%"
                label="Lower cost"
                delay={0.8}
                className="shrink-0"
              />
              <FloatingBadge
                icon={<UsersThree weight="bold" className="size-4" />}
                value="5 CAs"
                label="Lead every account"
                delay={0.88}
                className="shrink-0"
              />
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-paper-dim shadow-[0_40px_80px_-32px_rgba(20,20,20,0.35)]">
              <Hero3D />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper-dim/60 via-transparent to-transparent" />
            </div>

            <FloatingBadge
              icon={<PiggyBank weight="bold" className="size-5" />}
              value="40-50%"
              label="Lower cost than in-house"
              delay={0.85}
              floatDelay={0}
              className="absolute -left-8 -top-6"
            />
            <FloatingBadge
              icon={<UsersThree weight="bold" className="size-5" />}
              value="5"
              label="Chartered accountants"
              delay={0.95}
              floatDelay={0.6}
              className="absolute -bottom-6 -right-6"
            />
            <FloatingBadge
              icon={<ClockCountdown weight="bold" className="size-5" />}
              value="Real-time"
              label="Reports, always current"
              delay={1.05}
              floatDelay={1.2}
              className="absolute -right-10 top-1/3"
            />
          </div>
        </div>
      </section>

      <div className="border-b border-line bg-paper-dim/50 py-4">
        <Marquee items={MARQUEE_ITEMS} />
      </div>
    </>
  );
}
