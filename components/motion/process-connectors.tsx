"use client";

import { useRef } from "react";

import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { process } from "@/lib/content";

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

export function ProcessConnectors() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const flow = svgRef.current?.parentElement;
      if (!flow) return;

      const paths = gsap.utils.toArray<SVGPathElement>(
        flow.querySelectorAll("[data-connector]"),
      );
      const cards = gsap.utils.toArray<HTMLElement>(
        flow.querySelectorAll("[data-process-card]"),
      );
      if (paths.length !== cards.length - 1) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            reduceMotion: boolean;
          };

          if (!isDesktop) return;

          const rotations = [-15, 5.85, -5.39, 5.67, -6.58];
          // Re-measures card/line geometry. Needed on top of the initial run because
          // layout shifts after mount (web fonts swapping in, window resize) would
          // otherwise leave the connector lines pointing at stale card positions —
          // `refreshInit` lets us reset before ScrollTrigger recalculates.
          function layout() {
            // Neutralize any scale/translate left over from a previous run (or from
            // mid-scroll scrub progress) before measuring — otherwise a shrunk,
            // shifted card box gets baked into the line coordinates below.
            gsap.set(cards, { scale: 1, y: 0 });

            const svgBounds = svgRef.current!.getBoundingClientRect();

            cards.slice(0, -1).forEach((card, index) => {
              const nextCard = cards[index + 1];
              paths[index].setAttribute(
                "d",
                connector(card.getBoundingClientRect(), nextCard.getBoundingClientRect(), svgBounds),
              );
            });

            cards.forEach((card, index) => {
              const revealed = reduceMotion || index === 0;
              gsap.set(card, {
                opacity: revealed ? 1 : 0,
                rotation: rotations[index] ?? 0,
                scale: revealed ? 1 : 0.92,
                y: revealed ? 0 : 24,
              });
            });

            paths.forEach((path) => {
              const length = path.getTotalLength();
              gsap.set(path, {
                strokeDasharray: length,
                // With reduced motion we skip the scroll-driven draw entirely, so
                // the lines need to render fully visible right away.
                strokeDashoffset: reduceMotion ? 0 : length,
              });
            });
          }

          layout();
          ScrollTrigger.addEventListener("refreshInit", layout);

          const cleanup = () =>
            ScrollTrigger.removeEventListener("refreshInit", layout);

          if (reduceMotion) return cleanup;

          const header = document.querySelector<HTMLElement>(".site-header");
          const headerOffset = (header?.offsetHeight ?? 88) + 16;

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: flow,
              start: `top top+=${headerOffset}`,
              end: "+=120%",
              scrub: 0.5,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          paths.forEach((path, index) => {
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

          return cleanup;
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
      {process.steps.slice(0, -1).map((step) => (
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
