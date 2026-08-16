"use client";

import { CheckOutlined } from "@ant-design/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

type FeatureChecklistProps = {
  title: string;
  items: { title: string; body: string }[];
};

export function FeatureChecklist({ title, items }: FeatureChecklistProps) {
  return (
    <section className="border-b border-line py-20 md:py-28">
      <div className="container-page">
        <SectionHeading title={title} />

        <div className="mt-14 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 0.08} className="flex gap-4">
              <CheckOutlined className="mt-1 [&>svg]:size-5 shrink-0 text-accent" />
              <div>
                <h3 className="text-base font-medium text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
