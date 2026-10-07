"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function PartnerLogoMotion({ children, className }: Props) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const logos = gsap.utils.toArray<HTMLElement>("[data-partner-logo]");
      if (logos.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          logos,
          { opacity: 0, y: 30, scale: 0.85, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container.current,
              start: "top 82%",
              once: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: container },
  );

  return (
    <div ref={container} className={className}>
      {children}
    </div>
  );
}
