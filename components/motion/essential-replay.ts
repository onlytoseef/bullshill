"use client";

import { useEffect, type RefObject } from "react";
import { replayOnScroll } from "@/lib/scroll-replay";

/** CSS owns first paint; JS only replays on subsequent scroll visits. */
export function useEssentialReplay(ref: RefObject<HTMLElement | null>, replayFirstEntry = false) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let entered = false;
    return replayOnScroll(node, {
      play: () => {
        if (entered || replayFirstEntry) node.getAnimations({ subtree: true }).forEach((animation) => {
          if (!entered) animation.currentTime = 0;
          animation.play();
        });
        entered = true;
      },
      reset: () => {
        node.getAnimations({ subtree: true }).forEach((animation) => {
          animation.pause();
          animation.currentTime = 0;
        });
      },
    });
  }, [ref, replayFirstEntry]);
}
