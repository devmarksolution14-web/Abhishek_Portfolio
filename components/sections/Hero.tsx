"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { m } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SplitText } from "@/components/ui/SplitText";
import { site } from "@/data/site";
import { useAppReady } from "@/lib/app-ready";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const chips = [
  { label: "USA counsellor", className: "left-[-6%] top-[12%] sm:left-[-14%]", float: 10, duration: 5.5 },
  { label: "Digital marketer", className: "left-[-4%] bottom-[22%] sm:left-[-18%]", float: 9, duration: 7 },
  { label: "Graphic designer", className: "right-[0%] bottom-[6%] sm:right-[-8%]", float: 11, duration: 6 },
];

/** Splits the tagline so the accent word gets its own coloured span. */
function Tagline() {
  const parts = site.tagline.split(new RegExp(`(\\b${site.accentWord}\\b)`));
  return (
    <>
      {parts.map((p, i) =>
        p === site.accentWord ? (
          <span key={i} className="text-accent-ink">
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function Hero({ hasPhoto }: { hasPhoto: boolean }) {
  const root = useRef<HTMLElement>(null);
  const ready = useAppReady();

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap
          .timeline({ delay: 0.35 })
          .fromTo(".hero-photo", { autoAlpha: 0, yPercent: 8, scale: 0.94 }, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 1.4, ease: "expo.out" }, 0)
          .fromTo(".hero-fade", { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 1 }, 0.35);

        // Photo parallax while scrolling out of the hero.
        gsap.to(".hero-parallax", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });

      mm.add(MQ.reduce, () => {
        gsap.fromTo(".hero-photo, .hero-fade", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 });
      });
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-[calc(var(--nav-h)+2rem)]"
    >
      <div className="container-page grid flex-1 items-center gap-14 pb-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p data-reveal="hero" className="hero-fade mb-7 inline-flex items-center gap-3 rounded-full border border-border px-4 py-2 text-label text-muted">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Based in {site.location} · {site.agency}
          </p>

          <SplitText as="h1" id="hero-title" trigger="mount" play={ready} delay={0.2} stagger={0.07} reveal="hero" className="text-hero text-balance">
            <Tagline />
          </SplitText>

          <p data-reveal="hero" className="hero-fade text-lead mt-8 max-w-[34rem] text-muted">
            {site.intro}
          </p>

          <div data-reveal="hero" className="hero-fade mt-10 flex flex-wrap items-center gap-3">
            <MagneticButton href="/#work">
              See my work <ArrowDownRight size={18} aria-hidden="true" />
            </MagneticButton>
            <MagneticButton href="/#contact" variant="outline">
              Let&apos;s talk <ArrowUpRight size={18} aria-hidden="true" />
            </MagneticButton>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:col-span-5 lg:max-w-none lg:pl-10">
          <div data-reveal="hero" className="hero-photo relative">
            <div className="arch relative aspect-[4/5] overflow-hidden border border-border bg-surface">
              <div className="hero-parallax absolute inset-x-0 -top-[8%] h-[116%]">
                {hasPhoto ? (
                  <Image
                    src={site.photo}
                    alt={`Portrait of ${site.name}`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 420px, (min-width: 640px) 26rem, 22rem"
                    className="object-cover"
                  />
                ) : (
                  <PhotoPlaceholder />
                )}
              </div>
            </div>
            {/* Decorative ring offset behind the arch */}
            <div aria-hidden="true" className="arch absolute -inset-3 -z-10 border border-dashed border-border" />

            {chips.map((chip, i) => (
              <m.div
                key={chip.label}
                className={cn("absolute z-10", chip.className)}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={ready ? { opacity: 1, scale: 1 } : undefined}
                transition={{ delay: 1 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <m.span
                  className="block whitespace-nowrap rounded-full border border-border bg-bg/80 px-4 py-2 font-mono text-[0.72rem] text-text shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] backdrop-blur-md sm:text-xs"
                  animate={{ y: [0, -chip.float, 0], rotate: [0, i % 2 ? 1.5 : -1.5, 0] }}
                  transition={{ duration: chip.duration, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" aria-hidden="true" />
                  {chip.label}
                </m.span>
              </m.div>
            ))}
          </div>
        </div>
      </div>

      <div data-reveal="hero" className="hero-fade container-page flex items-end justify-between pb-8">
        <a href="#about" className="group flex items-center gap-3 text-label text-muted" aria-label="Scroll to About section">
          <span className="relative h-10 w-px overflow-hidden bg-border" aria-hidden="true">
            <span className="scroll-cue-line absolute inset-0 bg-accent" />
          </span>
          Scroll
        </a>
        <p className="hidden text-label text-muted sm:block">{site.roles.join(" / ")}</p>
      </div>
    </section>
  );
}

function PhotoPlaceholder() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-surface text-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(var(--border) 1.2px, transparent 1.2px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div aria-hidden="true" className="absolute -bottom-1/4 left-1/2 h-3/4 w-[130%] -translate-x-1/2 rounded-t-full bg-accent/90" />
      <span aria-hidden="true" className="relative font-display text-[9rem] font-extrabold leading-none tracking-[-0.06em] text-text">
        {site.name[0]}
      </span>
      <span role="img" aria-label={`Photo of ${site.name} coming soon`} className="relative rounded-full bg-bg px-3 py-1 font-mono text-[0.7rem] text-muted">
        [Your photo] /public/images/profile.jpg
      </span>
    </div>
  );
}
