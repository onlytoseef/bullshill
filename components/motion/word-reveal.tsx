"use client";

import { motion, type Variants } from "motion/react";

import type { HeadlineSegment } from "@/lib/content";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.4em" },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

type Props = {
  /** One array per visual line; each line is a list of styled segments. */
  lines: readonly (readonly HeadlineSegment[])[];
  className?: string;
};

/**
 * Headline that animates in word by word on mount.
 *
 * Takes plain serializable data rather than children, so a Server Component can
 * hand it the copy straight from `lib/content`. Every word is present in the
 * server-rendered HTML — only opacity and transform are animated, so crawlers
 * still read the full heading.
 */
export function WordReveal({ lines, className }: Props) {
  return (
    <motion.h1
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {lines.map((segments, lineIndex) => (
        <span key={lineIndex} className="block">
          {segments.map((segment, segmentIndex) =>
            segment.text
              .split(" ")
              .filter(Boolean)
              .map((text, wordIndex) => (
                <motion.span
                  key={`${segmentIndex}-${wordIndex}`}
                  variants={word}
                  className={cn(
                    "inline-block",
                    // Trailing gap instead of a space character, so the inline
                    // blocks still wrap naturally at narrow widths.
                    "mr-[0.25em]",
                    segment.accent && "text-orange",
                  )}
                >
                  {text}
                </motion.span>
              )),
          )}
        </span>
      ))}
    </motion.h1>
  );
}
