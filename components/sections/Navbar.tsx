"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { navLinks, site } from "@/data/site";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { lockScroll } from "@/lib/scroll";
import { cn } from "@/lib/utils";

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * Sticky, blurred navbar. GSAP reads the scroll direction; Motion animates
 * the show/hide. On mobile, a full-screen menu with staggered links.
 */
export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        setScrolled(y > 24);
        setHidden(self.direction === 1 && y > 160);
      },
    });
    return () => st.kill();
  });

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const button = menuButton.current;
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[110] -translate-y-24 rounded-full bg-accent px-5 py-3 font-semibold text-accent-contrast focus:translate-y-0"
      >
        Skip to content
      </a>

      <m.header
        className="fixed inset-x-0 top-0 z-[70]"
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={cn(
            "border-b transition-[background-color,border-color] duration-500",
            scrolled || open ? "border-border/70 bg-bg/70 backdrop-blur-xl" : "border-transparent",
          )}
        >
          <nav aria-label="Main" className="container-page flex h-[var(--nav-h)] items-center justify-between gap-6">
            <TransitionLink
              href="/"
              className="relative z-[2] font-display text-xl font-extrabold tracking-[-0.04em]"
              aria-label={`${site.name}, home`}
              onClick={() => setOpen(false)}
            >
              {site.wordmark.slice(0, -1)}
              <span className="text-accent-ink">.</span>
            </TransitionLink>

            <ul className="hidden items-center gap-1 lg:flex">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <TransitionLink
                    href={l.href}
                    className="group relative block rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-text"
                  >
                    {l.label}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
                    />
                  </TransitionLink>
                </li>
              ))}
            </ul>

            <div className="relative z-[2] flex items-center gap-2">
              <ThemeToggle />
              <MagneticButton href="/#contact" wrapperClassName="hidden sm:inline-block" className="min-h-11 px-5 py-2 text-sm">
                Get in touch
              </MagneticButton>
              <button
                ref={menuButton}
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border lg:hidden"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((o) => !o)}
              >
                {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
              </button>
            </div>
          </nav>
        </div>
      </m.header>

      <AnimatePresence>
        {open && <MobileMenu onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const first = useRef<HTMLAnchorElement>(null);
  useEffect(() => first.current?.focus(), []);

  return (
    <m.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[65] flex flex-col bg-bg px-[var(--gutter)] pb-10 pt-[calc(var(--nav-h)+2rem)] lg:hidden"
      initial={{ y: "-100%" }}
      animate={{ y: "0%" }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.6, ease }}
    >
      <m.ul
        className="flex flex-1 flex-col justify-center gap-2"
        initial="closed"
        animate="open"
        exit="closed"
        variants={{
          open: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
          closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
        }}
      >
        {[...navLinks, { label: "Get in touch", href: "/#contact" }].map((l, i) => (
          <li key={l.label} className="overflow-hidden">
            <m.div
              variants={{ open: { y: "0%", opacity: 1 }, closed: { y: "100%", opacity: 0 } }}
              transition={{ duration: 0.6, ease }}
            >
              <TransitionLink
                ref={i === 0 ? first : undefined}
                href={l.href}
                onClick={onClose}
                className="flex items-baseline gap-4 py-1 font-display text-[clamp(2.5rem,10vw,4rem)] font-extrabold leading-tight tracking-[-0.04em]"
              >
                <span className="font-mono text-sm font-normal tracking-normal text-accent-ink">0{i + 1}</span>
                {l.label}
              </TransitionLink>
            </m.div>
          </li>
        ))}
      </m.ul>
      <m.div
        className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.6 } }}
        exit={{ opacity: 0 }}
      >
        <p className="text-sm text-muted">{site.location}</p>
        <ul className="flex gap-2">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border"
              >
                <SocialIcon name={s.icon} />
              </a>
            </li>
          ))}
        </ul>
      </m.div>
    </m.div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <m.button
      type="button"
      whileTap={{ scale: 0.9, rotate: 30 }}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-text"
      aria-label="Toggle light and dark theme"
    >
      <Sun size={18} className="hidden dark:block" aria-hidden="true" />
      <Moon size={18} className="dark:hidden" aria-hidden="true" />
    </m.button>
  );
}
