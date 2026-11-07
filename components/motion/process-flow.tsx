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
      // One trail and one flash, reused for every connector. The previous
      // version kept five of each and gave every one a drop-shadow filter, so
      // ten filtered elements repainted on each frame.
      const trail = svgEl.querySelector<SVGPathElement>("[data-trail]");
      const spark = svgEl.querySelector<SVGCircleElement>("[data-spark]");
      if (paths.length === 0 || cards.length === 0) return;

      /** The single connector timeline, rebuilt only when the curves move. */
      let master: gsap.core.Timeline | null = null;
      let onScreen = false;

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
          type Segment = { d: string; length: number; endX: number; endY: number };

          // Measured once per layout change and cached, so nothing recalculates
          // a path or a box while the trail is moving.
          let segments: Segment[] = [];

          const layout = () => {
            const width = stageEl.clientWidth;
            const height = stageEl.clientHeight;
            if (!width || !height || !trail) return;

            // Measured from the stage's own box, so the percentages the SVG
            // draws in and the pixels the cards occupy are the same space.
            const boxes = cards.map((card) => boxWithin(card, stageEl));

            segments = boxes.slice(0, -1).map((box, index) => {
              const d = connector(box, boxes[index + 1], width, height);
              paths[index].setAttribute("d", d);

              // The trail element doubles as the measuring tool: set the curve
              // once, read its length and end point, hand both to the timeline.
              trail.setAttribute("d", d);
              const length = trail.getTotalLength() || 1;
              const end = trail.getPointAtLength(length);

              return { d, length, endX: end.x, endY: end.y };
            });
          };

          /**
           * One timeline, one trail, one flash — reused for all four
           * connections, in workflow order.
           *
           * Only `transform` (MotionPath) and `opacity` move, `force3D` hands
           * them to the compositor, and the moving light itself is what brightens
           * the dots it passes. The trail is the same path's dash over the same
           * window and ease: dash offset and MotionPath progress are both arc
           * length, so the tail cannot drift from the head.
           */
          const build = () => {
            master?.kill();

            const RUN = 2;
            const GAP = 0.35;
            const tl = gsap.timeline({
              repeat: -1,
              repeatDelay: 0.9,
              paused: true,
            });

            segments.forEach((segment, index) => {
              const at = index * (RUN + GAP);
              const tail = segment.length * 0.06;

              if (trail) {
                tl.set(trail, { attr: { d: segment.d } }, at);
                tl.set(
                  trail,
                  {
                    opacity: 0.7,
                    strokeDasharray: `${tail} ${segment.length}`,
                  },
                  at,
                );
                tl.fromTo(
                  trail,
                  { strokeDashoffset: segment.length },
                  {
                    strokeDashoffset: -tail,
                    duration: RUN,
                    ease: "power1.inOut",
                  },
                  at,
                );
                tl.to(trail, { opacity: 0, duration: 0.25 }, at + RUN - 0.25);
              }

              if (spark) {
                tl.set(
                  spark,
                  { attr: { cx: segment.endX, cy: segment.endY } },
                  at + RUN - 0.05,
                );
                tl.fromTo(
                  spark,
                  { opacity: 0, scale: 0.5 },
                  {
                    opacity: 0.7,
                    scale: 1,
                    duration: 0.12,
                    transformOrigin: "center",
                  },
                  at + RUN - 0.05,
                );
                tl.to(
                  spark,
                  { opacity: 0, scale: 1.4, duration: 0.35 },
                  at + RUN + 0.07,
                );
              }
            });

            master = tl;
            if (onScreen) tl.play();
          };

          const refresh = () => {
            layout();
            build();
          };

          refresh();

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
              // Re-measure and rebuild together: the timeline captures the
              // curve it will follow, so a stale measurement would both draw
              // and move along the previous layout.
              onRefreshInit: refresh,
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

      /**
       * The connector animation only runs while the section is on screen, and
       * not in a hidden tab. Both are plain flags — no React state, so nothing
       * re-renders while the animation plays.
       */
      const observer = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          if (onScreen) master?.play();
          else master?.pause();
        },
        { rootMargin: "20% 0px" },
      );
      observer.observe(stageEl);

      const onTabChange = () => {
        if (document.hidden) master?.pause();
        else if (onScreen) master?.play();
      };
      document.addEventListener("visibilitychange", onTabChange);

      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", onTabChange);
        master?.kill();
        mm.revert();
      };
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

        {/* Two reused elements for every connection: the trail (a short dash of
            the same path, driven in the path's own units so `getTotalLength()`
            times it exactly) and the landing flash. */}
        <path
          data-trail
          className="connector-pulse"
          fill="none"
          strokeLinecap="round"
          strokeWidth="0.5"
          opacity="0"
        />

        <circle data-spark className="connector-spark" r="0.9" opacity="0" />
      </svg>

      {children}
    </div>
  );
}
