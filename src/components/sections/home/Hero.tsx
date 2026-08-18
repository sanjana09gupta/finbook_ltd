"use client";

import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Highlight } from "@/components/ui/Highlight";
import { Hero3D } from "@/components/three/Hero3D";

const TRUST_POINTS = [
  ["CA-led", "Qualified team"],
  ["40-50%", "Lower cost"],
  ["Real-time", "Clear reporting"],
] as const;

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-line bg-paper lg:min-h-[calc(100dvh-112px)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 top-16 size-[30rem] rounded-full bg-teal/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-12 right-[38%] size-36 rounded-full bg-accent/10 blur-2xl"
      />

      <div className="container-page relative grid items-center gap-10 py-12 md:py-16 lg:min-h-[calc(100dvh-112px)] lg:grid-cols-[0.92fr_1.08fr] lg:gap-8 lg:py-12">
        <div className="relative z-10 max-w-2xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-teal"
          >
            Chartered accountant-led finance support
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl text-balance text-4xl font-medium leading-[1.02] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-[4.25rem]"
          >
            <span className="block">Your books, handled.</span>
            <Highlight delay={0.55}>Your business, growing.</Highlight>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg"
          >
            Chartered accountants manage your bookkeeping, tax and reporting, so you can focus on growth with clear, current numbers.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button href="/contact-us">Book a free consultation</Button>
            <Button href="/services/accounting-and-bookkeeping" variant="secondary">
              Explore services
            </Button>
          </motion.div>

          <motion.dl
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.58 }}
            className="mt-9 grid max-w-xl grid-cols-3 divide-x divide-line border-y border-line py-4"
          >
            {TRUST_POINTS.map(([value, label]) => (
              <div key={value} className="px-3 first:pl-0 md:px-5 md:first:pl-0">
                <dt className="font-mono text-xs font-semibold text-ink md:text-sm">{value}</dt>
                <dd className="mt-1 text-[10px] leading-snug text-muted md:text-xs">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute inset-0 z-0 lg:pointer-events-auto lg:relative lg:inset-auto lg:min-h-[34rem]"
        >
          <div className="absolute inset-0 overflow-hidden opacity-30 lg:rounded-md lg:border lg:border-line lg:bg-paper-dim/55 lg:opacity-100 lg:shadow-[0_24px_60px_-42px_rgba(14,26,37,0.45)]">
            <Hero3D />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper/90 via-paper/60 to-paper/75 lg:from-paper/15 lg:via-transparent lg:to-paper-dim/40"
            />
          </div>
          <div className="absolute left-4 top-4 hidden rounded-md border border-line bg-paper/90 px-4 py-3 shadow-sm backdrop-blur lg:block lg:left-6 lg:top-6">
            <p className="font-mono text-xs font-semibold text-ink">Live finance view</p>
            <p className="mt-1 text-[11px] text-muted">Your numbers move as your business does.</p>
          </div>
          <div className="absolute bottom-4 right-4 hidden rounded-md border border-teal/50 bg-paper/90 px-4 py-3 text-right shadow-sm backdrop-blur lg:block lg:bottom-6 lg:right-6">
            <p className="font-mono text-xs font-semibold text-teal">Finface</p>
            <p className="mt-1 text-[11px] text-muted">Reports, documents and conversations in one place.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
