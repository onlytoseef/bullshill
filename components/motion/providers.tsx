"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

import { SmoothScroll } from "./smooth-scroll";

/**
 * Global motion setup, kept in one client component so the root layout can stay
 * a Server Component.
 *
 * `reducedMotion="user"` makes every Motion animation in the tree respect the
 * OS preference: transforms are dropped, opacity still animates, so content
 * appears without anything flying around. GSAP opts in separately via
 * gsap.matchMedia(); plain CSS is covered by a media query in globals.css.
 */
export function MotionProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>{children}</SmoothScroll>
    </MotionConfig>
  );
}
