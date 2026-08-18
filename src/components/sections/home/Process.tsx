"use client";

import Image from "next/image";
import { ArrowRightOutlined } from "@ant-design/icons";
import { PROCESS_STEPS } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

export function Process() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper py-12 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-10 size-80 rounded-full bg-teal/[0.14] blur-3xl"
      />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="How it works"
          title="One platform. Three steps. Zero surprises."
          body="Finface keeps you and your accounting team on the same page, in real time, without a single spreadsheet email."
        />

        <div className="relative mt-8 grid gap-9 md:mt-16 md:grid-cols-3 md:gap-8">
          <span
            aria-hidden
            className="absolute left-[8%] right-[8%] top-24 hidden h-px bg-line md:block"
          />

          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.08} className="group h-full">
              <article className="flex h-full flex-col">
                <div className="relative z-10 flex h-32 items-center justify-center md:h-48">
                  <span className="absolute right-1 top-0 flex size-7 items-center justify-center rounded-full bg-ink font-mono text-[10px] text-paper md:right-4">
                    {step.number}
                  </span>
                  <Image
                    src={step.image}
                    alt=""
                    width={220}
                    height={220}
                    className="size-28 object-contain transition-transform duration-500 group-hover:scale-105 md:size-40"
                  />
                </div>
                <div className="mt-2 md:mt-7">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg tracking-tight text-ink transition-colors duration-300 group-hover:text-teal md:text-xl">
                      {step.title}
                    </h3>
                    {i < PROCESS_STEPS.length - 1 && (
                      <ArrowRightOutlined className="[&>svg]:size-4 text-teal/65" />
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted md:mt-3">
                    {step.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
