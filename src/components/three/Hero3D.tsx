"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";

const LedgerGrid = dynamic(() => import("./LedgerGrid").then((m) => m.LedgerGrid), {
  ssr: false,
  loading: () => null,
});

export function Hero3D() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(218,36,13,0.08), transparent 45%), radial-gradient(circle at 70% 60%, rgba(20,20,20,0.06), transparent 50%)",
        }}
      />
    );
  }

  return <LedgerGrid />;
}
