"use client";

import { motion, useReducedMotion } from "motion/react";
import { DELIVERY_STEPS } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

export function DeliveryTimeline() {
  const reduce = useReducedMotion();

  return (
    <section className="border-b border-line py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Service delivery approach"
          title="A clear path from records to results."
          body="Every engagement follows the same disciplined sequence, from onboarding to ongoing deadline monitoring."
        />

        <div className="relative mt-16">
          <div
            aria-hidden
            className="absolute left-[18px] top-2 bottom-2 w-px bg-line md:left-[22px]"
          >
            <motion.div
              className="h-full w-full origin-top bg-accent"
              initial={reduce ? undefined : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <ol className="space-y-10 md:space-y-12">
            {DELIVERY_STEPS.map((step, i) => (
              <Reveal
                key={step.number}
                as="li"
                delay={i * 0.06}
                className="relative flex gap-6 md:gap-8"
              >
                <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper font-mono text-[11px] text-ink md:size-11 md:text-xs">
                  {step.number}
                </span>
                <div className="pt-1 md:pt-2">
                  <h3 className="text-lg font-medium tracking-tight text-ink md:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
