"use client";

import { Check } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "motion/react";
import { PLANS, CONTACT_CTA } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export function PricingTiers() {
  const reduce = useReducedMotion();

  return (
    <section className="border-b border-line py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Plans"
          title="Three tiers, one honest promise: real accountants, real numbers."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.06}>
              <motion.div
                whileHover={reduce ? undefined : { y: -8 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className={cn(
                  "relative flex h-full flex-col overflow-hidden rounded-2xl border p-8",
                  plan.featured ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink",
                )}
              >
                {plan.featured && (
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-accent/25 blur-3xl"
                    animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                {plan.featured && (
                  <span className="absolute right-6 top-6 rounded-full bg-accent px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-paper">
                    Popular
                  </span>
                )}

                <h3 className="text-xl font-medium tracking-tight">{plan.name}</h3>
                <p
                  className={cn(
                    "mt-2 text-sm leading-relaxed",
                    plan.featured ? "text-paper/65" : "text-muted",
                  )}
                >
                  {plan.body}
                </p>

                <ul className="mt-7 flex flex-1 flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check weight="bold" className="mt-0.5 size-4 shrink-0 text-accent" />
                      <span className={plan.featured ? "text-paper/85" : "text-ink/80"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  href="/contact-us"
                  variant={plan.featured ? "ghost" : "secondary"}
                  className="relative mt-8 w-fit"
                >
                  {CONTACT_CTA}
                </Button>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
