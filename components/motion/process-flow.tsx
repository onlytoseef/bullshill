"use client";

import { useRef, type ReactNode } from "react";

import { process } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { replayOnScroll } from "@/lib/scroll-replay";

/**
 * Card tilts, in degrees.
 *
 * NOTE: these are duplicated in `globals.css` under
 * `.process-item:nth-child(N) .process-card`. CSS owns the resting tilt so the
 * cards look right before (and without) JS; GSAP re-declares it so it owns the
 * whole transform while animating, and hands it back on revert. If you change
 * one list, change the other — they are expected to agree.
 */
const CARD_ROTATIONS = [-15, 5.85, -5.39, 5.67, -6.58];

function toSvgPoint(point: { x: number; y: number }, bounds: DOMRect) {
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
 * The process stage: five tilted step cards with connectors drawn between them
 * as you scroll.
 *
 * Owns the stage wrapper rather than just the SVG so `useGSAP`'s scope contains
 * both the connectors and the cards, which is what lets the element lookups be
 * scoped instead of querying the whole document.
 */
export function ProcessFlow({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const stageEl = stage.current;
      const svgEl = svgRef.current;
      if (!stageEl || !svgEl) return;

      const paths = gsap.utils.toArray<SVGPathElement>(
        "[data-connector]",
        stageEl,
      );
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-process-card]",
        stageEl,
      );
      if (paths.length === 0 || cards.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          /**
           * Connector curves are derived from where the cards actually sit, so
           * they have to be recomputed whenever the layout moves.
           *
           * This runs on `onRefreshInit` specifically. ScrollTrigger's refresh
           * order is onRefreshInit → invalidateOnRefresh → onRefresh, so this
           * is the only hook that lands before the tweens re-read their values;
           * from `onRefresh` the draw would be measuring the previous curve.
           *
           * It also covers two things the old one-shot measurement missed: the
           * pin-spacer, which does not exist until the first refresh, and plain
           * window resizes, which never re-ran because matchMedia only fires
           * when the breakpoint itself flips.
           */
          const layout = () => {
            const svgBounds = svgEl.getBoundingClientRect();
            if (!svgBounds.width || !svgBounds.height) return;

            cards.slice(0, -1).forEach((card, index) => {
              paths[index].setAttribute(
                "d",
                connector(
                  card.getBoundingClientRect(),
                  cards[index + 1].getBoundingClientRect(),
                  svgBounds,
                ),
              );
            });
          };

          layout();

          // Pin once the stage's top clears the sticky header, rather than when
          // it is centered: at `center center` the stage is tall enough that its
          // first card sits up under the header, and the connectors only start
          // drawing from there — so the line appeared *behind* the header. From
          // here the cards are in view when the draws run.
          const header = document.querySelector<HTMLElement>(".site-header");
          const headerOffset = (header?.offsetHeight ?? 88) + 16;

          // GSAP takes ownership of the transform so its scale/y tweens below
          // compose with the tilt instead of flattening it.
          gsap.set(cards, {
            rotation: (index: number) => CARD_ROTATIONS[index] ?? 0,
          });

          const timeline = gsap.timeline({
            scrollTrigger: {
              // The stage, not the SVG — the SVG is `absolute inset-0` inside
              // it and has no height of its own to pin.
              trigger: stageEl,
              start: `top top+=${headerOffset}`,
              end: "+=60%",
              pin: true,
              pinSpacing: true,
              scrub: 0.5,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefreshInit: layout,
            },
          });

          paths.forEach((path, index) => {
            /**
             * Reveal by opacity rather than a draw.
             *
             * DrawSVG works by setting `stroke-dasharray` — which is now the dot
             * pattern itself, so it would erase the dots. Masking the dots and
             * drawing the mask instead rendered nothing at all. Fading the whole
             * connector is the one reveal that leaves `stroke-dasharray` free
             * for the pattern, and it keeps the same scrub timing, so a line is
             * still fully in place before its card passes under the header.
             */
            timeline.from(path, { opacity: 0, duration: 0.5, ease: "none" });
            // `from`, not set-then-to: the resting state is the visible one, so
            // if this timeline never builds the cards are simply not animated
            // rather than stuck at opacity 0 forever.
            timeline.from(
              cards[index + 1],
              {
                opacity: 0,
                scale: 0.92,
                y: 24,
                duration: 0.45,
                ease: "power2.out",
              },
              ">-0.08",
            );
          });
        },
      );

      /**
       * Below `lg` the connectors are hidden and the steps are a plain vertical
       * stack, so there is nothing to pin — pinning a variable-height list on a
       * phone just builds a scroll trap. The steps still get an entrance.
       *
       * One paused tween per step, replayed as that step comes into view from
       * either direction. Off a single trigger, the steps lower down finished
       * their entrance below the fold, where nobody saw it. Steps that arrive
       * together are staggered by their start delay.
       */
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          const items = gsap.utils.toArray<HTMLElement>(".process-item", stageEl);
          const entrances = new Map(
            items.map((item) => [
              item,
              gsap.from(item, {
                opacity: 0,
                y: 28,
                duration: 0.5,
                ease: "power2.out",
                paused: true,
              }),
            ]),
          );

          return replayOnScroll(items, {
            play: (entered) =>
              entered.forEach((item, index) =>
                entrances.get(item)?.delay(index * 0.1).restart(true),
              ),
            reset: (left) =>
              left.forEach((item) => entrances.get(item)?.pause(0)),
          });
        },
      );

      return () => mm.revert();
    },
    { scope: stage },
  );

  return (
    <div ref={stage} className="process-flow relative lg:aspect-[16/12]">
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
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {children}
    </div>
  );
}
