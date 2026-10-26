"use client";

import { motion, type Variants } from "motion/react";
import { Children, useRef, type ReactNode } from "react";

import { EASE_OUT } from "@/lib/motion";

import { useScrollReplay } from "./use-scroll-replay";

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
  stagger?: number;
  className?: string;
  itemClassName?: string;
};

export function Stagger({
  children,
  stagger = 0.08,
  className,
  itemClassName,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Replays every time the grid comes back into view. It only re-hides once it
  // is fully off screen, so it never visibly fades out at the edge on the way.
  const visible = useScrollReplay(ref);

  return (
    <motion.div
      ref={ref}
      className={className}
      custom={stagger}
      variants={container}
      initial="hidden"
      animate={visible ? "show" : "hidden"}
    >
      {Children.map(children, (child) => (
        <motion.div className={itemClassName} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
