"use client";

import { GraduationCap, Megaphone, PenTool, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { skills, type Skill } from "@/data/skills";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";
import { useDeferredGSAP } from "@/lib/gsap-queue";
import { pad } from "@/lib/utils";

const iconMap: Record<Skill["icon"], LucideIcon> = {
  counselling: GraduationCap,
  marketing: Megaphone,
  design: PenTool,
};

export function Skills() {
  const root = useRef<HTMLElement>(null);

  useDeferredGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // GSAP owns the outer wrapper (entrance); Motion owns the inner TiltCard (hover).
        gsap.set(".skill-card", { autoAlpha: 0, y: 60 });
        const batch = ScrollTrigger.batch(".skill-card", {
          start: "top 88%",
          once: true,
          onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 1, ease: "power3.out" }),
        });
        return () => batch.forEach((t) => t.kill());
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="skills" tabIndex={-1} aria-labelledby="skills-title" className="section-y outline-none">
      <div className="container-page">
        <SectionHeading
          index="02"
          label="Skills & services"
          id="skills-title"
          title="Three disciplines, one growth mindset."
          description="Counselling students and growing brands take the same skills: listen closely, plan clearly and deliver work people can trust. I bring all three disciplines to the same table."
        />

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-20 lg:grid-cols-3" style={{ perspective: 1200 }}>
          {skills.map((skill, i) => {
            const Icon = iconMap[skill.icon];
            return (
              <li key={skill.title} className="skill-card md:last:odd:col-span-2 lg:last:odd:col-span-1">
                <TiltCard className="rounded-[var(--radius-card)]">
                  <article className="relative flex h-full flex-col rounded-[var(--radius-card)] border border-border bg-surface p-7 transition-colors duration-500 group-hover:border-accent/50 sm:p-9">
                    <div className="flex items-start justify-between">
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-contrast">
                        <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <span className="font-mono text-sm text-muted">{pad(i + 1)}</span>
                    </div>
                    <h3 className="text-h3 mt-10">{skill.title}</h3>
                    <p className="mt-4 text-muted">{skill.description}</p>
                    <ul className="mt-8 flex flex-wrap gap-2" aria-label={`${skill.title} skills`}>
                      {skill.tags.map((tag) => (
                        <li key={tag} className="rounded-full border border-border px-3 py-1.5 font-mono text-xs text-text">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </article>
                </TiltCard>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
