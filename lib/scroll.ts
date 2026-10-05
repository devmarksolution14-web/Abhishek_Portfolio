"use client";

import type Lenis from "lenis";

/**
 * Tiny scroll store shared by the Lenis provider, preloader, menu and links.
 * When Lenis is off (reduced motion) everything falls back to native scroll.
 */
let lenis: Lenis | null = null;
let locks = 0;

export const setLenisInstance = (instance: Lenis | null) => {
  lenis = instance;
  if (lenis && locks > 0) lenis.stop();
};

export const getLenis = () => lenis;

/** Lock / unlock page scrolling (ref-counted so overlays can nest). */
export const lockScroll = (locked: boolean) => {
  locks = Math.max(0, locks + (locked ? 1 : -1));
  const isLocked = locks > 0;
  document.documentElement.classList.toggle("scroll-locked", isLocked);
  if (isLocked) lenis?.stop();
  else lenis?.start();
};

type Target = string | number | HTMLElement;

/** Absolute Y of an element, honouring its CSS scroll-margin-top (clears the fixed navbar). */
const resolveY = (target: Target) => {
  if (typeof target === "number") return target;
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return null;
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  return el.getBoundingClientRect().top + window.scrollY - margin;
};

/** Smooth-scroll to a selector, element or Y position. */
export const scrollToTarget = (target: Target, opts: { immediate?: boolean; offset?: number } = {}) => {
  // Resolve to a number from the real scroll position: after a route change
  // Next may have scrolled natively, so Lenis's own position can be stale.
  const y = resolveY(target);
  if (y === null) return;
  const top = Math.max(0, y + (opts.offset ?? 0));
  if (lenis) {
    // Lenis clamps to its cached page height, which lags behind route changes and pins.
    lenis.resize();
    if (opts.immediate) lenis.scrollTo(top, { immediate: true, force: true });
    else lenis.scrollTo(top, { duration: 1.4 });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: opts.immediate || reduce ? "auto" : "smooth" });
};
