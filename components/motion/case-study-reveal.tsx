"use client";

import { useRef, type ReactNode } from "react";

import { createCountUp, type CountUp } from "@/lib/count-up";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { EASE_OUT_GSAP } from "@/lib/motion";
import { replayOnScroll } from "@/lib/scroll-replay";

import { useIntroReady } from "./use-intro-ready";

/**
 * Motion for the /case-studies/[slug] page — one wrapper per section, each
 * resolving its own `data-case-*` hooks, so the sections stay server
 * components.
 *
 * Built for reading rather than for show:
 * - Nothing pins or holds the scroll, and every entrance is done within about
 *   a second, so the copy never waits on an animation.
 * - Only transform, opacity and clip-path move, so layout never shifts under
 *   the reader.
 * - Entrances replay every time a block comes back into view, but only reset
 *   once it is fully off screen (`lib/scroll-replay.ts`), so scrolling back to
 *   re-read a paragraph never makes it blink.
 * - Gated on the intro latch, so nothing plays behind the page loader, and on
 *   `prefers-reduced-motion`, which gets the page at rest.
 */

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Splits a heading into words — and, optionally, characters — that can move.
 * `aria: "auto"` labels the heading with its full text and hides the pieces.
 * SplitText leaves `span` wrappers inline, and a transform does nothing to an
 * inline box; inline-block words also keep a word's characters on one line.
 */
function splitHeading(el: Element, chars = false) {
  const split = SplitText.create(el, {
    type: chars ? "words,chars" : "words",
    tag: "span",
    aria: "auto",
  });
  gsap.set(split.words, { display: "inline-block" });
  if (chars) gsap.set(split.chars, { display: "inline-block" });
  return split;
}

/**
 * The cover opens like a window — clipped in from its edges while the artwork
 * settles out of a zoom — then the client's name rises a character at a time,
 * the summary follows and the metric chips stagger in, counting up. On desktop
 * the artwork then drifts slowly as the cover scrolls past.
 *
 * Markup hooks:
 * - `[data-case-cover]`   — the framed cover; its first child is the artwork.
 * - `[data-case-title]`   — the client's name.
 * - `[data-case-summary]` — the summary paragraph.
 * - `[data-case-metric]`  — a metric chip; its number counts up.
 */
