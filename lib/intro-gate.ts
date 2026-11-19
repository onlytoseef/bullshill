"use client";

import { INTRO_SESSION_KEY } from "./intro-session";

/**
 * The page loader holds entrances until its cover has cleared. It closes the
 * gate again on client navigation, so returning to the hero also waits for
 * that transition rather than playing underneath it.
 *
 * The gate is now tied to the load, not to every navigation: the loader runs
 * once per tab, so on a navigation within that tab the gate is released
 * immediately and content renders straight away.
 *
 * Browser effects and click handlers are the only callers that change this
 * state; the server snapshot always stays closed for hydration.
 */

/**
 * Backstop for the latch. If the loader is ever removed, errors, or has its
 * timers cancelled, this is what stops the gated content being invisible
 * forever. Armed by `useIntroReady`, so any consumer is enough.
 */
export const INTRO_FAILSAFE_MS = 4000;

/**
 * Starts open when this tab has already watched the intro.
 *
 * Reading it at module scope — rather than in the loader's effect — means the
 * latch is already correct on the first client render, so a refresh shows the
 * page immediately instead of rendering gated content hidden and revealing it
 * a commit later. The server snapshot stays `false`, so hydration still has a
 * matching value to compare against.
 */
let released = false;
if (typeof window !== "undefined") {
  try {
    released = window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
  } catch {
    released = false;
  }
}
const waiters = new Set<() => void>();

export function holdIntro() {
  if (!released) return;
  released = false;
  for (const notify of waiters) notify();
}

export function releaseIntro() {
  if (released) return;
  released = true;
  for (const notify of waiters) notify();
  // Keep subscriptions alive for the next route transition. Each consumer
  // removes its own subscription when it unmounts.
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
