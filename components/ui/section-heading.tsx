"use client";

import { motion } from "motion/react";
import { useRef, type ReactNode } from "react";

import { useScrollReplay } from "@/components/motion/use-scroll-replay";
import { HEADING_CONTAINER, HEADING_ITEM } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The parts animate in place rather than each being wrapped in <Reveal>.
 *
 * The design CSS reaches the eyebrow through direct-child selectors
 * (`.services-section-heading > span`, and `> span > span` to hide the dot), so
 * an extra wrapper div would quietly drop the pill styling. Animating the real
 * elements keeps the DOM identical to what that CSS expects.
 *
 * Replays every time the heading comes back into view.
 */

type Props = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  /**
   * `false` renders the heading at rest, for sections that animate it with
   * GSAP — otherwise the two libraries fight over the same opacity and
   * transform.
   */
  reveal?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  reveal = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useScrollReplay(ref, { enabled: reveal });
  const centered = align === "center";
  const item = reveal ? HEADING_ITEM : undefined;

  return (
    <motion.div
      ref={ref}
      className={cn(
        "flex flex-col gap-4",
        centered && "items-center text-center",
        className,
      )}
      {...(reveal
        ? {
            variants: HEADING_CONTAINER,
            initial: "hidden",
            animate: visible ? "show" : "hidden",
          }
        : {})}
    >
      {eyebrow ? (
        <motion.span
          variants={item}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-1.5",
            "border border-surface-border bg-surface-card/60",
            "text-xs font-medium tracking-wide text-blue-light-active uppercase",
          )}
        >
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-orange"
          />
          {eyebrow}
        </motion.span>
      ) : null}

      <motion.h2
        variants={item}
        className="text-display-sm font-semibold text-white sm:text-display-md lg:text-display-lg"
      >
        {title}
      </motion.h2>

      {subtitle ? (
        <motion.p
          variants={item}
          className={cn(
            "max-w-2xl text-base text-blue-light-active",
            centered && "mx-auto",
          )}
        >
          {subtitle}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
