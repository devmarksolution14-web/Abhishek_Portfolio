"use client";

import { useRef } from "react";
import { Counter } from "@/components/ui/Counter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/data/site";
import { gsap, MQ, SplitText } from "@/lib/gsap";
import { useDeferredGSAP } from "@/lib/gsap-queue";

const story = `As a USA education counsellor I help students in Nepal find the right US universities, prepare strong applications and walk into their visa interviews with confidence. That work taught me how much a clear story matters, and how often good people and good brands get overlooked because theirs isn't told well. So I moved into design and marketing, and joined ${site.agency} to put all of it to work. Today I guide students toward their goals and help brands grow with the same care: listen first, plan clearly, then build.`;

const stats = [
  { value: site.counsellingYears, suffix: "+", label: "Years as a USA counsellor" },
  { value: 3, suffix: "", label: "Skill disciplines" },
  { value: site.projectsCount, suffix: "+", label: "Projects delivered" },
];

export function About() {
  const root = useRef<HTMLElement>(null);
  const para = useRef<HTMLParagraphElement>(null);

  useDeferredGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Each word lights up from 20% to full opacity as you scroll past.
        // aria: "none" keeps the words as plain readable text (an aria-label on a <p> is invalid).
        const split = SplitText.create(para.current!, { type: "words", aria: "none", autoSplit: true, onSplit(self) {
          return gsap.fromTo(
            self.words,
            { opacity: 0.2 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: para.current, start: "top 80%", end: "bottom 45%", scrub: true },
            },
          );
        } });
        gsap.from(".about-stat", {
          y: 40,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1,
          scrollTrigger: { trigger: ".about-stats", start: "top 88%", once: true },
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" tabIndex={-1} aria-labelledby="about-title" className="section-y outline-none">
      <div className="container-page">
        <SectionHeading index="01" label="About" id="about-title" title="Guiding students, growing brands." />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12">
          <p className="hidden text-label text-muted lg:col-span-3 lg:block">
            ( The story so far )
          </p>
          <p ref={para} className="text-[clamp(1.4rem,1rem+1.6vw,2.4rem)] font-medium leading-[1.3] tracking-[-0.02em] lg:col-span-9">
            {story}
          </p>
        </div>

        <dl className="about-stats mt-20 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-border bg-border sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="about-stat flex flex-col gap-3 bg-bg p-8 sm:p-10">
              <dt className="order-2 text-label text-muted">{s.label}</dt>
              <dd className="order-1 font-display text-[clamp(3rem,2rem+4vw,5.5rem)] font-extrabold leading-none tracking-[-0.05em]">
                <Counter value={s.value} suffix={s.value === null ? "" : s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
