"use client";

import { ArrowUp, ArrowUpRight } from "lucide-react";
import { m } from "motion/react";
import { useRef } from "react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { isPlaceholder, navLinks, site } from "@/data/site";
import { gsap, MQ } from "@/lib/gsap";
import { useDeferredGSAP } from "@/lib/gsap-queue";
import { scrollToTarget } from "@/lib/scroll";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();

  useDeferredGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Huge wordmark: letters rise out of a mask as the footer scrolls in.
        gsap.fromTo(
          ".footer-letter",
          { yPercent: 140 },
          {
            yPercent: 0,
            ease: "none",
            stagger: 0.06,
            scrollTrigger: { trigger: ".footer-wordmark", start: "top bottom", end: "bottom bottom", scrub: 0.6 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-border pt-20">
      <div className="container-page">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="text-label text-muted">Have a project in mind?</p>
            <TransitionLink href="/#contact" className="group mt-4 inline-flex items-center gap-3 text-h2">
              Let&apos;s talk
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-contrast transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={22} aria-hidden="true" />
              </span>
            </TransitionLink>
            {!isPlaceholder(site.email) && (
              <p className="mt-4">
                <a href={`mailto:${site.email}`} className="text-muted hover:text-text">
                  {site.email}
                </a>
              </p>
            )}
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="text-label text-muted">Navigate</p>
            <ul className="mt-4 space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <TransitionLink href={l.href} className="inline-block py-1 hover:text-accent-ink">
                    {l.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="text-label text-muted">Elsewhere</p>
            <ul className="mt-4 space-y-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 py-1 hover:text-accent-ink">
                    <SocialIcon name={s.icon} width={18} height={18} />
                    {s.label}
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-wordmark mt-16 select-none overflow-hidden" aria-hidden="true">
        <p className="flex justify-center font-display text-[clamp(4rem,21.5vw,22rem)] font-extrabold leading-[0.8] tracking-[-0.06em] pb-[0.06em] pt-[0.16em]">
          {site.wordmark.split("").map((ch, i) => (
            <span key={i} className={`footer-letter inline-block ${ch === "." ? "text-accent-ink" : ""}`}>
              {ch}
            </span>
          ))}
        </p>
      </div>

      <div className="container-page flex flex-wrap items-center justify-between gap-4 border-t border-border py-6 text-sm text-muted">
        <p>
          © {year} {site.name} · {site.agency}
        </p>
        <p className="hidden sm:block">Designed &amp; built in {site.location}</p>
        <m.button
          type="button"
          onClick={() => scrollToTarget(0)}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-4 text-text transition-colors hover:border-text"
          aria-label="Back to top"
        >
          Top <ArrowUp size={16} aria-hidden="true" />
        </m.button>
      </div>
    </footer>
  );
}
