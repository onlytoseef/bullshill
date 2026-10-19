"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import type { ReactNode } from "react";

import "lenis/dist/lenis.css";

import { ScrollTrigger } from "@/lib/gsap";

function ScrollTriggerSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    let cancelled = false;
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };

    void document.fonts.ready.then(refresh);

    /**
     * `fonts.ready` resolves before below-the-fold images have finished, so
     * anything measured then can be out by whatever those images add to the
     * page. One more refresh once everything has settled — which matters most
     * for pinned triggers, where a stale start/end is plainly visible.
     *
     * `load` has often already fired by the time this effect runs, and a
     * listener added after the event never comes, so check for that first.
     */
    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", refresh);
    }

    /**
     * Neither covers the page changing height later — an image or font that
     * lands after `load` on a slow phone, a tab or accordion opening. Every
     * trigger below the change would then fire in the wrong place, so measure
     * again whenever the height actually changes.
     *
     * `refresh(true)` is the safe variant: it waits 0.2s for the change to
     * settle and holds off until any scroll in progress has ended, so a card
     * pinned mid-scroll is never re-measured under your finger.
     */
    let height = -1;
    const observer = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.height);
      // The first report is just the starting size.
      if (height >= 0 && next !== height && !cancelled) {
        ScrollTrigger.refresh(true);
      }
      height = next;
    });
    observer.observe(document.body);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("load", refresh);
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ anchors: true }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