export function CaseHeroReveal({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useIntroReady();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !ready) return;

      const cover = root.querySelector<HTMLElement>("[data-case-cover]");
      const art = cover?.firstElementChild ?? null;
      const title = root.querySelector("[data-case-title]");
      const summary = root.querySelector("[data-case-summary]");
      const metrics = gsap.utils.toArray<HTMLElement>("[data-case-metric]", root);

      const mm = gsap.matchMedia();

      mm.add(
        { desktop: "(min-width: 768px)", motionOk: MOTION_OK },
        (context) => {
          const { desktop, motionOk } = context.conditions as {
            desktop: boolean;
            motionOk: boolean;
          };
          if (!motionOk) return;

          // Left zoomed in a touch on desktop, so the drift below has artwork
          // to travel into instead of opening a gap at the frame's edge.
          const settle = desktop ? 1.12 : 1;
          const split = title ? splitHeading(title, true) : null;
          const counters = metrics.map((metric) =>
            createCountUp(metric, { duration: 1.4 }),
          );
          counters.forEach((counter) => counter?.reset());

          const intro = gsap.timeline({
            paused: true,
            defaults: { ease: EASE_OUT_GSAP },
          });

          if (cover) {
            // Rounded to the frame's own corners, which change by breakpoint,
            // and cleared once open so the frame's CSS is all that is left.
            const round = getComputedStyle(cover).borderTopLeftRadius;
            intro.fromTo(
              cover,
              { clipPath: `inset(14% 10% 14% 10% round ${round})` },
              {
                clipPath: `inset(0% 0% 0% 0% round ${round})`,
                duration: 1.2,
                ease: "expo.out",
                clearProps: "clipPath",
              },
              0,
            );
          }
          if (art) {
            intro.fromTo(
              art,
              { scale: 1.3 },
              { scale: settle, duration: 1.4, ease: "expo.out" },
              0,
            );
          }
          if (split) {
            intro.from(
              split.chars,
              { yPercent: 100, opacity: 0, duration: 0.7, stagger: 0.025 },
              0.35,
            );
          }
          if (summary) {
            intro.from(summary, { y: 20, opacity: 0, duration: 0.7 }, 0.6);
          }
          metrics.forEach((metric, index) => {
            const at = 0.75 + index * 0.12;
            intro.from(metric, { y: 24, opacity: 0, duration: 0.6 }, at);
            const counter = counters[index];
            if (counter) intro.add(counter.play(), at + 0.1);
          });

          const stop = replayOnScroll(root, {
            play: () => intro.restart(),
            // Back to zero while out of sight, so a replay counts up from the
            // start instead of fading in on the final figure first.
            reset: () => {
              intro.pause(0);
              counters.forEach((counter) => counter?.reset());
            },
          });

          if (desktop && cover && art) {
            gsap.fromTo(
              art,
              { yPercent: -5 },
              {
                yPercent: 5,
                ease: "none",
                scrollTrigger: {
                  trigger: cover,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          }

          return () => {
            stop();
            split?.revert();
            counters.forEach((counter) => counter?.restore());
          };
        },
      );

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

/**
 * Each narrative block plays as it arrives: the eyebrow pops in with a flick
 * of its wand, the heading rises a word at a time, the copy follows and the
 * rule underneath draws out from the centre. The tracks card then brings its
 * rows in one after another.
 *
 * Markup hooks:
 * - `[data-case-block]`   — a narrative block: eyebrow, `h2`, paragraphs.
 * - `[data-case-eyebrow]` — its pill; the `svg` inside is the wand.
 * - `[data-case-tracks]`  — the tracks card.
 * - `[data-case-track]`   — a row in it.
 *
 * The rule is the block's `::after`, which GSAP cannot reach, so it is drawn
 * through `--rule-scale` (see `.case-detail-block::after`).
 */
export function CaseStoryReveal({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useIntroReady();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !ready) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const stops: (() => void)[] = [];
        const splits: SplitText[] = [];

        for (const block of gsap.utils.toArray<HTMLElement>("[data-case-block]", root)) {
          const eyebrow = block.querySelector("[data-case-eyebrow]");
          const wand = eyebrow?.querySelector("svg");
          const heading = block.querySelector("h2");
          const copy = gsap.utils.toArray<HTMLElement>("p", block);
          const split = heading ? splitHeading(heading) : null;
          if (split) splits.push(split);

          const blockIn = gsap.timeline({
            paused: true,
            defaults: { ease: EASE_OUT_GSAP },
          });
          if (eyebrow) {
            blockIn.from(eyebrow, { y: 16, scale: 0.92, opacity: 0, duration: 0.6 }, 0);
          }
          if (wand) {
            blockIn.from(
              wand,
              { rotation: -35, scale: 0.6, duration: 0.7, ease: "back.out(2.2)" },
              0.1,
            );
          }
          if (split) {
            blockIn.from(
              split.words,
              { y: 24, opacity: 0, duration: 0.7, stagger: 0.04 },
              0.15,
            );
          }
          if (copy.length > 0) {
            blockIn.from(copy, { y: 18, opacity: 0, duration: 0.7, stagger: 0.1 }, 0.35);
          }
          blockIn.fromTo(
            block,
            { "--rule-scale": 0 },
            { "--rule-scale": 1, duration: 0.9, ease: "power2.inOut" },
            0.4,
          );

          stops.push(
            replayOnScroll(block, {
              play: () => blockIn.restart(),
              reset: () => blockIn.pause(0),
            }),
          );
        }

        const card = root.querySelector("[data-case-tracks]");
        if (card) {
          const cardIn = gsap.from(card, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: EASE_OUT_GSAP,
            paused: true,
          });
          stops.push(
            replayOnScroll(card, {
              play: () => cardIn.restart(),
              reset: () => cardIn.pause(0),
            }),
          );
        }

        // One tween per row, so each plays as it arrives instead of the lower
        // ones finishing below the fold. Rows that arrive together are
        // staggered by their start delay, a beat behind the card.
        const tracks = gsap.utils.toArray<HTMLElement>("[data-case-track]", root);
        const tracksIn = new Map(
          tracks.map((track) => [
            track,
            gsap.from(track, {
              x: -28,
              opacity: 0,
              duration: 0.7,
              ease: EASE_OUT_GSAP,
              paused: true,
            }),
          ]),
        );
        stops.push(
          replayOnScroll(tracks, {
            play: (entered) =>
              entered.forEach((track, index) =>
                tracksIn.get(track)?.delay(0.15 + index * 0.12).restart(true),
              ),
            reset: (left) => left.forEach((track) => tracksIn.get(track)?.pause(0)),
          }),
        );

        return () => {
          stops.forEach((stop) => stop());
          splits.forEach((split) => split.revert());
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

/**
 * The results glow brightens as the section scrolls up into view — scrubbed,
 * so it follows the scroll both ways — then the heading plays like a story
 * block's and the stat cards stagger up, each counting its figure up.
 *
 * Markup hooks:
 * - `[data-case-results-heading]` — eyebrow, `h2` and subtitle.
 * - `[data-case-stat]`            — a stat card.
 * - `[data-case-count]`           — its figure, counted up from zero.
 *
 * The glow is the section's `::before`/`::after`, which GSAP cannot reach, so
 * it is driven through `--glow` (see `.case-detail-results::before`).
 */
export function CaseResultsReveal({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useIntroReady();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !ready) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const section = root.closest<HTMLElement>(".case-detail-results");
        if (section) {
          gsap.fromTo(
            section,
            { "--glow": 0 },
            {
              "--glow": 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top 25%",
                scrub: true,
              },
            },
          );
        }

        const heading = root.querySelector("[data-case-results-heading]");
        const eyebrow = heading?.querySelector("[data-case-eyebrow]");
        const title = heading?.querySelector("h2");
        const subtitle = heading?.querySelector("p");
        const split = title ? splitHeading(title) : null;

        const headingIn = gsap.timeline({
          paused: true,
          defaults: { ease: EASE_OUT_GSAP },
        });
        if (eyebrow) {
          headingIn.from(eyebrow, { y: 16, scale: 0.92, opacity: 0, duration: 0.6 }, 0);
        }
        if (split) {
          headingIn.from(
            split.words,
            { y: 24, opacity: 0, duration: 0.7, stagger: 0.04 },
            0.15,
          );
        }
        if (subtitle) {
          headingIn.from(subtitle, { y: 18, opacity: 0, duration: 0.7 }, 0.35);
        }

        const cards = gsap.utils.toArray<HTMLElement>("[data-case-stat]", root);
        const counters = new Map<HTMLElement, CountUp>();
        for (const card of cards) {
          const value = card.querySelector("[data-case-count]");
          const counter = value && createCountUp(value);
          if (counter) {
            counter.reset();
            counters.set(card, counter);
          }
        }

        // One timeline per card — its rise plus its count — so each can be
        // replayed or rewound on its own.
        const cardsIn = new Map(
          cards.map((card) => {
            const cardIn = gsap
              .timeline({ paused: true, defaults: { ease: EASE_OUT_GSAP } })
              .from(card, { y: 40, scale: 0.96, opacity: 0, duration: 0.8 });
            const counter = counters.get(card);
            if (counter) cardIn.add(counter.play(), 0.15);
            return [card, cardIn] as const;
          }),
        );

        const stops = [
          replayOnScroll(cards, {
            play: (entered) =>
              entered.forEach((card, index) =>
                cardsIn.get(card)?.delay(index * 0.12).restart(true),
              ),
            // Back to zero while out of sight, so a replay counts up from
            // the start instead of fading in on the final figure first.
            reset: (left) =>
              left.forEach((card) => {
                cardsIn.get(card)?.pause(0);
                counters.get(card)?.reset();
              }),
          }),
        ];
        if (heading) {
          stops.push(
            replayOnScroll(heading, {
              play: () => headingIn.restart(),
              reset: () => headingIn.pause(0),
            }),
          );
        }

        return () => {
          stops.forEach((stop) => stop());
          split?.revert();
          counters.forEach((counter) => counter.restore());
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
