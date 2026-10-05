"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { SplitText } from "@/components/ui/SplitText";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { Project } from "@/data/projects";
import { isPlaceholder } from "@/data/site";
import { useAppReady } from "@/lib/app-ready";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn, pad } from "@/lib/utils";

/** Body of /work/[slug]: hero, challenge, what I did, process, results, gallery. */
export function CaseStudy({ project, index }: { project: Project; index: number }) {
  const root = useRef<HTMLDivElement>(null);
  const ready = useAppReady();

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(".cs-fade", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 1, delay: 0.3 });
        gsap.fromTo(".cs-cover", { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 1.4, ease: "expo.out", delay: 0.4 });
        gsap.to(".cs-cover-inner", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: ".cs-cover", start: "top top+=80", end: "bottom top", scrub: true },
        });
        gsap.utils.toArray<HTMLElement>(".cs-reveal").forEach((el) => {
          gsap.from(el, { y: 50, autoAlpha: 0, duration: 1, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        });
        gsap.utils.toArray<HTMLElement>(".cs-gallery-item").forEach((el) => {
          gsap.from(el, { y: 60, autoAlpha: 0, duration: 1.1, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
          gsap.fromTo(
            el.querySelector(".cs-gallery-img"),
            { scale: 1.2 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });
      mm.add(MQ.reduce, () => {
        gsap.fromTo(".cs-fade, .cs-cover", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 });
      });
    },
    { scope: root, dependencies: [ready] },
  );

  const meta = [
    { label: "Category", value: project.category },
    { label: "Role", value: project.role },
    { label: "Year", value: project.year },
    { label: "Tools", value: project.tools.join(", ") },
  ];

  return (
    <div ref={root}>
      <header className="container-page pt-[calc(var(--nav-h)+3rem)]">
        <TransitionLink href="/#work" data-reveal="hero" className="cs-fade inline-flex items-center gap-2 text-sm text-muted hover:text-text">
          <ArrowLeft size={16} aria-hidden="true" /> All work
        </TransitionLink>
        <p data-reveal="hero" className="cs-fade mt-10 flex items-center gap-3 text-label text-muted">
          <span className="text-accent-ink">{pad(index + 1)}</span>
          <span className="h-px w-8 bg-border" aria-hidden="true" />
          {project.category}
        </p>
        <SplitText as="h1" trigger="mount" play={ready} reveal="hero" className="text-hero mt-5 max-w-[16ch] text-balance">
          {project.title}
        </SplitText>
        <p data-reveal="hero" className="cs-fade text-lead mt-6 max-w-2xl text-muted">
          {project.summary}
        </p>

        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-border bg-border lg:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label} data-reveal="hero" className="cs-fade bg-bg p-5 sm:p-6">
              <dt className="text-label text-muted">{m.label}</dt>
              <dd className={cn("mt-2 font-medium", isPlaceholder(m.value) && "text-muted")}>{m.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="container-page mt-12">
        <div data-reveal="hero" className="cs-cover relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface sm:aspect-[16/9]">
          <div className="cs-cover-inner absolute inset-x-0 -top-[6%] h-[112%]">
            <Image src={project.cover} alt={`${project.title} cover`} fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
          </div>
        </div>
      </div>

      <div className="container-page section-y space-y-[var(--section-y)]">
        <Block label="The challenge" index="01">
          <p className="text-[clamp(1.3rem,1rem+1.2vw,2rem)] font-medium leading-[1.35] tracking-[-0.015em]">{project.challenge}</p>
        </Block>

        <Block label="What I did" index="02">
          <ul className="divide-y divide-border border-y border-border">
            {project.whatIDid.map((item, i) => (
              <li key={item} className="cs-reveal flex gap-6 py-6">
                <span className="font-mono text-sm text-accent-ink">{pad(i + 1)}</span>
                <span className="text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block label="Process" index="03">
          <ol className="grid gap-4 sm:grid-cols-2">
            {project.process.map((step, i) => (
              <li key={step.title} className="cs-reveal rounded-[var(--radius-card)] border border-border bg-surface p-7">
                <span className="font-mono text-sm text-accent-ink">{pad(i + 1)}</span>
                <h3 className="text-h3 mt-4">{step.title}</h3>
                <p className="mt-2 text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </Block>

        <Block label="Results" index="04">
          <dl className="grid gap-4 sm:grid-cols-3">
            {project.results.map((r) => (
              <div key={r.label} className="cs-reveal flex flex-col rounded-[var(--radius-card)] border border-dashed border-border p-7">
                <dt className="order-2 mt-4 text-sm text-muted">{r.label}</dt>
                <dd className="order-1 font-display text-[clamp(2.5rem,2rem+2vw,4rem)] font-extrabold leading-none tracking-[-0.04em] text-accent-ink">{r.value}</dd>
              </div>
            ))}
          </dl>
          {project.results.some((r) => /\[.*\]/.test(r.value)) && (
            <p className="mt-4 font-mono text-xs text-muted">Placeholders: replace with real numbers in /data/projects.ts</p>
          )}
        </Block>

        <section aria-labelledby="gallery-title">
          <h2 id="gallery-title" className="mb-8 flex items-center gap-3 text-label text-muted">
            <span className="text-accent-ink">05</span>
            <span className="h-px w-8 bg-border" aria-hidden="true" />
            Gallery
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {project.gallery.map((g, i) => (
              <div
                key={g.src}
                className={cn(
                  "cs-gallery-item relative overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface",
                  i === 0 && project.gallery.length % 2 === 1 ? "aspect-[16/9] md:col-span-2" : "aspect-[4/3]",
                )}
              >
                <div className="cs-gallery-img absolute inset-0">
                  <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Block({ label, index, children }: { label: string; index: string; children: React.ReactNode }) {
  const id = `cs-${label.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <section aria-labelledby={id} className="grid gap-8 lg:grid-cols-12">
      <h2 id={id} className="flex items-center gap-3 self-start text-label text-muted lg:col-span-3">
        <span className="text-accent-ink">{index}</span>
        <span className="h-px w-8 bg-border" aria-hidden="true" />
        {label}
      </h2>
      <div className="lg:col-span-9">{children}</div>
    </section>
  );
}
