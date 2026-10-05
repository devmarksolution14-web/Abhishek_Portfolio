"use client";

import { Asterisk } from "lucide-react";
import { useRef } from "react";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";
import { useDeferredGSAP } from "@/lib/gsap-queue";
import { cn } from "@/lib/utils";

type Props = {
  items: string[];
  /** Seconds for one full loop at rest. */
  duration?: number;
  className?: string;
};

/**
 * Infinite horizontal strip. Scrolling down speeds it up leftwards,
 * scrolling up reverses it. Driven by GSAP's ticker so reversing is seamless.
 * Reduced motion: a static strip.
 */
export function Marquee({ items, duration = 32, className }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useDeferredGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = track.current!;
        const setX = gsap.quickSetter(el, "xPercent");
        const wrap = gsap.utils.wrap(-50, 0);
        const base = 50 / duration; // xPercent per second
        let x = 0;
        let direction = -1;
        const speed = { v: 1 };
        let visible = true;

        const tick = (_t: number, delta: number) => {
          if (!visible) return;
          x = wrap(x + direction * base * speed.v * (delta / 1000));
          setX(x);
        };
        gsap.ticker.add(tick);

        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (visible = self.isActive),
          onUpdate: (self) => {
            direction = self.direction === 1 ? -1 : 1;
            const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 350);
            speed.v = boost;
            gsap.to(speed, { v: 1, duration: 0.9, ease: "power2.out", overwrite: true });
          },
        });

        return () => {
          gsap.ticker.remove(tick);
          st.kill();
        };
      });
    },
    { scope: root },
  );

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-[clamp(1.75rem,1rem+3.5vw,3.75rem)] font-bold tracking-[-0.03em] sm:px-10">
            {item}
          </span>
          <Asterisk aria-hidden="true" className="h-[0.8em] w-[0.8em] shrink-0 text-[clamp(1.75rem,1rem+3.5vw,3.75rem)]" strokeWidth={2.5} />
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={root} className={cn("overflow-hidden", className)}>
      <h2 className="sr-only">Skills: {items.join(", ")}</h2>
      <div ref={track} className="flex w-max will-change-transform" aria-hidden="true">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
