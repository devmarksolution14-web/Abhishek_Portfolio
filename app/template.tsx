"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { hasNavigated } from "@/lib/navigation";

/** Fades each new route in after the transition curtain. The first load is never hidden. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <m.div
      initial={hasNavigated() ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
    >
      {children}
    </m.div>
  );
}
