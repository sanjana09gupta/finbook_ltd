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
              "catalogue-eyebrow mb-5",
              tone === "ink" ? "text-muted" : "text-paper/70",
            )}
          >
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2
          className={cn(
            "text-balance text-4xl md:text-5xl lg:text-[3.25rem]",
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
