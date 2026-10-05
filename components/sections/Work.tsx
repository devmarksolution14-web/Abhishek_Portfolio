"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, LayoutGroup, m } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { categories, projects, type Category, type Project } from "@/data/projects";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";
import { useDeferredGSAP } from "@/lib/gsap-queue";
import { cn, pad } from "@/lib/utils";

type Filter = "All" | Category;
const filters: Filter[] = ["All", ...categories];
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Desktop: the section pins and the cards scroll horizontally (GSAP).
 * Mobile / reduced motion: a vertical stack. Filtering reorders cards with
 * Motion layout animations; the active tab pill slides via layoutId.
 */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  useDeferredGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const el = track.current!;
        const distance = () => Math.max(0, el.scrollWidth - (el.parentElement?.clientWidth ?? window.innerWidth));

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".work-pin",
            pin: true,
            start: "top top",
            end: () => `+=${Math.max(distance(), 1)}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        tl.to(el, { x: () => -distance(), ease: "none" }, 0).fromTo(
          ".work-progress",
          { scaleX: 0 },
          { scaleX: 1, ease: "none" },
          0,
        );
      });
    },
    { scope: root },
  );

  // Track width changes when filtering: re-measure the pin once cards settle.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => window.clearTimeout(id);
  }, [filter]);

  return (
    <section ref={root} id="work" tabIndex={-1} aria-labelledby="work-title" className="outline-none">
      <div className="work-pin flex flex-col py-[var(--section-y)]">
        <div className="container-page">
          <SectionHeading
            index="03"
            label="Selected work"
            id="work-title"
            title={
              <>
                Projects that moved the numbers{" "}
                <sup className="font-mono text-base font-normal tracking-normal text-muted">({pad(projects.length)})</sup>
              </>
            }
          />

          <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <LayoutGroup id="work-filters">
              <div role="group" aria-label="Filter projects by category" className="no-scrollbar -mx-1 flex max-w-full gap-1 overflow-x-auto rounded-full border border-border p-1">
                {filters.map((f) => {
                  const active = f === filter;
                  return (
                    <button
                      key={f}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "relative shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-300 sm:px-5",
                        active ? "text-accent-contrast" : "text-muted hover:text-text",
                      )}
                    >
                      {active && (
                        <m.span
                          layoutId="work-filter-pill"
                          className="absolute inset-0 rounded-full bg-accent"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="relative z-10">{f}</span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
            <div className="hidden h-px w-40 overflow-hidden bg-border lg:block" aria-hidden="true">
              <div className="work-progress h-full w-full origin-left scale-x-0 bg-accent" />
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
          </p>
        </div>

        <div className="work-viewport mt-10 lg:mt-14">
          <ul ref={track} className="work-track">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((p) => (
                <m.li
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.5, ease }}
                >
                  <ProjectCard project={p} index={projects.indexOf(p)} />
                </m.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <m.article initial="rest" whileHover="hover" whileFocus="hover" className="group relative h-full">
      <TransitionLink
        href={`/work/${project.slug}`}
        data-cursor="view"
        className="flex h-full flex-col rounded-[var(--radius-card)] border border-border bg-surface p-3 transition-colors duration-500 hover:border-accent/50"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(var(--radius-card)-8px)] bg-bg">
          <m.div
            className="absolute inset-0"
            variants={{ rest: { scale: 1 }, hover: { scale: 1.07 } }}
            transition={{ duration: 0.8, ease }}
          >
            <Image
              src={project.cover}
              alt={`${project.title} cover`}
              fill
              sizes="(min-width: 1024px) 30rem, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </m.div>
          <span className="absolute left-4 top-4 rounded-full bg-bg/85 px-3 py-1.5 font-mono text-xs text-text backdrop-blur-sm">
            {project.category}
          </span>
        </div>
        <div className="flex flex-1 items-start justify-between gap-4 px-3 pb-3 pt-6">
          <div>
            <p className="font-mono text-xs text-muted">{pad(index + 1)}</p>
            <h3 className="text-h3 mt-2">{project.title}</h3>
            <p className="mt-2 text-sm text-muted">{project.summary}</p>
          </div>
          <m.span
            aria-hidden="true"
            className="mt-6 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border"
            variants={{ rest: { rotate: 0 }, hover: { rotate: 45 } }}
            transition={{ duration: 0.4, ease }}
          >
            <ArrowUpRight size={18} />
          </m.span>
        </div>
      </TransitionLink>
    </m.article>
  );
}
