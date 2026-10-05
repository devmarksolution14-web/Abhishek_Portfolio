"use client";

import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
};

/**
 * Tilts in 3D toward the cursor on hover, with a soft accent glow that
 * follows the pointer (transform + opacity only).
 */
export function TiltCard({ children, className, max = 8 }: Props) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 200, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  // The glow layer is card-sized, so translating it by % moves its centre to the cursor.
  const glowX = useTransform(px, (v) => `${(v - 0.5) * 100}%`);
  const glowY = useTransform(py, (v) => `${(v - 0.5) * 100}%`);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <m.div
      className={cn("group relative h-full", className)}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      initial="rest"
      whileHover="hover"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
        <m.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ x: glowX, y: glowY }}
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        </m.div>
      </div>
      {children}
    </m.div>
  );
}
