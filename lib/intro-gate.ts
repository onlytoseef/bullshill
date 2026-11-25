"use client";

/** Only decorative enhancements subscribe; essential markup never waits here. */
let released = false;
const waiters = new Set<() => void>();

export function releaseIntro() {
  if (released) return;
  released = true;
  for (const notify of waiters) notify();
}

export function isIntroReleased() {
  return released || (typeof document !== "undefined" && document.documentElement.dataset.intro !== "loading");
}

export function isIntroReleasedOnServer() { return false; }

export function subscribeToIntro(notify: () => void) {
  waiters.add(notify);
  if (waiters.size === 1) window.addEventListener("bullshill:essential-ready", releaseIntro);
  return () => {
    waiters.delete(notify);
    if (!waiters.size) window.removeEventListener("bullshill:essential-ready", releaseIntro);
  };
}
