"use client";

import { useEffect, useSyncExternalStore } from "react";

import {
  INTRO_FAILSAFE_MS,
  isIntroReleased,
  isIntroReleasedOnServer,
  releaseIntro,
  subscribeToIntro,
} from "@/lib/intro-gate";

/**
 * `false` while the page loader covers the viewport, including client route
 * transitions. Entrances start once the cover is gone. GSAP consumers use
 * `revertOnUpdate` so closing the gate also cleans up the previous entrance.
 *
 * Arms the fail-safe in `lib/intro-gate`, so the latch opens on its own if the
 * loader never gets round to it — gated content is never permanently hidden.
 */
export function useIntroReady(): boolean {
  const ready = useSyncExternalStore(
    subscribeToIntro,
    isIntroReleased,
    isIntroReleasedOnServer,
  );

  useEffect(() => {
    if (ready) return;

    const id = window.setTimeout(releaseIntro, INTRO_FAILSAFE_MS);
    return () => window.clearTimeout(id);
  }, [ready]);

  return ready;
}
