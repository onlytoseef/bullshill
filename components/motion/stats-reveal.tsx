"use client";

import { useRef, type ReactNode } from "react";

import { createCountUp, type CountUp } from "@/lib/count-up";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { EASE_OUT_GSAP } from "@/lib/motion";
import { replayOnScroll } from "@/lib/scroll-replay";

import { useIntroReady } from "./use-intro-ready";

/** Delay between tiles that enter the viewport together. */
const CARD_STAGGER = 0.15;
/** A counter starts this long after its tile, so it counts as the tile settles. */
const COUNT_DELAY = 0.15;

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Scroll-triggered entrance for the about/stats bento grid: the heading rises
 * in a word at a time, then the tiles stagger up as they reach the viewport,
 * each counting its number up as it lands. All of it replays every time it
 * comes back into view, from above or below.
 *
 * Markup hooks, all resolved inside this wrapper:
 * - `[data-stats-eyebrow]` — the eyebrow pill; leads the heading in.
 * - `[data-stats-heading]` — split into words that rise and fade in.
 * - `[data-stats-card]`    — a tile; staggered up, scaled and faded in.
 * - `[data-stats-count]`   — a tile's value; counted up from zero if it holds
 *                            a number ("Top Rated" is left as it is).
 *
 * Only `transform` and `opacity` are animated, so the entrance never triggers
 * layout. All DOM reads (counter parsing) happen up front, before any writes.
 *
 * Tiles are batched rather than run off one trigger: in two columns a row
 * arrives together and staggers as a group, while in one column each tile
 * waits for its own turn — instead of the lower ones finishing their count
 * off-screen.
 */
export function StatsReveal({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useIntroReady();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const eyebrow = root.querySelector("[data-stats-eyebrow]");
        const heading = root.querySelector("[data-stats-heading]");
        const cards = gsap.utils.toArray<HTMLElement>("[data-stats-card]", root);

        const counters = new Map<Element, CountUp>();
        for (const card of cards) {
          const value = card.querySelector("[data-stats-count]");
          const counter = value && createCountUp(value);
          if (counter) counters.set(card, counter);
        }

        // Words only: word boundaries are textual, so there is nothing to
        // re-measure when the font swaps in or the viewport resizes. `auto`
        // labels the <h2> with the full sentence and hides the fragments.
        const split =
          heading &&
          SplitText.create(heading, { type: "words", tag: "span", aria: "auto" });

        if (eyebrow) gsap.set(eyebrow, { y: 16, opacity: 0 });
        // `tag: "span"` keeps the markup valid inside an <h2>, but SplitText
        // only makes non-span wrappers inline-block — and a transform does
        // nothing to an inline box, so the words would fade without rising.
        if (split) {
          gsap.set(split.words, { display: "inline-block", y: 24, opacity: 0 });
        }
        gsap.set(cards, { y: 48, scale: 0.96, opacity: 0 });
        counters.forEach((counter) => counter.reset());

        // GSAP reverts its own tweens; the split and the painted text are ours.
        const cleanup = () => {
          split?.revert();
          counters.forEach((counter) => counter.restore());
        };

        /**
         * Parked from the first frame, but only armed once the page loader is
         * out of the way. The hero is content-height, so on a tall screen this
         * section is in view on load — ungated, the whole entrance would play
         * out behind the loader. `revertOnUpdate` makes the switch a clean
         * revert-and-rebuild in one pass, so nothing flashes in between.
         */
        if (!ready) return cleanup;

        // Everything from here is paused and played by `replayOnScroll`, so it
        // replays on every return — see `lib/scroll-replay.ts`.
        const headingIn = gsap.timeline({
          paused: true,
          defaults: { ease: EASE_OUT_GSAP },
        });
        if (eyebrow) headingIn.to(eyebrow, { y: 0, opacity: 1, duration: 0.6 }, 0);
        if (split) {
          headingIn.to(
            split.words,
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.04 },
            eyebrow ? 0.15 : 0,
          );
        }

        // One timeline per tile — its rise plus its count — so each can be
        // replayed or rewound on its own.
        const tilesIn = new Map(
          cards.map((card) => {
            const tileIn = gsap
              .timeline({ paused: true, defaults: { ease: EASE_OUT_GSAP } })
              .to(card, { y: 0, scale: 1, opacity: 1, duration: 0.9 });
            const counter = counters.get(card);
            if (counter) tileIn.add(counter.play(), COUNT_DELAY);
            return [card, tileIn] as const;
          }),
        );

        // Watches the heading itself rather than the whole grid, so scrolling
        // back up to it replays it while it is in view, not off above.
        const stopHeading = replayOnScroll(heading ?? eyebrow ?? root, {
          // The bottom edge matches the old `top 80%` start.
          rootMargin: "-20% 0px",
          play: () => headingIn.restart(),
          reset: () => headingIn.pause(0),
        });

        const stopTiles = replayOnScroll(cards, {
          // The bottom edge matches the old `top 88%` start.
          rootMargin: "-12% 0px",
          play: (entered) =>
            entered.forEach((card, index) =>
              tilesIn.get(card)?.delay(index * CARD_STAGGER).restart(true),
            ),
          // Back to zero while out of sight, so a replay counts up from the
          // start instead of fading in on the final figure first.
          reset: (left) =>
            left.forEach((card) => {
              tilesIn.get(card)?.pause(0);
              counters.get(card)?.reset();
            }),
        });

        return () => {
          stopHeading();
          stopTiles();
          cleanup();
        };
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
