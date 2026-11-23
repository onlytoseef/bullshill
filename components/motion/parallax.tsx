"use client";

import { useRef, type ReactNode } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { useNearViewport } from "./use-near-viewport";

type Props = {
  children: ReactNode;
  amount?: number;
  className?: string;
};

export function Parallax({ children, amount = 12, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearViewport(ref);

  useGSAP(
    () => {
      if (!near) return;
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
    { scope: ref, dependencies: [near], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
