"use client";

import { useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";
import { useDeferredGSAP } from "@/lib/gsap-queue";

type Props = {
  /** null shows a [XX] placeholder instead of animating. */
  value: number | null;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
};

/** Counts up from 0 the first time it scrolls into view. */
export function Counter({ value, suffix = "", prefix = "", duration = 1.8, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useDeferredGSAP(
    () => {
      if (value === null) return;
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const obj = { v: 0 };
        el.textContent = "0";
        gsap.to(obj, {
          v: value,
          duration,
          ease: "power3.out",
          onUpdate: () => (el.textContent = String(Math.round(obj.v))),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
        return () => (el.textContent = String(value));
      });
    },
    { dependencies: [value] },
  );

  return (
    <span className={className}>
      {prefix}
      <span ref={ref} className="tabular-nums">
        {value === null ? "[XX]" : value}
      </span>
      {suffix}
    </span>
  );
}
