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
            "radial-gradient(circle at 30% 20%, rgba(142,169,186,0.22), transparent 45%), radial-gradient(circle at 70% 60%, rgba(225,40,45,0.14), transparent 50%)",
        }}
      />
    );
  }

  return <LedgerGrid />;
}
