"use client";

import { useRef, type ReactNode } from "react";

import { createCountUp } from "@/lib/count-up";
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
 * The cover opens like a window — clipped in from its edges — then the client's
 * name rises a character at a time, the summary follows and the metric chips
 * stagger in, counting up.
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
      const title = root.querySelector("[data-case-title]");
      const summary = root.querySelector("[data-case-summary]");
      const metrics = gsap.utils.toArray<HTMLElement>("[data-case-metric]", root);

      const mm = gsap.matchMedia();

      mm.add(
        { desktop: "(min-width: 768px)", motionOk: MOTION_OK },
        (context) => {
          const { motionOk } = context.conditions as { motionOk: boolean };
          if (!motionOk) return;

          const split = title ? splitHeading(title, true) : null;
          const counters = metrics.map((metric) =>
            // The figure, when the chip splits it out for styling — otherwise
            // the chip itself.
            createCountUp(
              metric.querySelector("[data-case-figure]") ?? metric,
              { duration: 1.4 },
            ),
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
