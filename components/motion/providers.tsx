"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

import { SmoothScroll } from "./smooth-scroll";

export function MotionProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>{children}</SmoothScroll>
    </MotionConfig>
  );
}
