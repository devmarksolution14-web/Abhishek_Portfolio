"use client";

import { AnimatePresence, m } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { site } from "@/data/site";
import { markNavigated } from "@/lib/navigation";
import { prefersReducedMotion } from "@/lib/utils";

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * Route transitions: a curtain slides up to cover the page, the route
 * changes underneath, then the curtain slides away (AnimatePresence exit).
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = useState<string | null>(null);
  const [prevPath, setPrevPath] = useState(pathname);

  // Route changed: lift the curtain (adjusting state during render, not in an effect).
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setPending(null);
  }

  const navigate = useCallback(
    (href: string) => {
      markNavigated();
      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }
      setPending((p) => p ?? href);
    },
    [router],
  );

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {pending && (
          <m.div
            key="curtain"
            aria-hidden="true"
            className="pointer-events-auto fixed inset-0 z-[90]"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease }}
            onAnimationComplete={(def) => {
              // Only push once the cover animation (not the exit) has finished.
              if (pending && (def as { y?: string }).y === "0%") router.push(pending);
            }}
          >
            <div className="absolute inset-x-0 top-0 h-full bg-accent" />
            <m.div
              className="absolute inset-0 flex items-center justify-center bg-bg"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "0%" }}
              transition={{ duration: 0.7, ease, delay: 0.08 }}
            >
              <span className="text-display text-text">{site.wordmark}</span>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
