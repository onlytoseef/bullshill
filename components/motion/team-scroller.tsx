"use client";

import { useRef, type ReactNode } from "react";

import { Draggable, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { EASE_OUT_GSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { useIntroReady } from "./use-intro-ready";

/** Steepest lean, in degrees, however hard the row is flung. */
const MAX_LEAN = 8;
/** Scroll speed, in px/s, that buys one degree of lean. */
const SPEED_PER_DEGREE = 300;
/**
 * How far a photo drifts inside its card while the card crosses the row, as a
 * percentage of the photo. The photo is 116% of the card (see `awards.tsx`),
 * so anything up to ~6.9 keeps its edges out of sight.
 */
const DRIFT = 6;

/** Where a card is dealt in from: off to the right, swung away on its left edge. */
const DEALT = { opacity: 0, xPercent: 30, rotationY: 35 };
/** Set, never tweened — a perspective tweened towards 0 distorts wildly. */
const DEAL_SETUP = { transformPerspective: 1200, transformOrigin: "0% 50%" };
/** Delay between one card being dealt and the next. */
const DEAL_STAGGER = 0.08;
const PHOTO_ZOOM = { scale: 1.25 };

type Props = {
  children: ReactNode;
  /** Accessible name for the row. */
  label: string;
  className?: string;
};

/**
 * The team row: still a native horizontal scroller — touch, trackpad, keyboard,
 * scrollbar and CSS snapping all work as before — with GSAP layered on top.
 *
 * - Cards are dealt in from the right every time the row comes into view,
 *   scrolling down or back up, each photo settling from a slight zoom.
 * - Cards lean with the row's scroll speed and straighten as it slows.
 * - Each photo drifts against its card as the card crosses the row, so the
 *   row reads as having depth.
 * - With a mouse, the cards can be grabbed and thrown, and the throw lands on
 *   a card edge.
 *
 * Markup hooks, resolved inside the row:
 * - `[data-team-card]`  — an `<li>`; dealt in, leaned, and a drag handle.
 * - `[data-team-photo]` — the photo layer inside a card; drifted.
 * - `[data-team-zoom]`  — inside the photo layer; settles from a zoom on entry.
 *
 * Only transforms and opacity are animated. Card positions are read from
 * `offsetLeft`, which transforms do not affect, so nothing is measured off
 * an element mid-animation.
 */
export function TeamScroller({ children, label, className }: Props) {
  const ref = useRef<HTMLUListElement>(null);
  const ready = useIntroReady();

  useGSAP(
    () => {
      const row = ref.current;
      if (!row) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          mouse: "(pointer: fine)",
        },
        (context) => {
          const { motion, mouse } = context.conditions as {
            motion: boolean;
            mouse: boolean;
          };
          const cards = gsap.utils.toArray<HTMLElement>("[data-team-card]", row);
          if (cards.length === 0) return;
          const zooms = gsap.utils.toArray<HTMLElement>("[data-team-zoom]", row);

          const undo: (() => void)[] = [];
          const cleanup = () => undo.forEach((fn) => fn());

          /**
           * Snapping is off whenever the cards are gathered up, until they have
           * been dealt. Chrome snaps to where a card is drawn, not where it is
           * laid out, so a card shifted right drags the row along with it —
           * cancelling the slide and leaning the cards for a scroll nobody made.
           */
          if (motion) {
            row.dataset.dealing = "";
            undo.push(() => delete row.dataset.dealing);
          }

          /**
           * Parked until the page loader is out of the way. The header's
           * "Team" link lands on this section, so a hard load of `/#about` has
           * it in view from the first frame — ungated, the deal would play out
           * behind the loader.
           */
          if (!ready) {
            if (motion) {
              gsap.set(cards, { ...DEAL_SETUP, ...DEALT });
              gsap.set(zooms, PHOTO_ZOOM);
            }
            return cleanup;
          }

          if (motion) {
            // Created first so it is reverted last: its revert restores the
            // cards' original inline transform, which also clears the lean.
            gsap.set(cards, DEAL_SETUP);
            const deal = gsap
              .timeline({
                paused: true,
                defaults: { ease: EASE_OUT_GSAP, stagger: DEAL_STAGGER },
                onComplete: () => {
                  delete row.dataset.dealing;
                },
              })
              .from(cards, { ...DEALT, duration: 1.1 }, 0)
              .from(zooms, { ...PHOTO_ZOOM, duration: 1.4 }, 0);

            /**
             * Dealt every time the row comes into view, from above or below.
             * The cards are only gathered back up once the row is entirely off
             * screen, so a card never vanishes in view — and a row that never
             * fully left is not dealt again.
             *
             * Driven by IntersectionObserver rather than ScrollTrigger: the
             * browser reports what is actually on screen at that moment.
             * ScrollTrigger works from positions measured up front, so content
             * above that grew afterwards — a font or image arriving late on a
             * phone — had it gather the cards up with the row in plain view and
             * never deal them again.
             */
            let dealt = false;

            const dealIn = () => {
              if (dealt) return;
              dealt = true;
              // Start the stagger at the first card in view. If the row was
              // left scrolled along, the cards before it are off to the left
              // and should not hold up the ones you can see.
              const left = row.scrollLeft;
              const first = cards.findIndex(
                (card) => card.offsetLeft + card.offsetWidth > left + 1,
              );
              deal.play(Math.max(0, first) * DEAL_STAGGER);
            };

            const gatherUp = () => {
              if (!dealt) return;
              dealt = false;
              row.dataset.dealing = "";
              deal.pause(0);
            };

            // The last entry is the latest state if several queued up.
            const latest = (entries: IntersectionObserverEntry[]) =>
              entries[entries.length - 1].isIntersecting;

            // Dealt once the row reaches the middle 70% of the screen…
            const inMiddle = new IntersectionObserver(
              (entries) => {
                if (latest(entries)) dealIn();
              },
              { rootMargin: "-15% 0px -15% 0px" },
            );
            // …and gathered up again only once it is off the screen entirely.
            const onScreen = new IntersectionObserver((entries) => {
              if (!latest(entries)) gatherUp();
            });
            inMiddle.observe(row);
            onScreen.observe(row);
            undo.push(() => {
              // Drop anything already queued, so no callback lands on a
              // reverted timeline after cleanup.
              for (const observer of [inMiddle, onScreen]) {
                observer.takeRecords();
                observer.disconnect();
              }
            });

            // One settling tween, retargeted on every update, rather than a
            // fresh tween per scroll event piling up in the context.
            const tilt = { skew: 0 };
            const lean = gsap.quickSetter(cards, "skewX", "deg");
            const settle = gsap.quickTo(tilt, "skew", {
              duration: 0.8,
              ease: "power3",
              onUpdate: () => lean(tilt.skew),
            });
            const clampLean = gsap.utils.clamp(-MAX_LEAN, MAX_LEAN);

            ScrollTrigger.create({
              scroller: row,
              horizontal: true,
              start: 0,
              end: "max",
              onUpdate: (self) => {
                const skew = clampLean(self.getVelocity() / -SPEED_PER_DEGREE);
                // Only a harder push restarts the settle, so the lean eases
                // out smoothly instead of twitching with every scroll event.
                if (Math.abs(skew) > Math.abs(tilt.skew)) settle(0, skew);
              },
            });

            // Numeric start/end from `offsetLeft`: ScrollTrigger would
            // otherwise measure the cards while the deal has them shifted.
            for (const card of cards) {
              const photo = card.querySelector("[data-team-photo]");
              if (!photo) continue;

              gsap.fromTo(
                photo,
                { xPercent: -DRIFT },
                {
                  xPercent: DRIFT,
                  ease: "none",
                  scrollTrigger: {
                    scroller: row,
                    horizontal: true,
                    // From entering on the right to leaving on the left.
                    start: () => card.offsetLeft - row.clientWidth,
                    end: () => card.offsetLeft + card.offsetWidth,
                    scrub: 0.5,
                  },
                },
              );
            }
          }

          if (!mouse) return cleanup;

          /**
           * Grab-and-throw for mouse users, who otherwise only have shift+wheel
           * or the scrollbar. Draggable moves a detached proxy and the row
           * follows it, so the list keeps its own DOM — type "scrollLeft" would
           * wrap the `<li>`s in a `<div>`.
           *
           * The cards are the handles rather than the row, so a press on the
           * scrollbar is still an ordinary scrollbar drag.
           */
          const proxy = document.createElement("div");
          let snapPoints: number[] = [];

          // Chrome snaps every programmatic scroll, which would pull each
          // frame of the drag back to a card. CSS snapping is off until the
          // throw has landed — on a card edge, so turning it back on is a
          // no-op.
          const holdSnapping = () => {
            row.dataset.dragging = "";
          };
          const releaseSnapping = () => {
            delete row.dataset.dragging;
          };
          const follow = () => {
            row.scrollLeft = -drag.x;
          };

          const [drag] = Draggable.create(proxy, {
            trigger: cards,
            type: "x",
            inertia: motion,
            edgeResistance: 1,
            overshootTolerance: 0,
            maxDuration: 1.2,
            zIndexBoost: false,
            cursor: "grab",
            activeCursor: "grabbing",
            // Runs before Draggable records the start of the drag, so the drag
            // starts from wherever native scrolling left the row.
            onPressInit: () => {
              const max = row.scrollWidth - row.clientWidth;
              snapPoints = cards.map((card) => -Math.min(card.offsetLeft, max));
              gsap.set(proxy, { x: -row.scrollLeft });
              drag.applyBounds({ minX: -max, maxX: 0 });
            },
            onDragStart: holdSnapping,
            onDrag: follow,
            onThrowUpdate: follow,
            // The throw has already started by the time this runs.
            onRelease: () => {
              if (!drag.isThrowing) releaseSnapping();
            },
            onThrowComplete: releaseSnapping,
            snap: { x: (value: number) => gsap.utils.snap(snapPoints, value) },
          });

          // A wheel or trackpad scroll mid-throw wins; otherwise the two fight.
          const interrupt = () => {
            if (!drag.isThrowing) return;
            drag.tween?.kill();
            releaseSnapping();
          };
          row.addEventListener("wheel", interrupt, { passive: true });

          undo.push(() => {
            row.removeEventListener("wheel", interrupt);
            drag.kill();
            releaseSnapping();
          });
          return cleanup;
        },
      );

      return () => mm.revert();
    },
    { scope: ref, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <ul
      ref={ref}
      // `relative` makes the row the cards' offsetParent, which is what lets
      // `offsetLeft` stand in for their position along the scroll.
      className={cn("relative", className)}
      tabIndex={0}
      aria-label={label}
    >
      {children}
    </ul>
  );
}
