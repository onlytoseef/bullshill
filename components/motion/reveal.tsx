"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Defined in this module rather than passed as a prop — eases are arrays here,
// but keeping all animation config client-side avoids any chance of trying to
// serialize a function across the server/client boundary.
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait before starting. */
  delay?: number;
  /** Pixels travelled on the way in. */
  y?: number;
  /** Horizontal travel — use opposite signs to make rows alternate. */
  x?: number;
  duration?: number;
  /**
   * `"inView"` waits until scrolled near — right for everything below the fold.
   * `"mount"` plays immediately; use it above the fold, where waiting for an
   * intersection callback shows a blank gap on slow connections.
   */
  trigger?: "inView" | "mount";
  className?: string;
};

/**
 * Fades and lifts its children into view once. Children are passed through
 * untouched, so Server Components stay on the server.
 *
 * Movement is skipped automatically when the user prefers reduced motion —
 * handled globally by <MotionConfig reducedMotion="user"> in the root layout.
 */
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
