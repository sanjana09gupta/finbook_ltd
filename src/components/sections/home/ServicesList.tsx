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
          eyebrow="What we do"
          title={
            <>
              Our <Highlight>services</Highlight>.
            </>
          }
        />

        <div className="mt-12 grid border-t border-line md:mt-16 md:grid-cols-3">
          {DISPLAY_SERVICES.map((service, i) => {
            return (
              <Reveal key={service.slug} delay={i * 0.06} className="h-full">
                <Link href={`/services/${service.slug}`} className="group flex h-full flex-col border-b border-line py-6 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-paper-dim catalogue-frame">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 flex size-9 items-center justify-center bg-ink font-mono text-[10px] text-paper">
                      0{i + 1}
                    </span>
                  </div>

                  <div className="relative z-10 flex flex-1 flex-col border-x border-b border-line bg-paper p-5 transition-colors duration-300 group-hover:border-accent md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-2xl text-ink transition-colors duration-300 group-hover:text-accent lg:text-3xl">
                        {service.title}
                      </h3>
                      <ArrowRightOutlined className="mt-1 shrink-0 [&>svg]:size-4 text-accent transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted">{service.short}</p>
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
