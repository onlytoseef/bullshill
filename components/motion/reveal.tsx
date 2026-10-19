"use client";

import { motion } from "motion/react";
import { useRef, type ReactNode } from "react";

import { EASE_OUT } from "@/lib/motion";

import { useIntroReady } from "./use-intro-ready";
import { useScrollReplay } from "./use-scroll-replay";

const SHOWN = { opacity: 1, y: 0, x: 0 };

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  duration?: number;
  trigger?: "inView" | "mount";
  className?: string;
};

type InnerProps = Omit<RevealProps, "trigger">;

/**
 * Waits for the page loader before playing the first time, then replays like
 * any other entrance whenever it comes back into view.
 *
 * The loader lives in the root layout, so a hard load of *any* page covers the
 * viewport until ~1.7s — long enough for an ungated mount animation to finish
 * before anyone could see it.
 */
function RevealOnMount({
  children,
  delay = 0,
  y = 24,
  x = 0,
  duration = 0.6,
  className,
}: InnerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useIntroReady();
  const visible = useScrollReplay(ref, { enabled: ready });
  const hidden = { opacity: 0, y, x };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={visible ? SHOWN : hidden}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/** Plays every time it scrolls into view, from above or below. */
function RevealInView({
  children,
  delay = 0,
  y = 24,
  x = 0,
  duration = 0.6,
  className,
}: InnerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useScrollReplay(ref);
  const hidden = { opacity: 0, y, x };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={visible ? SHOWN : hidden}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Split into two components rather than branching inside one so that only the
 * mount variant subscribes to the intro latch — there are dozens of in-view
 * Reveals on a page and none of them need it.
 */
export function Reveal({ trigger = "inView", ...props }: RevealProps) {
  return trigger === "mount" ? (
    <RevealOnMount {...props} />
  ) : (
    <RevealInView {...props} />
  );
}
