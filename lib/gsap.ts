"use client";

/**
 * Registers GSAP plugins exactly once, on the client only.
 * Always import gsap / ScrollTrigger / SplitText / useGSAP from here.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
}

/** gsap.matchMedia conditions shared across sections. */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
