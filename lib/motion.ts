/**
 * Shared motion tokens.
 *
 * The same ease was previously written out in four places, which is how two of
 * them end up drifting. One curve, three dialects — Framer wants a cubic-bezier
 * array, CSS wants the function, GSAP wants a named ease.
 */

import type { Variants } from "motion/react";

/** Framer Motion / `motion` — cubic-bezier control points. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** CSS `transition-timing-function` form of {@link EASE_OUT}. */
export const EASE_OUT_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * GSAP's nearest equivalent. Not a numerical match for {@link EASE_OUT} — GSAP
 * has no cubic-bezier ease built in — but the same "fast out, long settle"
 * character, which is what the two libraries need to agree on.
 */
export const EASE_OUT_GSAP = "power3.out";

/**
 * Eyebrow → title → subtitle, each a beat behind the last. Shared by every
 * section heading so the rhythm is identical across the page.
 *
 * Type-only import, so this module stays plain data and does not drag
 * `motion/react` into anything that imports it.
 */
export const HEADING_CONTAINER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export const HEADING_ITEM: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};
