"use client";

import { motion, useInView, type Variants } from "motion/react";
import { Children, useRef, type ReactNode } from "react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

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
  const isInView = useInView(ref, { margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      custom={stagger}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
    >
      {Children.map(children, (child) => (
        <motion.div className={itemClassName} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
