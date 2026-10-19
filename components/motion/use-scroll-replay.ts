"use client";

import { useEffect, useState, type RefObject } from "react";

import { replayOnScroll } from "@/lib/scroll-replay";

/**
 * `true` from when an element reaches the trigger zone until it has left the
 * screen entirely, then `false` again — so its entrance replays every time it
 * comes back into view. Drive a `motion` element's `animate` with it.
 *
 * `enabled: false` holds it hidden, e.g. until the page loader is out of the
 * way. See `lib/scroll-replay.ts` for why it waits for the element to leave the
 * screen entirely before resetting.
 */
export function useScrollReplay(
  ref: RefObject<Element | null>,
  { enabled = true, rootMargin }: { enabled?: boolean; rootMargin?: string } = {},
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    return replayOnScroll(el, {
      play: () => setVisible(true),
      reset: () => setVisible(false),
      rootMargin,
    });
  }, [ref, enabled, rootMargin]);

  return visible;
}
