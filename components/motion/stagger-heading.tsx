"use client";

import { motion } from "motion/react";
import { useRef } from "react";

import { HEADING_CONTAINER, HEADING_ITEM } from "@/lib/motion";

import { useScrollReplay } from "./use-scroll-replay";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Wrapper classes, e.g. `"testimonials-heading mb-16"`. */
  className?: string;
  /** Eyebrow pill classes, e.g. `"testimonials-eyebrow"`. */
  eyebrowClassName?: string;
};

/**
 * The eyebrow/title/subtitle heading that testimonials, blog and awards each
 * hand-rolled identically, now animated in one place — and replayed every time
 * it comes back into view.
 *
 * Animates the real elements rather than wrapping them, so the rendered DOM
 * stays `div > span + h2 + p` — which is what the per-section CSS
 * (`.testimonials-heading h2`, `.awards-heading p`, …) is written against.
 */
export function StaggerHeading({
  eyebrow,
  title,
  subtitle,
  className,
  eyebrowClassName,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useScrollReplay(ref);

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={HEADING_CONTAINER}
      initial="hidden"
      animate={visible ? "show" : "hidden"}
    >
      <motion.span variants={HEADING_ITEM} className={eyebrowClassName}>
        {eyebrow}
      </motion.span>
      <motion.h2 variants={HEADING_ITEM}>{title}</motion.h2>
      {subtitle ? (
        <motion.p variants={HEADING_ITEM}>{subtitle}</motion.p>
      ) : null}
    </motion.div>
  );
}
