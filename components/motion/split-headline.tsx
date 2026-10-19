"use client";

import { useRef } from "react";

import type { HeadlineSegment } from "@/lib/content";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { replayOnScroll } from "@/lib/scroll-replay";
import { cn } from "@/lib/utils";

import { useIntroReady } from "./use-intro-ready";

type Props = {
  lines: readonly (readonly HeadlineSegment[])[];
  className?: string;
};

/**
 * The hero headline, revealed a word at a time from behind a mask — and
 * revealed again every time you scroll back up to it.
 *
 * React owns the lines and segments; SplitText only splits words. That split is
 * deliberate: SplitText's font-loading listener and its ResizeObserver are both
 * gated on `splitLines && autoSplit`, because line boundaries have to be
 * measured. Word boundaries are textual, so splitting words only means no font
 * race, no re-split on resize, and mobile's `white-space: normal` keeps
 * reflowing on its own.
 *
 * Gated on the intro latch — without it the first reveal plays out behind the
 * page loader's panels and nobody sees it.
 */
export function SplitHeadline({ lines, className }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const ready = useIntroReady();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !ready) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let reveal: gsap.core.Tween | undefined;

        const split = SplitText.create(
          gsap.utils.toArray<HTMLElement>(".hero-seg", el),
          {
            type: "words",
            tag: "span",
            wordsClass: "hero-word",
            mask: "words",
            /**
             * `auto` would set `aria-label` on each segment span, where a
             * generic role means assistive tech may ignore it — leaving the
             * heading with no accessible name once the words are hidden. The
             * <h1> below carries the label instead.
             */
            aria: "none",
            // Paused: `replayOnScroll` plays it — straight away, since the
            // hero is on screen when the latch opens — and rewinds it once the
            // headline has scrolled fully out of view.
            onSplit: (self) =>
              (reveal = gsap.from(self.words, {
                yPercent: 110,
                duration: 0.8,
                stagger: 0.045,
                ease: "power3.out",
                paused: true,
              })),
          },
        );

        const stop = replayOnScroll(el, {
          play: () => reveal?.restart(),
          reset: () => reveal?.pause(0),
        });

        return () => {
          stop();
          split.revert();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.from(el, { opacity: 0, duration: 0.4 });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [ready] },
  );

  /** Read out as one sentence, rather than as a pile of word fragments. */
  const label = lines
    .map((segments) => segments.map((segment) => segment.text).join(""))
    .join(" ");

  return (
    <h1 ref={ref} className={className} aria-label={label}>
      {lines.map((segments, lineIndex) => (
        <span key={lineIndex} className="hero-line block" aria-hidden>
          {segments.map((segment, segmentIndex) => (
            <span
              key={segmentIndex}
              className={cn("hero-seg", segment.accent && "hero-seg--accent")}
            >
              {segment.text}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
