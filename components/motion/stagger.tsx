"use client";

import { motion, type Variants } from "motion/react";
import { Children, type ReactNode } from "react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// `stagger` arrives via the `custom` prop so the delay stays configurable
// without defining variants per call site.
const container: Variants = {
  hidden: {},
  show: (stagger: number) => ({
    transition: { staggerChildren: stagger, delayChildren: 0.05 },
  }),
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

type StaggerProps = {
  children: ReactNode;
  /** Seconds between each child starting. */
  stagger?: number;
  /** Layout classes for the container — put your `grid`/`flex` here. */
  className?: string;
  /** Classes applied to each generated child wrapper. */
  itemClassName?: string;
};

/**
 * Reveals direct children one after another as the group scrolls into view.
 *
 * Each child gets wrapped in a motion div, so the wrappers — not the children —
 * become the grid/flex items. Put layout classes on `className` and they'll
 * line up as expected.
 */
export function Stagger({
  children,
  stagger = 0.08,
  className,
  itemClassName,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      custom={stagger}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {Children.map(children, (child) => (
        <motion.div className={itemClassName} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
