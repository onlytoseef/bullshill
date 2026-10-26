"use client";

/**
 * A one-way latch the page loader opens when its panels start retracting.
 *
 * Without it every mount-triggered hero animation plays behind the loader and
 * nobody sees it: the panels only begin moving at 1720ms (1500ms `is-exiting`
 * plus the 220ms transition delay in `globals.css`), while the headline, coin
 * arc, subcopy and CTA are all finished by ~1300ms.
 *
 * Why a module-level latch rather than a delay prop on each animation: the
 * loader lives in the root layout, so it mounts once per *hard* load and not on
 * client navigations. A hardcoded delay would make the hero sit still for ~1.9s
 * after navigating from /contact back to /, waiting for a loader that isn't
 * there. Module state survives client navigation, so the latch stays open and
 * those visits animate immediately.
 *
 * SSR note: this module is evaluated on the server too (Client Components still
 * server-render), and module state there is shared across requests. Safe here
 * because `released` is only ever flipped from a timer, and timers don't run
 * during SSR — the server always reports a closed latch.
 */

/**
 * Backstop for the latch. If the loader is ever removed, errors, or has its
 * timers cancelled, this is what stops the gated content being invisible
 * forever. Armed by `useIntroReady`, so any consumer is enough.
 */
export const INTRO_FAILSAFE_MS = 4000;

let released = false;
const waiters = new Set<() => void>();

export function releaseIntro() {
  if (released) return;
  released = true;
  for (const notify of waiters) notify();
  // Terminal state — nothing will fire again, so drop the references.
  waiters.clear();
}

export function isIntroReleased() {
  return released;
}

/**
 * Snapshot for the server render. Always closed, so the markup React produces
 * on the server matches what the client has at hydration.
 */
export function isIntroReleasedOnServer() {
  return false;
}

/**
 * `useSyncExternalStore` contract. No need to fire `notify` for an
 * already-released latch — React reads the snapshot after subscribing.
 */
export function subscribeToIntro(notify: () => void) {
  waiters.add(notify);
  return () => {
    waiters.delete(notify);
  };
}
