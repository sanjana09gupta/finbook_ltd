"use client";

import Link from "next/link";
import {
  BookOutlined,
  LineChartOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";
import { SERVICES } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Highlight } from "@/components/ui/Highlight";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Books: BookOutlined,
  ChartLineUp: LineChartOutlined,
  Certificate: SafetyCertificateOutlined,
};

export function ServicesList() {
  return (
    <section className="border-b border-line py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          title={
            <>
              Three ways we plug into your <Highlight>finance function</Highlight>.
            </>
          }
        />

        <div className="mt-14 border-t border-line">
          {SERVICES.map((service, i) => {
            const IconCmp = ICONS[service.icon];
            return (
              <Reveal key={service.slug} delay={i * 0.05}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative isolate grid items-center gap-4 overflow-hidden border-b border-line px-4 py-8 transition-colors duration-300 md:grid-cols-[auto_auto_1fr_auto_auto] md:gap-10 md:px-6"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                  />
                  <span className="hidden font-mono text-sm text-ink/25 transition-colors duration-300 group-hover:text-paper/40 md:block">
                    0{i + 1}
                  </span>
                  <IconCmp className="hidden [&>svg]:size-9 shrink-0 text-accent transition-transform duration-300 group-hover:scale-110 md:block" />
                  <div>
                    <h3 className="text-xl font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-paper md:text-2xl">
                      {service.title}
                    </h3>
                    <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-muted transition-colors duration-300 group-hover:text-paper/60">
                      {service.short}
                    </p>
                  </div>
                  <span className="hidden text-sm text-muted transition-colors duration-300 group-hover:text-paper/60 lg:block">
                    Learn more
                  </span>
                  <ArrowRightOutlined className="[&>svg]:size-5 shrink-0 text-ink/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
