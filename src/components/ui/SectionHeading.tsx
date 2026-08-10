import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
  tone?: "ink" | "paper";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  tone = "ink",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <span
            className={cn(
              "mb-4 block text-[11px] font-medium uppercase tracking-[0.18em]",
              tone === "ink" ? "text-muted" : "text-paper/60",
            )}
          >
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2
          className={cn(
            "text-balance text-3xl font-medium tracking-tight md:text-4xl lg:text-[2.75rem]",
            tone === "ink" ? "text-ink" : "text-paper",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {body && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "mt-4 text-balance text-base leading-relaxed md:text-lg",
              tone === "ink" ? "text-muted" : "text-paper/70",
            )}
          >
            {body}
          </p>
        </Reveal>
      )}
    </div>
  );
}
