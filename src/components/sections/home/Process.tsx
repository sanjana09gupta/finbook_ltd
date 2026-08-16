"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { PROCESS_STEPS } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

export function Process() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-line py-20 md:py-28">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-10 size-80 rounded-full bg-accent/[0.06] blur-3xl"
        animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="How it works"
          title="One platform. Three steps. Zero surprises."
          body="Finface keeps you and your accounting team on the same page, in real time, without a single spreadsheet email."
        />

        <div className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          <svg
            className="pointer-events-none absolute left-0 right-0 top-[128px] hidden w-full md:block"
            height="16"
            preserveAspectRatio="none"
            viewBox="0 0 100 16"
          >
            <motion.line
              x1="17"
              y1="8"
              x2="83"
              y2="8"
              stroke="var(--color-line)"
              strokeWidth="2"
              strokeDasharray="1 4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
            {!reduce && (
              <motion.circle
                r="3"
                fill="var(--color-accent)"
                initial={{ opacity: 0 }}
                whileInView={{
                  opacity: [0, 1, 1, 0],
                  cx: [17, 17, 83, 83],
                }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 3.2,
                  delay: 1.2,
                  repeat: Infinity,
                  repeatDelay: 0.6,
                  ease: "easeInOut",
                  times: [0, 0.08, 0.92, 1],
                }}
              />
            )}
          </svg>

          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.1} className="group flex flex-col">
              <motion.div
                animate={reduce ? undefined : { y: [0, -7, 0] }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.35,
                }}
              >
                <TiltCard strength={8}>
                  <div className="relative flex h-56 items-center justify-center md:h-64">
                    <Image
                      src={step.image}
                      alt=""
                      width={220}
                      height={220}
                      className="h-32 w-32 object-contain transition-transform duration-500 group-hover:scale-110 md:h-44 md:w-44"
                    />
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 18,
                        delay: 0.3 + i * 0.1,
                      }}
                      className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-ink font-mono text-[10px] text-paper"
                    >
                      {step.number}
                    </motion.span>
                  </div>
                </TiltCard>
              </motion.div>

              <div className="mt-6 flex items-center gap-2">
                <h3 className="text-xl font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-accent">
                  {step.title}
                </h3>
                {i < PROCESS_STEPS.length - 1 && (
                  <ArrowRightOutlined className="hidden [&>svg]:size-4 text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block" />
                )}
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
