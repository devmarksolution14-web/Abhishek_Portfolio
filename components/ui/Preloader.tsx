"use client";

import { useRef } from "react";
import { site } from "@/data/site";
import { markAppReady } from "@/lib/app-ready";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { lockScroll } from "@/lib/scroll";

const SESSION_KEY = "preloader-seen";

/**
 * 0 → 100% counter + name, then a two-layer curtain wipe reveals the page.
 * Shown once per browser session. The inline script in app/layout.tsx adds
 * html[data-preloaded] before first paint on repeat visits, which hides this
 * with CSS so it never flashes.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (html.hasAttribute("data-preloaded")) {
        markAppReady();
        return;
      }

      lockScroll(true);
      const finish = () => {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}
        html.setAttribute("data-preloaded", "");
        lockScroll(false);
      };

      const mm = gsap.matchMedia();
      const progress = { v: 0 };
      const render = () => {
        if (count.current) count.current.textContent = String(Math.round(progress.v));
      };

      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ onComplete: finish });
        tl.from(".pl-letter", { yPercent: 110, stagger: 0.05, duration: 0.9, ease: "power4.out" })
          .from(".pl-meta", { autoAlpha: 0, y: 12, duration: 0.6 }, 0.2)
          .to(progress, { v: 100, duration: 1.7, ease: "power2.inOut", onUpdate: render }, 0)
          .to(".pl-bar", { scaleX: 1, duration: 1.7, ease: "power2.inOut" }, 0)
          .to(".pl-letter", { yPercent: -110, stagger: 0.03, duration: 0.55, ease: "power3.in" }, "+=0.15")
          .to(".pl-meta, .pl-count", { autoAlpha: 0, duration: 0.35 }, "<")
          // From here the page is being revealed: let clicks (and hit-testing) through.
          .set(root.current, { pointerEvents: "none" })
          .to(".pl-panel", { yPercent: -100, duration: 0.95, ease: "power4.inOut" })
          .to(".pl-accent", { yPercent: -100, duration: 0.95, ease: "power4.inOut" }, "<0.1")
          .add(markAppReady, "-=0.55");
      });

      // Reduced motion: quick count, then a simple fade.
      mm.add(MQ.reduce, () => {
        gsap
          .timeline({ onComplete: finish })
          .to(progress, { v: 100, duration: 0.6, ease: "none", onUpdate: render })
          .to(root.current, { autoAlpha: 0, duration: 0.4 })
          .add(markAppReady, "<");
      });

      return () => {
        // Unmounted mid-way (e.g. fast refresh): never leave the page locked.
        if (!html.hasAttribute("data-preloaded")) {
          lockScroll(false);
          markAppReady();
        }
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="preloader pointer-events-auto fixed inset-0 z-[100]" aria-hidden="true">
      <div className="pl-accent absolute inset-0 bg-accent" />
      <div className="pl-panel absolute inset-0 flex flex-col justify-between bg-bg p-[var(--gutter)]">
        <div className="pl-meta flex justify-between text-label text-muted">
          <span>{site.agency}</span>
          <span>{site.location}</span>
        </div>

        <div>
          <p className="text-hero overflow-hidden leading-none text-text" style={{ fontSize: "clamp(3.5rem, 2rem + 9vw, 10rem)" }}>
            {site.name.split("").map((ch, i) => (
              <span key={i} className="pl-letter inline-block">
                {ch}
              </span>
            ))}
            <span className="pl-letter inline-block text-accent-ink">.</span>
          </p>
          <div className="mt-6 flex items-end justify-between gap-6">
            <p className="pl-meta max-w-xs text-sm text-muted">{site.roles.join(" · ")}</p>
            <p className="pl-count font-mono text-5xl font-medium tabular-nums text-text sm:text-7xl">
              <span ref={count}>0</span>
              <span className="text-accent-ink">%</span>
            </p>
          </div>
          <div className="mt-6 h-px w-full bg-border">
            <div className="pl-bar h-full w-full origin-left scale-x-0 bg-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}
