"use client";

import { m, useScroll, useSpring } from "motion/react";

/** Thin accent bar at the very top that fills as you scroll the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <m.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
