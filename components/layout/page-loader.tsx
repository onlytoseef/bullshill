"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { gsap } from "@/lib/gsap";
import { releaseIntro } from "@/lib/intro-gate";

/**
 * "BULL CHARGE" — the route transition.
 *
 * A cover, a diagonal energy streak, a burst of square fragments, the wordmark,
 * then a shockwave that hands the viewport to the new route. Everything is
 * transform/opacity only, and no canvas: the fragments are DOM squares, which
 * keeps this cheap enough for a phone and impossible to blow a WebGL context on.
 *
 * Navigation is never held up. The overlay covers on click and leaves the moment
 * `usePathname` reports the new route; if that is slower than the animation, the
 * fragments simply drift until it arrives, and a safety timer removes the
 * overlay regardless so a failed navigation can never trap the page.
 */

/** Fragments thrown from the centre when the streak crosses it. */
const FRAGMENTS = 16;
/** Longest the overlay may stay up if a route never confirms. */
const SAFETY_MS = 4000;
/** How long the charge sequence itself runs before it waits for the route. */
const CHARGE_MS = 620;
/** How long the shockwave takes to clear the viewport. */
const WAVE_MS = 320;

type Phase = "idle" | "charge" | "reveal";

export function PageLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");

  const cover = useRef<HTMLDivElement>(null);
  const streak = useRef<HTMLDivElement>(null);
  const burst = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const wave = useRef<HTMLDivElement>(null);

  const charge = useRef<gsap.core.Timeline | null>(null);
  const drift = useRef<gsap.core.Timeline | null>(null);
  const safety = useRef<number | null>(null);
  const armed = useRef(false);
  const revealed = useRef(false);

  /** The new route is on screen (or we gave up waiting): open the viewport. */
  const release = useCallback(() => {
    if (revealed.current || !armed.current) return;
    revealed.current = true;

    if (safety.current) {
      window.clearTimeout(safety.current);
      safety.current = null;
    }

    setPhase("reveal");
  }, []);

  /** Runs the moment we know a transition is happening (first load or a click). */
  const start = useCallback(() => {
    if (armed.current) return;
    armed.current = true;
    revealed.current = false;
    setPhase("charge");

    if (safety.current) window.clearTimeout(safety.current);
    safety.current = window.setTimeout(release, SAFETY_MS);
  }, [release]);

  // ---- the charge sequence -------------------------------------------------
  useEffect(() => {
    if (phase !== "charge") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = cover.current?.parentElement;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([cover.current, streak.current, burst.current], { autoAlpha: 0 });
        gsap.fromTo(
          word.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.18, ease: "none" },
        );
        return;
      }

      const tl = gsap.timeline();
      charge.current = tl;

      tl.fromTo(
        cover.current,
        { autoAlpha: 0, scale: 1.02 },
        { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power2.out" },
      )
        // The bar is parked bottom-left and rotated onto the diagonal; travelling
        // +x / -y carries it across the centre and off the top-right corner.
        .fromTo(
          streak.current,
          { x: "0vmax", y: "0vmax", autoAlpha: 0 },
          {
            x: "108vmax",
            y: "-108vmax",
            autoAlpha: 1,
            duration: 0.42,
            ease: "power2.in",
          },
          0.12,
        )
        .to(streak.current, { autoAlpha: 0, duration: 0.12 }, 0.5)
        .fromTo(
          word.current,
          { autoAlpha: 0, yPercent: 12 },
          { autoAlpha: 1, yPercent: 0, duration: 0.22, ease: "power2.out" },
          0.32,
        );

      // Burst: each square flies from the centre on its own vector.
      const squares = burst.current?.children;
      if (squares && squares.length > 0) {
        tl.fromTo(
          squares,
          { autoAlpha: 0.9, scale: 0.4, x: 0, y: 0 },
          {
            autoAlpha: 0,
            scale: 1,
            x: (_i, el) => Number((el as HTMLElement).dataset.dx) * 1,
            y: (_i, el) => Number((el as HTMLElement).dataset.dy) * 1,
            duration: 0.46,
            ease: "power2.out",
            stagger: 0.006,
          },
          0.3,
        );
      }

      // Ambient: once the charge settles, the fragments keep drifting so a slow
      // route reads as "still charging" rather than frozen. The burst wrapper is
      // a zero-sized point, so the movement belongs on the squares themselves.
      if (squares && squares.length > 0) {
        drift.current = gsap
          .timeline({ repeat: -1, yoyo: true })
          .to(squares, {
            x: "+=2",
            y: "-=2",
            duration: 1.2,
            ease: "sine.inOut",
            stagger: 0.03,
          });
      }
    }, root);

    return () => {
      charge.current = null;
      drift.current = null;
      ctx.revert();
    };
  }, [phase]);

  // ---- the reveal ----------------------------------------------------------
  useEffect(() => {
    if (phase !== "reveal") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = cover.current?.parentElement;
    if (!root) return;

    // Let the hero's own entrance play into the wipe, not behind it.
    releaseIntro();

    const ctx = gsap.context(() => {
      const done = () => setPhase("idle");

      if (reduced) {
        gsap.to(root, { autoAlpha: 0, duration: 0.16, onComplete: done });
        return;
      }

      const tl = gsap.timeline({ onComplete: done });

      tl.to(word.current, { autoAlpha: 0, duration: 0.14, ease: "none" }, 0)
        .fromTo(
          wave.current,
          { autoAlpha: 0.9, scale: 0.05 },
          { autoAlpha: 0, scale: 1.8, duration: WAVE_MS / 1000, ease: "power2.out" },
          0,
        )
        .to(cover.current, { autoAlpha: 0, duration: 0.24, ease: "power2.in" }, 0.1)
        .to(root, { autoAlpha: 0, duration: 0.06 }, (WAVE_MS - 40) / 1000);
    }, root);

    return () => ctx.revert();
  }, [phase]);

  // ---- navigation start: a click on an internal link -----------------------
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page, hash only, or the route we are already on: nothing to cover.
      if (url.pathname === window.location.pathname) return;

      start();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [start]);

  // ---- navigation complete -------------------------------------------------
  useEffect(() => {
    if (armed.current && !revealed.current) release();
  }, [pathname, release]);

  // ---- first load ----------------------------------------------------------
  useEffect(() => {
    start();
    return () => {
      if (safety.current) window.clearTimeout(safety.current);
    };
  }, [start]);

  // The intro has no route change to wait for, so it releases on its own beat.
  useEffect(() => {
    if (phase !== "charge") return;
    const timer = window.setTimeout(release, CHARGE_MS);
    return () => window.clearTimeout(timer);
  }, [phase, release]);

  if (phase === "idle") return null;

  return (
    <div ref={cover} className="charge" aria-hidden>
      <div className="charge__streak" ref={streak} />

      <div className="charge__burst" ref={burst}>
        {Array.from({ length: FRAGMENTS }, (_, index) => {
          const angle = (index / FRAGMENTS) * Math.PI * 2;
          const distance = 90 + ((index * 37) % 130);

          return (
            <span
              key={index}
              data-dx={Math.cos(angle) * distance}
              data-dy={Math.sin(angle) * distance}
              style={{
                animationDelay: `${(index % 5) * 40}ms`,
              }}
            />
          );
        })}
      </div>

      <div className="charge__word" ref={word}>
        BULL<span>SHILL</span>
      </div>

      <div className="charge__wave" ref={wave} />
    </div>
  );
}
