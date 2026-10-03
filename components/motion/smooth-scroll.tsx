"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import type { ReactNode } from "react";

// Required by Lenis — sets `html.lenis body { height: auto }` and the
// overscroll/iframe guards it relies on. Without it Lenis still attaches, but
// height and overscroll behave inconsistently.
import "lenis/dist/lenis.css";

import { ScrollTrigger } from "@/lib/gsap";

/**
 * Keeps ScrollTrigger's cached scroll position in step with Lenis.
 *
 * Renders inside <ReactLenis> and reads the instance through useLenis(), not
 * through the component ref: ReactLenis creates Lenis in its own effect and
 * publishes it via setState, so the ref is still undefined when a parent's
 * effect runs. Reading from context means this re-runs once the instance
 * exists.
 *
 * Deliberately does NOT take over Lenis's rAF loop. Driving it from
 * gsap.ticker (`autoRaf: false`) is the tighter integration, but it makes
 * scrolling itself depend on this effect running — and when that assumption
 * broke, nothing called raf() and the page would not scroll at all. Letting
 * Lenis run its own loop means the worst case here is ScrollTrigger lagging a
 * frame, not a dead page. Syncing on the scroll event keeps the two in step
 * regardless of which loop drives them.
 */
function ScrollTriggerSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    // Trigger positions are measured once up front, so they're wrong until
    // webfonts settle and reflow the text.
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  return null;
}

/**
 * Lenis smooth scroll.
 *
 * Takes `children` rather than importing page content, so everything inside
 * stays a Server Component — only this wrapper ships to the client.
 *
 * `root` scrolls the document itself instead of transforming a wrapper div,
 * which is what keeps `position: sticky` working for the nav.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ anchors: true }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
