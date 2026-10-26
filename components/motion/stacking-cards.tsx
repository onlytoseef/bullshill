"use client";

import { useRef, type ReactNode } from "react";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Clears the sticky header (20px top padding + 68px nav) with a little air. */
const HEADER_CLEARANCE = 112;
/** How much of each buried card stays visible above the one covering it. */
const PEEK = 20;
/** Scale lost per card stacked on top, so deeper cards recede further. */
const SCALE_STEP = 0.04;
/** Shade added per card stacked on top. */
const SHADE_STEP = 0.16;
/** Space left under a card that is too tall to rest below the header. */
const BOTTOM_GAP = 24;
/**
 * Below `lg`, where a buried card is only ever in view while the next one is
 * covering it: how far it recedes in that time.
 */
const COVERED_SCALE = 0.9;
const COVERED_SHADE = 0.5;

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Vertically stacking cards: each card pins once it is fully in view and the
 * next one slides up over it, while the cards underneath shrink and darken
 * into a receding deck.
 *
 * Each `<li>` is expected to hold a `[data-stack-pin]` wrapper around a
 * `[data-stack-card]`, with an optional `[data-stack-shade]` overlay inside
 * the card. The wrapper is what gets pinned and the card is what gets scaled —
 * animating a pinned element's own transform throws off ScrollTrigger's
 * measurements, and pinning the `<li>` itself would wrap it in a pin-spacer
 * `<div>`, which is not a valid child of a `<ul>`.
 *
 * `pinSpacing: false` throughout: cards are buried rather than held, so the
 * section scrolls exactly as far as it did before and nothing below it moves.
 */
export function StackingCards({ children, className }: Props) {
  const ref = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      /**
       * Every screen size. Below `lg` the rows are single-column and taller
       * than a phone screen, so `restAt` pins them by their bottom edge: a card
       * only stops once you have scrolled to its end, and is never covered
       * while you are still reading it.
       */
      mm.add(
        {
          desktop: "(min-width: 1024px)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { desktop, motion } = context.conditions as {
            desktop: boolean;
            motion: boolean;
          };
          if (!motion) return;

          const pins = gsap.utils.toArray<HTMLElement>("[data-stack-pin]", el);
          if (pins.length < 2) return;

          const last = pins.length - 1;

          /**
           * Where card `index` comes to rest: cascaded under the header so a
           * sliver of every buried card shows. A card too tall for that pins by
           * its bottom edge instead, so its button is never cut off on a short
           * screen.
           *
           * Only read from start/end functions, which ScrollTrigger re-runs on
           * every refresh — so this tracks resizes and late-loading fonts.
           */
          const restAt = (index: number) =>
            Math.min(
              HEADER_CLEARANCE + index * PEEK,
              window.innerHeight - pins[index].offsetHeight - BOTTOM_GAP,
            );

          const stackComplete = () => `top ${restAt(last)}px`;

          pins.slice(0, last).forEach((pin, index) => {
            const card = pin.querySelector<HTMLElement>("[data-stack-card]");
            const shade = pin.querySelector<HTMLElement>("[data-stack-shade]");
            // How many cards end up on top of this one.
            const depth = last - index;

            // Every card but the top one stays put until the stack is complete,
            // then they all scroll away together. `anticipatePin` sets the pin
            // a frame early on a fast flick, so the card does not jolt.
            ScrollTrigger.create({
              trigger: pin,
              start: () => `top ${restAt(index)}px`,
              endTrigger: pins[last],
              end: stackComplete,
              pin: true,
              pinSpacing: false,
              anticipatePin: 1,
            });

            if (!card) return;

            gsap.set(card, { transformOrigin: "50% 0%" });

            /**
             * Starts the moment the next card reaches this one's bottom edge.
             *
             * On desktop the buried cards stay in view as a cascade, so each
             * keeps receding as later cards land, the deepest furthest. Below
             * `lg` the next card hides this one completely, so it recedes while
             * it is being covered — otherwise the effect would play out where
             * nobody can see it.
             */
            const recede = gsap.timeline({
              scrollTrigger: {
                trigger: pins[index + 1],
                start: () =>
                  `top ${Math.min(
                    window.innerHeight,
                    restAt(index) + pin.offsetHeight,
                  )}px`,
                ...(desktop
                  ? { endTrigger: pins[last], end: stackComplete }
                  : { end: `top ${HEADER_CLEARANCE}px` }),
                scrub: true,
              },
            });

            recede.to(
              card,
              { scale: desktop ? 1 - depth * SCALE_STEP : COVERED_SCALE, ease: "none" },
              0,
            );
            if (shade) {
              recede.to(
                shade,
                { opacity: desktop ? depth * SHADE_STEP : COVERED_SHADE, ease: "none" },
                0,
              );
            }
          });
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <ul ref={ref} className={className}>
      {children}
    </ul>
  );
}
