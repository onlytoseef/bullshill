"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { process } from "@/lib/content";

/**
 * Convert a viewport coordinate into the SVG's normalized viewBox space.
 */
function toSvgPoint(
  point: { x: number; y: number },
  bounds: DOMRect,
) {
  return {
    x: ((point.x - bounds.left) / bounds.width) * 100,
    y: ((point.y - bounds.top) / bounds.height) * 100,
  };
}

function connector(first: DOMRect, second: DOMRect, svgBounds: DOMRect) {
  const movesRight = second.left >= first.left;
  const from = toSvgPoint(
    {
      x: movesRight ? first.right : first.left,
      y: first.top + first.height * 0.56,
    },
    svgBounds,
  );
  const to = toSvgPoint(
    {
      x: movesRight ? second.left : second.right,
      y: second.top + second.height * 0.44,
    },
    svgBounds,
  );
  const bend = Math.max(Math.abs(to.x - from.x) * 0.55, 8);
  const direction = movesRight ? 1 : -1;

  return `M ${from.x} ${from.y} C ${from.x + bend * direction} ${from.y}, ${to.x - bend * direction} ${to.y}, ${to.x} ${to.y}`;
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
      const cards = gsap.utils.toArray<HTMLElement>("[data-process-card]");
      if (paths.length === 0 || cards.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const rotations = [-15, 5.85, -5.39, 5.67, -6.58];
          const svgBounds = svgRef.current?.getBoundingClientRect();

          if (!svgBounds) return;

          cards.slice(0, -1).forEach((card, index) => {
            const nextCard = cards[index + 1];
            paths[index].setAttribute(
              "d",
              connector(card.getBoundingClientRect(), nextCard.getBoundingClientRect(), svgBounds),
            );
          });

          cards.forEach((card, index) => {
            gsap.set(card, {
              opacity: index === 0 ? 1 : 0,
              rotation: rotations[index] ?? 0,
              scale: index === 0 ? 1 : 0.92,
              y: index === 0 ? 0 : 24,
            });
          });
          gsap.set(tracks, { opacity: 0 });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: svgRef.current,
              start: "top 75%",
              end: "bottom 85%",
              scrub: 0.5,
            },
          });

          paths.forEach((path, index) => {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
            timeline.to(path, { strokeDashoffset: 0, ease: "none" });
            timeline.to(
              cards[index + 1],
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.45,
                ease: "power2.out",
              },
              ">-0.08",
            );
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
      className="connector-layer pointer-events-none absolute inset-0 z-[1] hidden size-full lg:block"
    >
      {process.steps.slice(0, -1).map((step, index) => (
        <path
          key={step.title}
          data-connector
          fill="none"
          stroke="#E8750A"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.72"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
