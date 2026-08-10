"use client";

import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CONTACT_CTA } from "@/lib/content";

type CtaBandProps = {
  title?: string;
  body?: string;
};

export function CtaBand({
  title = "Ready to hand off the books?",
  body = "A short call is enough to tell you whether Finbook is the right fit, no obligation, no sales script.",
}: CtaBandProps) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[120px]"
        animate={reduce ? undefined : { opacity: [0.5, 0.9, 0.5], scale: [1, 1.12, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-page relative py-20 text-center md:py-28">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-medium tracking-tight text-paper md:text-5xl">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-5 max-w-md text-balance text-base leading-relaxed text-paper/60">
            {body}
          </p>
        </Reveal>
        <Reveal delay={0.16} className="mt-9">
          <Button href="/contact-us" variant="ghost" className="hover:bg-accent hover:border-accent">
            {CONTACT_CTA}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
