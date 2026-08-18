"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { ArrowUpOutlined } from "@ant-design/icons";
import { cn } from "@/lib/cn";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  showArrow?: boolean;
};

const variants = {
  primary:
    "bg-teal text-ink hover:bg-paper border border-teal hover:border-paper",
  secondary: "bg-transparent text-teal border border-teal/60 hover:border-teal hover:bg-teal hover:text-ink",
  ghost: "bg-transparent text-paper border border-teal/60 hover:border-teal hover:bg-teal hover:text-ink",
};

export function Button({ href, children, variant = "primary", className, showArrow = true }: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 300, damping: 20, mass: 0.4 });
  const springY = useSpring(my, { stiffness: 300, damping: 20, mass: 0.4 });

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    my.set((e.clientY - rect.top - rect.height / 2) * 0.5);
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      style={reduce ? undefined : { x: springX, y: springY }}
      className="inline-block"
    >
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "group inline-flex items-center gap-2 whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium tracking-tight transition-colors duration-300 focus-visible:outline focus-visible:outline-2",
          variants[variant],
          className,
        )}
      >
        {children}
        {showArrow && (
          <ArrowUpOutlined className="[&>svg]:size-4 shrink-0 rotate-45 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        )}
      </Link>
    </motion.div>
  );
}
