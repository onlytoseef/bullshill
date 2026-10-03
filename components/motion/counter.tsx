"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

function format(n: number, prefix: string, suffix: string) {
  return `${prefix}${Math.round(n).toLocaleString("en-US")}${suffix}`;
}

/**
 * Counts up to `value` when scrolled into view.
 *
 * The final figure is what renders on the server, so it's correct without
 * JavaScript and correct for crawlers. On mount the text is reset to zero and
 * animated up — this section sits well below the fold, so that reset is never
 * on screen. Under reduced motion nothing is touched and the final value simply
 * stays put.
 */
export function Counter({ value, prefix = "", suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { n: 0 };
        el.textContent = format(0, prefix, suffix);

        gsap.to(counter, {
          n: value,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = format(counter.n, prefix, suffix);
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {format(value, prefix, suffix)}
    </span>
  );
}
