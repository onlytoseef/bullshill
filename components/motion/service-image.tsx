"use client";

import { motion } from "motion/react";
import { useRef, type ReactNode } from "react";

import { EASE_OUT } from "@/lib/motion";

import { useScrollReplay } from "./use-scroll-replay";

const HIDDEN = { opacity: 0, y: 16, scale: 0.92 };
const SHOWN = { opacity: 1, y: 0, scale: 1 };

type Props = {
  children: ReactNode;
};

/**
 * Entrance only, replayed every time it comes back into view. The hover lives
 * in CSS on `.services-image img` — it used to be a `whileHover` here, which
 * animated `scale` on the same element as the entrance, so hovering during the
 * entrance made the two fight.
 */
export function ServiceImage({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useScrollReplay(ref);

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0"
      initial={HIDDEN}
      animate={visible ? SHOWN : HIDDEN}
      transition={{
        opacity: { duration: 0.55, ease: EASE_OUT },
        y: { duration: 0.65, ease: EASE_OUT },
        scale: { duration: 0.7, ease: EASE_OUT },
      }}
    >
      {children}
    </motion.div>
  );
}
