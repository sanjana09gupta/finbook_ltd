"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

type SplitImageProps = {
  eyebrow?: string;
  title: ReactNode;
  body: ReactNode;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  children?: ReactNode;
};

export function SplitImage({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  reverse = false,
  children,
}: SplitImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -32, reduce ? 0 : 32]);

  return (
    <section ref={ref} className="border-b border-line py-20 md:py-28">
      <div className="container-page grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <Reveal className={cn(reverse && "md:order-2")}>
          <div className="overflow-hidden rounded-2xl bg-paper-dim">
            <motion.div style={{ y }}>
              <Image
                src={image}
                alt={imageAlt}
                width={640}
                height={520}
                className="h-full w-full scale-110 object-cover"
              />
            </motion.div>
          </div>
        </Reveal>

        <div className={cn(reverse && "md:order-1")}>
          {eyebrow && (
            <Reveal>
              <span className="mb-4 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                {eyebrow}
              </span>
            </Reveal>
          )}
          <Reveal delay={0.05}>
            <h2 className="text-balance text-3xl font-medium tracking-tight text-ink md:text-4xl">
              {title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-balance text-base leading-relaxed text-muted md:text-lg">
              {body}
            </p>
          </Reveal>
          {children && (
            <Reveal delay={0.15} className="mt-6">
              {children}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
