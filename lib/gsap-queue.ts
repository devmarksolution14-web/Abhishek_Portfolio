"use client";

import type { useGSAP as UseGSAP } from "@gsap/react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";

/**
 * Below-the-fold scroll animations don't need to exist during hydration.
 * Each section's setup is queued and run in its own short task, so a phone
 * never sees one long main-thread block. When the queue drains, ScrollTrigger
 * is sorted and refreshed once so pinned sections measure correctly.
 */
type Job = { run: () => void; cancelled: boolean };
const queue: Job[] = [];
let scheduled = false;
const whenDone = new Set<() => void>();

const next = () => {
  const job = queue.shift();
  if (job && !job.cancelled) job.run();
  if (queue.length) {
    setTimeout(next, 0);
  } else {
    scheduled = false;
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    getLenis()?.resize(); // pins changed the page height
    whenDone.forEach((cb) => cb());
    whenDone.clear();
  }
};

/** Run once every queued section is set up and measured (immediately if idle). */
export function afterInit(cb: () => void) {
  if (!scheduled && queue.length === 0) {
    cb();
    return () => {};
  }
  whenDone.add(cb);
  return () => {
    whenDone.delete(cb);
  };
}

export function scheduleInit(run: () => void) {
  const job: Job = { run, cancelled: false };
  queue.push(job);
  if (!scheduled) {
    scheduled = true;
    setTimeout(next, 0);
  }
  return () => {
    job.cancelled = true;
  };
}

type Config = Parameters<typeof UseGSAP>[1];

/**
 * Same as useGSAP (scoped, auto-reverted on unmount), but the setup runs from
 * the init queue. Everything created inside is recorded in the useGSAP
 * context via context.add(), so cleanup still happens automatically.
 */
export function useDeferredGSAP(setup: () => void, config?: Config) {
  useGSAP((context) => scheduleInit(() => context.add(setup)), config);
}
