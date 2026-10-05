"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { usePageTransition } from "@/components/providers/TransitionProvider";
import { scrollToTarget } from "@/lib/scroll";

type Props = ComponentProps<typeof Link> & { href: string };

/**
 * Internal link that plays the page-transition curtain, and smooth-scrolls
 * (via Lenis) for "/#section" links when already on that page.
 */
export function TransitionLink({ href, onClick, ...props }: Props) {
  const pathname = usePathname();
  const { navigate } = usePageTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const [path, hash] = href.split("#");
    const targetPath = path || pathname;

    if (targetPath === pathname) {
      e.preventDefault();
      if (hash) {
        scrollToTarget(`#${hash}`);
        document.getElementById(hash)?.focus({ preventScroll: true });
      } else scrollToTarget(0);
      return;
    }
    e.preventDefault();
    navigate(href);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
