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
 * `false` until the page loader's panels start retracting, then `true` forever.
 *
 * Gate mount-triggered hero animations on this so they play into the loader's
 * wipe instead of behind it. Pass it through `useGSAP`'s `dependencies` and
 * return early while it is false.
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
