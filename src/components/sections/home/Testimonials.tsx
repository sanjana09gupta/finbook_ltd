"use client";

import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { TESTIMONIALS } from "@/lib/content";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const reduce = useReducedMotion();

  const move = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const distance = track.clientWidth * 0.82;

    if (direction === 1 && track.scrollLeft + distance >= maxScroll - 8) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (direction === -1 && track.scrollLeft <= 8) {
      track.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (reduce) return;

    const timer = window.setInterval(() => {
      if (!pausedRef.current) move(1);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [move, reduce]);

  return (
    <section className="border-b border-line bg-paper-dim py-20 md:py-28">
      <div className="container-page">
        <div className="flex items-end justify-between gap-5">
          <SectionHeading
            eyebrow="Client feedback"
            title="What clients say about working with Finbook."
          />
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              aria-label="Previous client feedback"
              onClick={() => move(-1)}
              className="flex size-10 items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-teal hover:bg-teal/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
            >
              <ArrowLeftOutlined className="[&>svg]:size-4" />
            </button>
            <button
              type="button"
              aria-label="Next client feedback"
              onClick={() => move(1)}
              className="flex size-10 items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-teal hover:bg-teal/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
            >
              <ArrowRightOutlined className="[&>svg]:size-4" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          aria-label="Client feedback carousel"
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
          onFocusCapture={() => {
            pausedRef.current = true;
          }}
          onBlurCapture={() => {
            pausedRef.current = false;
          }}
          onTouchStart={() => {
            pausedRef.current = true;
          }}
          onTouchEnd={() => {
            pausedRef.current = false;
          }}
          className="mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-14 md:gap-5"
        >
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              key={t.name}
              delay={(i % 3) * 0.05}
              className="min-w-[84%] snap-start sm:min-w-[46%] lg:min-w-[31.5%]"
            >
              <article className="h-full rounded-md border border-line bg-paper p-4 transition-colors duration-300 hover:border-teal md:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-teal/50 font-mono text-xs text-teal">
                    {initials(t.name)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink/75">&ldquo;{t.quote}&rdquo;</p>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-2 text-center text-[10px] uppercase tracking-[0.14em] text-muted sm:hidden">
          Swipe to read more
        </p>
      </div>
    </section>
  );
}
