/**
 * Replays an entrance every time its element comes back into view — scrolling
 * down onto it, or back up to it.
 *
 * `play` runs when an element reaches the trigger zone; `reset` only once it
 * has left the screen entirely. So nothing ever visibly un-animates at the edge
 * of the screen, and an element that never fully left is not replayed. It is the
 * pattern `components/motion/team-scroller.tsx` settled on for dealing its
 * cards, pulled out so every entrance on the site behaves the same way.
 *
 * IntersectionObserver rather than ScrollTrigger, for the reason that file
 * documents: the browser reports what is on screen at that moment, whereas
 * ScrollTrigger works from positions measured up front. Those go stale when
 * content above grows late — a font or image arriving on a phone — and can then
 * reset an element in plain view and never play it again.
 *
 * Elements that reach the zone in the same frame arrive together, in the order
 * they were passed in, so a caller can stagger them as a group.
 */

type Options<T extends Element> = {
  /** Runs for the elements that have just reached the trigger zone. */
  play: (entered: T[]) => void;
  /** Runs for the elements that have just left the screen entirely. */
  reset: (left: T[]) => void;
  /**
   * Shrinks the viewport down to the trigger zone. The default keeps the top
   * and bottom 10% out of it, so an entrance starts once there is something of
   * the element to see.
   */
  rootMargin?: string;
};

/** Returns a disposer that stops observing and drops anything still queued. */
export function replayOnScroll<T extends Element>(
  targets: T | readonly T[],
  { play, reset, rootMargin = "-10% 0px" }: Options<T>,
): () => void {
  const elements: readonly T[] = targets instanceof Element ? [targets] : targets;
  const shown = new Set<T>();

  // Several entries can queue up for one element; only its latest state counts.
  const latest = (entries: IntersectionObserverEntry[]) => {
    const state = new Map<T, boolean>();
    for (const entry of entries) state.set(entry.target as T, entry.isIntersecting);
    return state;
  };

  const inZone = new IntersectionObserver(
    (entries) => {
      const entered: T[] = [];
      for (const [el, isIn] of latest(entries)) {
        if (isIn && !shown.has(el)) {
          shown.add(el);
          entered.push(el);
        }
      }
      if (entered.length === 0) return;
      entered.sort((a, b) => elements.indexOf(a) - elements.indexOf(b));
      play(entered);
    },
    { rootMargin },
  );

  const onScreen = new IntersectionObserver((entries) => {
    const left: T[] = [];
    for (const [el, isIn] of latest(entries)) {
      if (!isIn && shown.has(el)) {
        shown.delete(el);
        left.push(el);
      }
    }
    if (left.length > 0) reset(left);
  });

  for (const el of elements) {
    inZone.observe(el);
    onScreen.observe(el);
  }

  return () => {
    // Drop anything already queued, so no callback lands after cleanup.
    for (const observer of [inZone, onScreen]) {
      observer.takeRecords();
      observer.disconnect();
    }
  };
}
