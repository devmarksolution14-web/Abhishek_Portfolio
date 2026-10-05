"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/skills";
import { isPlaceholder } from "@/data/site";
import { cn } from "@/lib/utils";

const INTERVAL = 6000;

/** Auto-sliding carousel with drag/swipe (Motion drag), arrows and dots. Pauses on hover/focus. */
export function Testimonials() {
  const reduce = useReducedMotion();
  const viewport = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const count = testimonials.length;

  const go = (i: number) => setIndex((i + count) % count);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (paused || dragging || reduce || count < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, dragging, reduce, count]);

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="section-y">
      <div className="container-page">
        <SectionHeading index="06" label="Testimonials" id="testimonials-title" title="Kind words from clients." />

        <div
          className="mt-14 lg:mt-20"
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div ref={viewport} className="overflow-hidden rounded-[var(--radius-card)]">
            <m.div
              className="flex cursor-grab touch-pan-y active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: -(count - 1) * width, right: 0 }}
              dragElastic={0.15}
              animate={{ x: -index * width }}
              transition={{ type: "spring", stiffness: 260, damping: 34 }}
              onDragStart={() => setDragging(true)}
              onDragEnd={(_, info) => {
                setDragging(false);
                const threshold = width / 5;
                if (info.offset.x < -threshold || info.velocity.x < -500) go(Math.min(index + 1, count - 1));
                else if (info.offset.x > threshold || info.velocity.x > 500) go(Math.max(index - 1, 0));
              }}
              aria-live={paused ? "polite" : "off"}
            >
              {testimonials.map((t, i) => {
                const placeholder = isPlaceholder(t.quote);
                return (
                  <div
                    key={i}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${count}`}
                    aria-hidden={i !== index}
                    className="w-full shrink-0 select-none"
                  >
                    <figure
                      className={cn(
                        "flex min-h-[22rem] flex-col justify-between gap-10 rounded-[var(--radius-card)] border bg-surface p-8 sm:p-12",
                        placeholder ? "border-dashed border-border" : "border-border",
                      )}
                    >
                      <Quote size={40} aria-hidden="true" className="text-accent-ink" strokeWidth={1.5} />
                      <blockquote className="text-[clamp(1.4rem,1rem+1.8vw,2.5rem)] font-medium leading-[1.25] tracking-[-0.02em]">
                        {placeholder ? <span className="text-muted">{t.quote}</span> : <>&ldquo;{t.quote}&rdquo;</>}
                      </blockquote>
                      <figcaption className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-accent font-display font-bold text-accent-contrast">
                            {placeholder ? "?" : t.name[0]}
                          </span>
                          <div>
                            <p className="font-semibold">{t.name}</p>
                            <p className="text-sm text-muted">{t.role}</p>
                          </div>
                        </div>
                        {placeholder ? (
                          <p className="font-mono text-xs text-muted">Placeholder: add a real quote in /data/skills.ts</p>
                        ) : (
                          t.sample && (
                            <span className="rounded-full border border-border px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">
                              Sample
                            </span>
                          )
                        )}
                      </figcaption>
                    </figure>
                  </div>
                );
              })}
            </m.div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-6">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  aria-current={i === index}
                  className="group flex h-11 items-center px-0.5 sm:px-1"
                >
                  <span className="relative block h-1 w-6 overflow-hidden sm:w-10 rounded-full bg-border">
                    {i === index && (
                      <m.span
                        key={`${index}-${paused || dragging}`}
                        className="absolute inset-0 origin-left rounded-full bg-accent"
                        initial={{ scaleX: reduce || paused || dragging ? 1 : 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: reduce || paused || dragging ? 0 : INTERVAL / 1000, ease: "linear" }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous testimonial"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border transition-colors hover:border-text"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next testimonial"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border transition-colors hover:border-text"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
