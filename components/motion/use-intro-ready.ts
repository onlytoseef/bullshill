"use client";

import { useSyncExternalStore } from "react";
import { isIntroReleased, isIntroReleasedOnServer, subscribeToIntro } from "@/lib/intro-gate";

/** Observe parser readiness without timers or waiting for an asset bundle. */
export function useIntroReady(): boolean {
  return useSyncExternalStore(subscribeToIntro, isIntroReleased, isIntroReleasedOnServer);
}
