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
 * Two things make it read as intentional rather than as a flicker:
 *
 * - The cover is opaque in the server HTML. It is not faded in and does not wait
 *   for hydration, so the real page never paints first and then get covered.
 * - The charge owns a minimum duration. A client navigation finishes in tens of
 *   milliseconds, and releasing the moment the pathname changed meant the
 *   streak and the wordmark were cut off mid-flight; `requestRelease` holds the
 *   reveal until the sequence has had its 620ms, then plays the shockwave.
 *
 * Navigation itself is never delayed — the route swaps underneath the overlay
 * while it runs, and a 4s safety timer removes the overlay regardless so a
 * failed navigation cannot trap the page.
 */

/** Fragments thrown from the centre when the streak crosses it. */
const FRAGMENTS = 16;
/** Longest the overlay may stay up if a route never confirms. */
const SAFETY_MS = 4000;
/**
 * How long the charge runs before it may hand over — matched to the duration the
 * old splash held for, so the site's first-load beat is unchanged.
 */
const CHARGE_MS = 1900;
/** How long the shockwave takes to clear the viewport; the old wipe was 850ms. */
const WAVE_MS = 900;

type Phase = "idle" | "charge" | "reveal";

export function PageLoader() {
  const pathname = usePathname();
  // Starts covered: the overlay is part of the first paint, so the page can
  // never appear before it.
  const [phase, setPhase] = useState<Phase>("charge");

  const cover = useRef<HTMLDivElement>(null);
  const streak = useRef<HTMLDivElement>(null);
  const burst = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const wave = useRef<HTMLDivElement>(null);

  const armed = useRef(false);
  const revealed = useRef(false);
  const startedAt = useRef(0);
  const floor = useRef<number | null>(null);
  const safety = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    for (const timer of [floor, safety]) {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  /** Open the viewport. Only ever runs once per transition. */
  const release = useCallback(() => {
    if (revealed.current || !armed.current) return;
    revealed.current = true;
    clearTimers();
    setPhase("reveal");
  }, [clearTimers]);

  /**
   * Asks for the reveal, but never before the charge has run its course.
   * Called both when a route confirms and when the intro's own beat is up.
   */
  const requestRelease = useCallback(() => {
    const elapsed = performance.now() - startedAt.current;
    const wait = Math.max(0, CHARGE_MS - elapsed);

    if (floor.current) window.clearTimeout(floor.current);
    floor.current = window.setTimeout(release, wait);
  }, [release]);

  /** Begins a transition: first load, or a click on an internal link. */
  const start = useCallback(() => {
    if (!revealed.current && armed.current) return; // already charging
    armed.current = true;
    revealed.current = false;
    startedAt.current = performance.now();
    setPhase("charge");

    clearTimers();
    safety.current = window.setTimeout(release, SAFETY_MS);
    requestRelease();
  }, [clearTimers, release, requestRelease]);

  // ---- the charge sequence -------------------------------------------------
  useEffect(() => {
    if (phase !== "charge") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = cover.current?.parentElement;
    if (!root) return;

    const ctx = gsap.context(() => {
      // The cover is already opaque from the markup; it only settles.
      if (reduced) {
        gsap.set([streak.current, burst.current], { autoAlpha: 0 });
        gsap.set(word.current, { autoAlpha: 1 });
        return;
      }

      const tl = gsap.timeline();

      // The bar is parked bottom-left and rotated onto the diagonal; travelling
      // +x / -y carries it across the centre and off the top-right corner.
      // Stretched to the longer hold: at the old 0.42s pace the sequence was
      // over by 0.7s and the wordmark then sat still for the rest of the beat.
      tl.fromTo(
        streak.current,
        { x: "0vmax", y: "0vmax", autoAlpha: 0 },
        {
          x: "108vmax",
          y: "-108vmax",
          autoAlpha: 1,
          duration: 0.72,
          ease: "power2.in",
        },
        0.1,
      )
        .to(streak.current, { autoAlpha: 0, duration: 0.16 }, 0.76)
        .fromTo(
          word.current,
          { autoAlpha: 0, yPercent: 12 },
          { autoAlpha: 1, yPercent: 0, duration: 0.34, ease: "power2.out" },
          0.52,
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
            x: (_i, el) => Number((el as HTMLElement).dataset.dx),
            y: (_i, el) => Number((el as HTMLElement).dataset.dy),
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.01,
          },
          0.44,
        );

        // Ambient: once the charge settles, the fragments keep drifting so a
        // slower route reads as "still charging" rather than frozen. The burst
        // wrapper is a zero-sized point, so the drift belongs on the squares.
        gsap
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

    return () => ctx.revert();
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
        gsap.to(cover.current, { autoAlpha: 0, duration: 0.16, onComplete: done });
        return;
      }

      const seconds = WAVE_MS / 1000;

      gsap
        .timeline({ onComplete: done })
        .to(word.current, { autoAlpha: 0, duration: 0.12, ease: "none" }, 0)
        .fromTo(
          wave.current,
          { autoAlpha: 0.9, scale: 0.05 },
          { autoAlpha: 0, scale: 1.8, duration: seconds, ease: "power2.out" },
          0,
        )
        // The cover clears *with* the wave, not before it, so the new page
        // materialises through the ring instead of appearing ahead of it.
        .to(
          cover.current,
          { autoAlpha: 0, duration: seconds - 0.08, ease: "power2.in" },
          0.08,
        );
      // Never the wrapper: fading that took the whole page to opacity 0 for a
      // frame, and the cleanup restored it — the flash that followed the
      // transition.
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
    if (armed.current && !revealed.current) requestRelease();
  }, [pathname, requestRelease]);

  // ---- first load ----------------------------------------------------------
  useEffect(() => {
    start();
    return clearTimers;
  }, [start, clearTimers]);

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
