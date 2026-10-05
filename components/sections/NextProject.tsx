"use client";

import { ArrowRight } from "lucide-react";
import { AnimatePresence, m, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";
import { useRef, useState, type MouseEvent } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { Project } from "@/data/projects";
import { useFinePointer } from "@/lib/hooks";

/** Big "Next project" link. On desktop, a cover preview follows the cursor while hovering. */
export function NextProject({ project }: { project: Project }) {
  const fine = useFinePointer();
  const [hover, setHover] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 22 });
  const sy = useSpring(y, { stiffness: 200, damping: 22 });

  const onMove = (e: MouseEvent) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <section aria-label="Next project" className="border-t border-border">
      <div ref={box} className="container-page relative py-[clamp(4rem,10vw,8rem)]" onMouseMove={onMove}>
        <p className="text-label text-muted">Next project</p>
        <TransitionLink
          href={`/work/${project.slug}`}
          data-cursor="view"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          className="group mt-4 flex items-end justify-between gap-6"
        >
          <span className="text-display max-w-[14ch] transition-colors duration-300 group-hover:text-accent-ink">{project.title}</span>
          <span className="mb-2 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-accent-contrast transition-transform duration-500 group-hover:translate-x-2 sm:h-20 sm:w-20">
            <ArrowRight size={26} aria-hidden="true" />
          </span>
        </TransitionLink>
        <p className="mt-4 text-muted">{project.summary}</p>

        {fine && (
          // The positioned wrapper stays mounted so its springs keep tracking the cursor.
          <m.div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block" style={{ x: sx, y: sy }}>
            <AnimatePresence>
              {hover && (
                <m.div
                  key="preview"
                  className="relative -ml-40 -mt-28 h-56 w-80 overflow-hidden rounded-2xl border border-border shadow-2xl"
                  initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6, rotate: 6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  <Image src={project.cover} alt="" fill sizes="320px" className="object-cover" />
                </m.div>
              )}
            </AnimatePresence>
          </m.div>
        )}
      </div>
    </section>
  );
}
