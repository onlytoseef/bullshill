"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  duration?: number;
  trigger?: "inView" | "mount";
  className?: string;
};

export function Reveal({
  children,
  delay = 0,
  y = 24,
  x = 0,
  duration = 0.6,
  trigger = "inView",
  className,
}: RevealProps) {
  const shown = { opacity: 1, y: 0, x: 0 };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      {...(trigger === "mount"
        ? { animate: shown }
        : {
            whileInView: shown,
            viewport: { once: true, margin: "-10% 0px" },
          })}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
