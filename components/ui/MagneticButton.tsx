"use client";

import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

type Common = {
  children: ReactNode;
  variant?: Variant;
  /** How strongly the button follows the cursor (0–1). */
  strength?: number;
  className?: string;
  wrapperClassName?: string;
};
type AsLink = Common & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href" | "children" | "className">;
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<"button">, "children" | "className">;
export type MagneticButtonProps = AsLink | AsButton;

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-contrast hover:shadow-[0_10px_40px_-10px_var(--accent)]",
  outline: "border border-border text-text hover:border-text",
  ghost: "text-text hover:bg-surface",
};

export const buttonClasses = (variant: Variant = "primary", className?: string) =>
  cn(
    "relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3 text-[0.95rem] font-semibold transition-[box-shadow,border-color,background-color,opacity] duration-300 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    className,
  );

/**
 * Pill button that pulls toward the cursor on hover (Motion springs).
 * Renders a page-transition link, an external <a>, or a <button>.
 */
export function MagneticButton(props: MagneticButtonProps) {
  const { children, variant = "primary", strength = 0.35, className, wrapperClassName, ...rest } = props;
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 15, mass: 0.4 });
  // The label moves a little further than the pill for a sense of depth.
  const lx = useTransform(sx, (v) => v * 0.35);
  const ly = useTransform(sy, (v) => v * 0.35);

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <m.span className="relative z-10 inline-flex items-center gap-2" style={{ x: lx, y: ly }}>
      {children}
    </m.span>
  );
  const classes = buttonClasses(variant, className);

  let el: ReactNode;
  if (rest.href !== undefined) {
    const { href, external, ...anchorProps } = rest as Omit<AsLink, keyof Common>;
    el =
      external || /^(https?:|mailto:|tel:)/.test(href) ? (
        <a href={href} className={classes} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} {...anchorProps}>
          {inner}
        </a>
      ) : (
        <TransitionLink href={href} className={classes} {...anchorProps}>
          {inner}
        </TransitionLink>
      );
  } else {
    const { type = "button", ...buttonProps } = rest as Omit<AsButton, keyof Common>;
    el = (
      <button type={type} className={classes} {...buttonProps}>
        {inner}
      </button>
    );
  }

  return (
    <m.div
      className={cn("inline-block", wrapperClassName)}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.96 }}
    >
      {el}
    </m.div>
  );
}
