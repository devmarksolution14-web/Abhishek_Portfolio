"use client";

import { Ear, Hammer, Map as MapIcon, TrendingUp, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/data/skills";
import { gsap, MQ } from "@/lib/gsap";
import { useDeferredGSAP } from "@/lib/gsap-queue";
import { pad } from "@/lib/utils";

const icons: LucideIcon[] = [Ear, MapIcon, Hammer, TrendingUp];

/**
 * Four steps revealed one after another while the section is pinned
 * (desktop). On phones, tablets / reduced motion they simply fade in.
 */
export function Process() {
  const root = useRef<HTMLElement>(null);

  useDeferredGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const steps = gsap.utils.toArray<HTMLElement>(".process-step");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".process-pin",
            pin: true,
            start: "top top",
            end: () => `+=${window.innerHeight * 1.6}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        steps.forEach((step, i) => {
          tl.fromTo(step, { autoAlpha: 0.12 }, { autoAlpha: 1, duration: 1, ease: "power2.out" }, i)
            .fromTo(step.querySelector(".process-card"), { y: 60 }, { y: 0, duration: 1, ease: "power2.out" }, i)
            .fromTo(step.querySelector(".process-num"), { scale: 0.6 }, { scale: 1, duration: 1 }, i)
            .to(".process-line", { scaleX: (i + 1) / steps.length, duration: 1, ease: "none" }, i);
        });
        tl.to({}, { duration: 0.4 }); // short hold at the end
      });

      mm.add(`(max-width: 1023px) and ${MQ.motion}`, () => {
        gsap.utils.toArray<HTMLElement>(".process-step").forEach((step) => {
          gsap.from(step, { y: 40, autoAlpha: 0, duration: 0.9, scrollTrigger: { trigger: step, start: "top 88%", once: true } });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" aria-labelledby="process-title">
      <div className="process-pin flex flex-col lg:min-h-[100svh] justify-center py-[var(--section-y)] lg:py-[calc(var(--nav-h)+2rem)]">
        <div className="container-page">
          <SectionHeading
            index="05"
            label="Process"
            id="process-title"
            title="How we'll work together."
            description="A simple, transparent process. You always know what's happening, what it costs and what comes next."
          />

          <div className="relative mt-14 lg:mt-20">
            <div aria-hidden="true" className="absolute left-0 right-0 top-7 hidden h-px bg-border lg:block">
              <div className="process-line h-full w-full origin-left scale-x-0 bg-accent" />
            </div>
            <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, i) => {
                const Icon = icons[i % icons.length];
                return (
                  <li key={step.title} className="process-step relative flex flex-col">
                    <div className="process-num relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-bg font-mono text-sm text-accent-ink">
                      {pad(i + 1)}
                    </div>
                    <div className="process-card mt-6 flex-1 rounded-[var(--radius-card)] border border-border bg-surface p-7">
                      <Icon size={24} strokeWidth={1.7} aria-hidden="true" className="text-accent-ink" />
                      <h3 className="text-h3 mt-6">{step.title}</h3>
                      <p className="mt-3 text-sm text-muted">{step.description}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
