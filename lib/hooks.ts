"use client";

import { useSyncExternalStore } from "react";

/** SSR-safe media query hook (false on the server and during hydration). */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Desktop-class pointer: a mouse or trackpad that can hover. */
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");
