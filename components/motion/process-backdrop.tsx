"use client";

import { useRef, type CSSProperties } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

/**
 * How many specks. Sparse on purpose — the brief is "barely there", and the
 * mobile rule below hides the second half again.
 */
const PARTICLES = 24;

/**
 * Deterministic placement. A `Math.random()` layout would differ between the
 * server render and hydration, so the offsets come from the index instead —
 * still scattered, but stable across both renders.
 */
function particleStyle(index: number): CSSProperties {
  const x = (index * 47) % 100;
  const y = (index * 83) % 100;
  const size = index % 4 === 0 ? 3 : 2;
  const duration = 12 + ((index * 7) % 9);
  // Negative delays start the specks mid-cycle, so they never drift in lockstep.
  const delay = -((index * 3) % 14);
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  };
}

/**
 * The process section's backdrop: a barely-visible perspective grid with a few
 * drifting specks and a faint brand-orange glow, all sitting behind the cards.
 *
 * CSS does the drawing and the particle drift, so nothing repaints per frame;
 * GSAP only eases two scrubbed values — the layer's drift and the glow's
 * intensity — as the section passes through the viewport. It is decorative in
 * every sense (`aria-hidden`, `pointer-events: none`) and never touches the
 * cards or the connector lines, which stay in the content layer above it.
 *
 * `prefers-reduced-motion` leaves the grid and specks in place, unanimated.
 */
export function ProcessBackdrop({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useGSAP(
    // useGSAP wraps this in a context, so the tweens and their triggers are
    // reverted on unmount without any manual teardown.
    () => {
      const host = hostRef.current;
      if (!host) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const drift = host.querySelector(".process-backdrop-drift");
      const glow = host.querySelector(".process-backdrop-glow");

      if (drift) {
        gsap.fromTo(
          drift,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: host,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      if (glow) {
        gsap.fromTo(
          glow,
          { opacity: 0.5 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: host,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    },
    { scope: hostRef },
  );

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={className ? `process-backdrop ${className}` : "process-backdrop"}
    >
      <div className="process-backdrop-drift">
        <div className="process-backdrop-grid" />
        {Array.from({ length: PARTICLES }, (_, index) => (
          <span
            key={index}
            className="process-backdrop-particle"
            style={particleStyle(index)}
          />
        ))}
      </div>
      <div className="process-backdrop-glow" />
    </div>
  );
}
