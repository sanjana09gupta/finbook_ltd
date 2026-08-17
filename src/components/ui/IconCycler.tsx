"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

// Rotating permutations of the 3 icon positions (123 -> 321 -> 231 -> repeat),
// swapped automatically like a looping gif rather than only reordering on hover.
const ORDERS = [
  [0, 1, 2],
  [2, 1, 0],
  [1, 2, 0],
];

type Tool = { name: string; slug: string };

export function IconCycler({
  tools,
  size = 48,
  intervalMs = 1200,
  className,
}: {
  tools: readonly Tool[];
  size?: number;
  intervalMs?: number;
  className?: string;
}) {
  const [orderIndex, setOrderIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setOrderIndex((i) => (i + 1) % ORDERS.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [reduce, intervalMs]);

  const order = ORDERS[orderIndex];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {order.map((toolIndex) => {
        const tool = tools[toolIndex];
        if (!tool) return null;
        return (
          <motion.div
            key={tool.slug}
            layout
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="flex shrink-0 items-center justify-center rounded-2xl border border-line bg-paper shadow-[0_8px_20px_-12px_rgba(20,20,20,0.25)]"
            style={{ width: size, height: size }}
          >
            <Image
              src={`https://cdn.simpleicons.org/${tool.slug}`}
              alt={tool.name}
              width={Math.round(size * 0.46)}
              height={Math.round(size * 0.46)}
              unoptimized
              style={{ width: Math.round(size * 0.46), height: Math.round(size * 0.46) }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
