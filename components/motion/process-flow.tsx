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

type Box = {
  left: number;
  top: number;
  right: number;
  width: number;
  height: number;
};

/**
 * Where `el` sits inside `root`, from layout offsets rather than its on-screen
 * rectangle.
 *
 * The cards are rotated, and `getBoundingClientRect` reports the rotated card's
 * axis-aligned box — wider and taller than the card — so connectors started and
 * ended a dozen pixels away from it and read as floating arcs. `offsetLeft` and
 * `offsetTop` ignore transforms, so both ends land on the card itself.
 */
function boxWithin(el: HTMLElement, root: HTMLElement): Box {
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = el;

  while (node && node !== root) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }

  return {
    left,
    top,
    right: left + el.offsetWidth,
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}

/**
 * A dotted S-curve from one card to the next.
 *
 * Both ends sit *inside* their card: the cards paint above the connector layer
 * (`z-10` against `z-[1]`), so the overshoot is hidden and the line visibly
 * meets the edge it belongs to at any rotation.
 */
const CONNECTOR_INSET = 24;

function connector(first: Box, second: Box, w: number, h: number) {
  const movesRight = second.left >= first.left;
  const direction = movesRight ? 1 : -1;

  const x1 = (movesRight ? first.right - CONNECTOR_INSET : first.left + CONNECTOR_INSET) / w;
  const x2 = (movesRight ? second.left + CONNECTOR_INSET : second.right - CONNECTOR_INSET) / w;
  const y1 = (first.top + first.height * 0.5) / h;
  const y2 = (second.top + second.height * 0.5) / h;

  const toX1 = x1 * 100;
  const toX2 = x2 * 100;
  const toY1 = y1 * 100;
  const toY2 = y2 * 100;

  const bend = Math.max(Math.abs(toX2 - toX1) * 0.5, 6);

  return `M ${toX1} ${toY1} C ${toX1 + bend * direction} ${toY1}, ${toX2 - bend * direction} ${toY2}, ${toX2} ${toY2}`;
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
      const pulses = gsap.utils.toArray<SVGPathElement>("[data-pulse]", stageEl);
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
            const width = stageEl.clientWidth;
            const height = stageEl.clientHeight;
            if (!width || !height) return;

            // Measured from the stage's own box, so the percentages the SVG
            // draws in and the pixels the cards occupy are the same space.
            const boxes = cards.map((card) => boxWithin(card, stageEl));

            boxes.slice(0, -1).forEach((box, index) => {
              const d = connector(box, boxes[index + 1], width, height);
              paths[index].setAttribute("d", d);

              // The charge runs the identical path, and its dash pattern is
              // rebuilt from the new length so the dot keeps the same size.
              const pulse = pulses[index];
              if (!pulse) return;
              pulse.setAttribute("d", d);
              const length = pulse.getTotalLength() || 1;
              pulse.style.strokeDasharray = `${length * 0.1} ${length}`;
            });
          };

          layout();

          // The charge: a short bright dash that runs the line from one card to
          // the next, then waits. The pause between pulses is what makes it read
          // as current moving through a cable rather than a loading bar.
          pulses.forEach((path, index) => {
            const length = path.getTotalLength() || 1;
            const tail = length * 0.1;

            gsap.fromTo(
              path,
              { strokeDashoffset: length },
              {
                strokeDashoffset: -tail,
                duration: 1.5,
                ease: "power1.inOut",
                repeat: -1,
                repeatDelay: 1 + index * 0.2,
                delay: index * 0.28,
              },
            );
          });

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

        {/* The charge itself: one bright dot that runs the same path as the
            dotted line, drawn above it and below the cards. No
            `non-scaling-stroke` here — the dash values have to be the path's own
            units, which is what lets `getTotalLength()` time the run exactly. */}
        {process.steps.slice(0, -1).map((step) => (
          <path
            key={`pulse-${step.title}`}
            data-pulse
            className="connector-pulse"
            fill="none"
            strokeLinecap="round"
            strokeWidth="0.55"
          />
        ))}
      </svg>

      {children}
    </div>
  );
}
