"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

type CtaBandProps = {
  title?: string;
  body?: string;
};

export function CtaBand({
  title = "Fixed monthly fee, no setup charge — first consultation free.",
  body,
}: CtaBandProps) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden bg-ink bg-grid-dark"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(560px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(126,184,176,0.16), transparent 70%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/15 blur-[120px]"
        animate={reduce ? undefined : { opacity: [0.5, 0.9, 0.5], scale: [1, 1.12, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-page relative py-16 text-center md:py-24">
        <Reveal>
          <Image
            src="/images/finbook-ltd-logo-white.png"
            alt="Finbook Ltd"
            width={632}
            height={1145}
            className="mx-auto h-20 w-auto md:h-28"
          />
        </Reveal>
        <Reveal>
          <h2 className="mx-auto mt-10 max-w-4xl text-balance text-3xl font-semibold leading-tight tracking-tight text-paper md:mt-12 md:text-5xl">
            {title}
          </h2>
        </Reveal>
        {body && (
          <Reveal delay={0.08}>
            <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-paper/65">
              {body}
            </p>
          </Reveal>
        )}
        <Reveal delay={0.16} className="mt-9">
          <Button
            href="/contact-us"
            variant="ghost"
            className="min-w-56 justify-center rounded-lg border-teal px-8 py-4 text-base text-teal hover:border-teal hover:bg-teal hover:text-ink"
          >
            Book a call
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
