"use client";

import { useRef, type ReactNode } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  /** Percentage of its own height the element drifts upward across the scroll. */
  amount?: number;
  className?: string;
};

/**
 * Drifts its children as the section scrolls past.
 *
 * Desktop only — scrubbed parallax forces a paint on every scroll frame, which
 * is the first thing to drop frames on a phone. Below 768px, and under reduced
 * motion, the content just sits still.
 */
export function Parallax({ children, amount = 12, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.to(ref.current, {
            yPercent: -amount,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
