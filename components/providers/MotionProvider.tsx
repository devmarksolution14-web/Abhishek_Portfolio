"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

/**
 * - LazyMotion: components use the lightweight `m.*` elements and the
 *   animation features load right after hydration.
 * - reducedMotion="user": for visitors who prefer reduced motion, Motion
 *   skips transform and layout animations; opacity fades still run.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
