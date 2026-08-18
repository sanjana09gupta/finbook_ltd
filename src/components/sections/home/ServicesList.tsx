"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRightOutlined } from "@ant-design/icons";
import { SERVICES } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Highlight } from "@/components/ui/Highlight";

const DISPLAY_SERVICES = [SERVICES[0], SERVICES[2], SERVICES[1]];

export function ServicesList() {
  return (
    <section className="border-b border-line bg-paper py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          title={
            <>
              Our <Highlight>services</Highlight>.
            </>
          }
        />

        <div className="mt-12 grid gap-6 md:mt-14 md:grid-cols-3 md:gap-5 lg:gap-7">
          {DISPLAY_SERVICES.map((service, i) => {
            return (
              <Reveal key={service.slug} delay={i * 0.06} className="h-full">
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-paper-dim">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 flex size-8 items-center justify-center rounded-full bg-ink/90 font-mono text-[10px] text-paper">
                      0{i + 1}
                    </span>
                  </div>

                  <div className="relative z-10 mx-3 -mt-14 flex flex-1 flex-col rounded-md border border-line bg-paper p-5 shadow-[0_14px_35px_-24px_rgba(14,26,37,0.45)] transition-transform duration-300 group-hover:-translate-y-1 md:mx-4 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg tracking-tight text-ink transition-colors duration-300 group-hover:text-teal lg:text-xl">
                        {service.title}
                      </h3>
                      <ArrowRightOutlined className="mt-1 shrink-0 [&>svg]:size-4 text-teal transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{service.short}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
