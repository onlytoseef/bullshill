import { gsap } from "@/lib/gsap";

/**
 * A number — optionally grouped, optionally with decimals — and whatever
 * surrounds it: "$10M+" → "$" · "10" · "M+", "3,000+" → "" · "3,000" · "+".
 */
const NUMERIC = /^(\D*?)(\d[\d,]*(?:\.\d+)?)([\s\S]*)$/;

export type CountUp = {
  /** Paints the starting value. */
  reset: () => void;
  /** Counts up to the target. Returned so it can be placed on a timeline. */
  play: () => gsap.core.Tween;
  /** Paints the server-rendered text back, verbatim. */
  restore: () => void;
};

/**
 * The counter engine. GSAP tweens a plain proxy object and `onUpdate` paints
 * it, so nothing per-frame goes through React, and nothing per-frame reads
 * layout.
 *
 * Everything is parsed from the text the server rendered — prefix, grouping,
 * decimals, suffix — so the markup stays the single source of truth and the
 * last frame puts that exact string back. Returns `null` for text with no
 * number in it, which is then simply not counted.
 *
 * Writes go to the existing text node in place. Setting `textContent` would
 * swap out the node React rendered and leave React holding a detached one.
 */
export function createCountUp(
  el: Element,
  { duration = 1.8 }: { duration?: number } = {},
): CountUp | null {
  const node = el.firstChild;
  if (!node || node !== el.lastChild || node.nodeType !== Node.TEXT_NODE) {
    return null;
  }

  const final = node.nodeValue ?? "";
  const match = NUMERIC.exec(final);
  if (!match) return null;

  const [, prefix, digits, suffix] = match;
  const decimals = digits.split(".")[1]?.length ?? 0;
  const target = Number(digits.replace(/,/g, ""));
  const format = new Intl.NumberFormat("en-US", {
    useGrouping: digits.includes(","),
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const proxy = { value: 0 };
  let painted = final;

  // Most frames round to the number already on screen; those skip the DOM.
  const paint = (text: string) => {
    if (text !== painted) node.nodeValue = painted = text;
  };
  const render = () => paint(prefix + format.format(proxy.value) + suffix);

  return {
    reset: () => {
      proxy.value = 0;
      render();
    },
    play: () =>
      gsap.to(proxy, {
        value: target,
        duration,
        ease: "power2.out",
        onUpdate: render,
        onComplete: () => paint(final),
      }),
    restore: () => paint(final),
  };
}
