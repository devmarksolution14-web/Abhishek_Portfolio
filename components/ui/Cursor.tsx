"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, m, useMotionValue, useSpring, useTransform, useVelocity } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useFinePointer, useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Modes:
 * - default: hidden, the normal system arrow shows
 * - link:    grows into a large inverting lens (mix-blend difference) over links and buttons
 * - button:  shrinks to a dark dot over accent (lime) buttons, so it never tints them
 * - view:    accent disc with "View ↗" over anything marked data-cursor="view"
 * - hidden:  over text fields (native I-beam shows) or outside the window
 */
type Mode = "default" | "link" | "button" | "view" | "hidden";

const SIZE = 96; // px at scale 1
const scales: Record<Mode, number> = { default: 0, link: 64 / SIZE, button: 10 / SIZE, view: 1, hidden: 0 };
const inverting = (mode: Mode) => mode === "link";

/** Desktop pointers only, and off when the visitor prefers reduced motion. */
export function Cursor() {
  const fine = useFinePointer();
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  return fine && !reduce ? <CursorInner /> : null;
}

function CursorInner() {
  const [mode, setMode] = useState<Mode>("hidden");
  const [pressed, setPressed] = useState(false);
  const modeRef = useRef<Mode>("hidden");

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 520, damping: 38, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 520, damping: 38, mass: 0.35 });

  // Squash & stretch along the direction of travel, from the spring's velocity.
  const vx = useVelocity(sx);
  const vy = useVelocity(sy);
  const angle = useTransform(() => (Math.atan2(vy.get(), vx.get()) * 180) / Math.PI);
  const stretch = useTransform(() => {
    if (modeRef.current === "view" || modeRef.current === "button") return 0;
    return Math.min(Math.hypot(vx.get(), vy.get()) / 2600, 0.4);
  });
  const scaleX = useTransform(stretch, (s) => 1 + s);
  const scaleY = useTransform(stretch, (s) => 1 - s * 0.55);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("has-custom-cursor");

    const update = (next: Mode) => {
      modeRef.current = next;
      setMode(next);
    };

    const detect = (t: Element | null) => {
      const custom = t?.closest<HTMLElement>("[data-cursor]");
      const interactive = t?.closest<HTMLElement>("a, button, [role='button'], label, select, summary");
      if (t?.closest("header, #mobile-menu")) update("default"); // navbar uses the native pointer
      else if (custom) update(custom.dataset.cursor as Mode);
      else if (t?.closest("input:not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']")) update("hidden");
      else if (interactive) update(interactive.className.includes("bg-accent") ? "button" : "link");
      else update("default");
    };
    let last: { x: number; y: number } | null = null;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = { x: e.clientX, y: e.clientY };
      x.set(e.clientX);
      y.set(e.clientY);
      detect(e.target as Element | null);
    };
    // Content moves under a still cursor while scrolling: re-check what is beneath it.
    const scroll = () => {
      if (last && modeRef.current !== "hidden") detect(document.elementFromPoint(last.x, last.y));
    };
    const leave = () => update("hidden");
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    html.addEventListener("pointerleave", leave);
    return () => {
      html.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      html.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  return (
    // The blend mode sits on the fixed layer itself: it's the stacking context
    // that gets composited onto the page, so "difference" inverts what's below.
    <div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 z-[95]", inverting(mode) && "mix-blend-difference")}
    >
      <m.div className="absolute left-0 top-0" style={{ x: sx, y: sy }}>
        <m.div style={{ rotate: angle }}>
          <m.div style={{ scaleX, scaleY }}>
            <m.div
              className={cn(
                "rounded-full transition-colors duration-200",
                mode === "view" ? "bg-accent" : mode === "button" ? "bg-accent-contrast" : "bg-white",
              )}
              style={{ width: SIZE, height: SIZE, marginLeft: -SIZE / 2, marginTop: -SIZE / 2 }}
              initial={false}
              animate={{ scale: scales[mode] * (pressed ? 0.78 : 1) }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            />
          </m.div>
        </m.div>

        <AnimatePresence>
          {mode === "view" && (
            <m.span
              key="view"
              className="absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap text-label font-semibold text-accent-contrast"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              View <ArrowUpRight size={14} strokeWidth={2.5} />
            </m.span>
          )}
        </AnimatePresence>
      </m.div>
    </div>
  );
}
