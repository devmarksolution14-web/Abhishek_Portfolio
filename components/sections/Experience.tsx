"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience } from "@/data/experience";
import { gsap, MQ } from "@/lib/gsap";
import { useDeferredGSAP } from "@/lib/gsap-queue";

/** Vertical timeline: the line draws itself with scroll; items slide in from the side. */
export function Experience() {
  const root = useRef<HTMLElement>(null);

  useDeferredGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          ".exp-line",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ".exp-list", start: "top 70%", end: "bottom 60%", scrub: true },
          },
        );
        gsap.utils.toArray<HTMLElement>(".exp-item").forEach((item) => {
          gsap.from(item, {
            x: 80,
            autoAlpha: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 85%", once: true },
          });
          gsap.from(item.querySelector(".exp-dot"), {
            scale: 0,
            duration: 0.6,
            ease: "back.out(2)",
            scrollTrigger: { trigger: item, start: "top 70%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="experience" tabIndex={-1} aria-labelledby="experience-title" className="section-y outline-none">
      <div className="container-page grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
            <SectionHeading index="04" label="Experience" id="experience-title" title="From student counselling to building brands." className="md:grid-cols-1" />
            <p className="mt-6 max-w-sm text-muted">
              A counsellor&apos;s ear for what people need, applied to marketing and design.
            </p>
          </div>
        </div>

        <ol className="exp-list relative lg:col-span-7">
          <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-border" />
          <span aria-hidden="true" className="exp-line absolute bottom-2 left-[7px] top-2 w-px origin-top bg-accent" />
          {experience.map((item) => (
            <li key={item.role} className="exp-item relative pb-14 pl-12 last:pb-0">
              <span aria-hidden="true" className="exp-dot absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-accent bg-bg" />
              <p className="text-label text-accent-ink">{item.period}</p>
              <h3 className="text-h3 mt-3">{item.role}</h3>
              <p className="mt-1 font-medium text-text/80">{item.org}</p>
              <p className="mt-4 max-w-xl text-muted">{item.description}</p>
              {item.highlights.length > 0 && (
                <ul className="mt-5 space-y-2">
                  {item.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-sm text-muted">
                      <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-accent" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
