"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";
import { getLenis, setLenisInstance } from "@/lib/scroll";

/**
 * Smooth scrolling for the whole site, driven by GSAP's ticker so Lenis and
 * ScrollTrigger always agree on the scroll position. Turned off entirely
 * when the visitor prefers reduced motion.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const mql = window.matchMedia(MQ.reduce);
    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);

    const start = () => {
      lenis = new Lenis({ autoRaf: false, lerp: 0.1, wheelMultiplier: 1, anchors: false });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenisInstance(lenis);
    };
    const stop = () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
      setLenisInstance(null);
      gsap.ticker.lagSmoothing(500, 33);
    };
    const onChange = () => {
      stop();
      if (!mql.matches) start();
      ScrollTrigger.refresh();
    };

    if (!mql.matches) start();
    mql.addEventListener("change", onChange);
    return () => {
      mql.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  // New route: jump to the top (or the #hash) and re-measure triggers.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) getLenis()?.scrollTo(0, { immediate: true, force: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return <>{children}</>;
}
