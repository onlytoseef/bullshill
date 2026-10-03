"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { process } from "@/lib/content";

/**
 * Card footprint as a percentage of the flow container. Kept in sync with the
 * `lg:w-[42%]` / `lg:h-[22%]` classes on the cards in `sections/process.tsx` —
 * both read the same step coordinates from `lib/content`, so the curves always
 * land on the cards.
 */
const CARD_W = 42;
const CARD_H = 22;

/**
 * Cubic bezier from the bottom of one card to the top of the next, flattened
 * out horizontally.
 *
 * Anchoring to the edges rather than the centres means a card that grows taller
 * than CARD_H only ever swallows the end of a line — the cards paint above the
 * SVG, so any overshoot is hidden instead of crossing the text.
 */
function connector(a: { x: number; y: number }, b: { x: number; y: number }) {
  const from = { x: a.x + CARD_W / 2, y: a.y + CARD_H };
  const to = { x: b.x + CARD_W / 2, y: b.y };
  const bend = (to.x - from.x) * 0.5;

  return `M ${from.x} ${from.y} C ${from.x + bend} ${from.y}, ${to.x - bend} ${to.y}, ${to.x} ${to.y}`;
}

/**
 * The curved lines joining the process cards, drawn as you scroll.
 *
 * Sits as an absolute overlay behind the cards. The viewBox is a flat 0–100
 * grid with `preserveAspectRatio="none"` so the geometry tracks the container
 * at any width; `vector-effect="non-scaling-stroke"` keeps the stroke an even
 * weight despite that non-uniform scaling.
 *
 * Hidden below `lg`, where the cards stack vertically and connectors would only
 * add noise.
 */
export function ProcessConnectors() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const paths = gsap.utils.toArray<SVGPathElement>("[data-connector]");
      if (paths.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: svgRef.current,
              start: "top 75%",
              end: "bottom 85%",
              scrub: 0.5,
            },
          });

          paths.forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
            // Slight overlap so one line starts before the last finishes.
            timeline.to(path, { strokeDashoffset: 0, ease: "none" }, ">-0.15");
          });
        },
      );

      return () => mm.revert();
    },
    { scope: svgRef },
  );

  return (
    <svg
      ref={svgRef}
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 hidden size-full lg:block"
    >
      {process.steps.slice(0, -1).map((step, index) => (
        <path
          key={step.title}
          data-connector
          d={connector(step, process.steps[index + 1])}
          fill="none"
          stroke="var(--color-orange)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 4"
          opacity="0.45"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
