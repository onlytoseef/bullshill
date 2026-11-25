"use client";

import { useRef, type CSSProperties } from "react";
import type { HeadlineSegment } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useEssentialReplay } from "./essential-replay";
import styles from "./essential-entrance.module.css";

export function SplitHeadline({ lines, className }: {
  lines: readonly (readonly HeadlineSegment[])[];
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEssentialReplay(ref);
  let wordIndex = 0;
  const label = lines.map((line) => line.map((segment) => segment.text).join("")).join(" ");
  return (
    <h1 ref={ref} className={className} aria-label={label}>
      {lines.map((segments, lineIndex) => (
        <span key={lineIndex} className="hero-line block" aria-hidden>
          {segments.map((segment, segmentIndex) => (
            <span key={segmentIndex} className={cn("hero-seg", segment.accent && "hero-seg--accent")}>
              {segment.text.split(/(\s+)/).map((part, index) => /^\s*$/.test(part) ? part : (
                <span key={index} className="hero-word-mask">
                  <span className={`hero-word ${styles.word}`} style={{ "--word-index": wordIndex++ } as CSSProperties}>{part}</span>
                </span>
              ))}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
