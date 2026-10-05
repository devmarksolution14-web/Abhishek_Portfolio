"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MQ, SplitText as GSAPSplitText, useGSAP } from "@/lib/gsap";
import { scheduleInit } from "@/lib/gsap-queue";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "scroll" reveals when the element enters the viewport; "mount" plays immediately. */
  trigger?: "scroll" | "mount";
  /** Hold the animation until this is true (e.g. until the preloader finishes). */
  play?: boolean;
  delay?: number;
  stagger?: number;
  start?: string;
  id?: string;
  /** "hero" keeps it visible under the preloader on first load (see globals.css). */
  reveal?: "default" | "hero";
};

/**
 * Splits text into words (GSAP SplitText) and slides each word up from a mask.
 * Nested elements (like an accent-coloured <span>) are preserved.
 * Reduced motion: a simple fade.
 */
export function SplitText({
  as: Tag = "h2",
  children,
  className,
  trigger = "scroll",
  play = true,
  delay = 0,
  stagger = 0.06,
  start = "top 85%",
  id,
  reveal = "default",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (context) => {
      const el = ref.current;
      if (!el || !play) return;

      const setup = () => {
        const mm = gsap.matchMedia();

        mm.add(MQ.motion, () => {
          const split = GSAPSplitText.create(el, {
            type: "words",
            mask: "words",
            autoSplit: true,
            onSplit(self) {
              self.masks.forEach((m) => m.classList.add("split-mask"));
              gsap.set(el, { visibility: "visible" });
              return gsap.from(self.words, {
                yPercent: 115,
                duration: 1.1,
                stagger,
                delay,
                ease: "power4.out",
                scrollTrigger: trigger === "scroll" ? { trigger: el, start, once: true } : undefined,
              });
            },
          });
          return () => split.revert();
        });

        mm.add(MQ.reduce, () => {
          gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, delay });
        });

        return () => mm.revert();
      };

      // Above-the-fold text animates now; scroll reveals wait in the init queue.
      if (trigger === "mount") return setup();
      return scheduleInit(() => context.add(setup));
    },
    { scope: ref, dependencies: [play], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} id={id} className={className} data-reveal={reveal}>
      {children}
    </Tag>
  );
}
