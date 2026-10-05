"use client";

import { useEffect } from "react";
import { afterInit } from "@/lib/gsap-queue";
import { scrollToTarget } from "@/lib/scroll";

/**
 * Arriving at "/#work" from another page: wait until every section has set
 * up its ScrollTriggers (pins change the page height), then jump to the
 * target so the position is correct.
 */
export function HashScroll() {
  useEffect(
    () =>
      // Read the hash late: after a client-side navigation it may not be in the URL yet on mount.
      afterInit(() => {
        const hash = window.location.hash;
        if (hash.length < 2) return;
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (el) scrollToTarget(el, { immediate: true });
      }),
    [],
  );
  return null;
}
