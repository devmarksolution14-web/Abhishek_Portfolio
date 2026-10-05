"use client";

import { useSyncExternalStore } from "react";

/**
 * "App ready" = the preloader has finished (or was skipped). The hero waits
 * for this before playing its intro so the two never overlap.
 */
let ready = false;
const listeners = new Set<() => void>();

export const markAppReady = () => {
  if (ready) return;
  ready = true;
  listeners.forEach((l) => l());
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const useAppReady = () =>
  useSyncExternalStore(
    subscribe,
    () => ready,
    () => false,
  );
