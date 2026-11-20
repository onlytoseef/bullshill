"use client";

import Image from "next/image";
import { useLayoutEffect, useId, useRef } from "react";

import bullLogo from "../../app/assets/images/logo.webp";
import { gsap } from "@/lib/gsap";
import { INTRO_SESSION_KEY } from "@/lib/intro-session";
import { holdIntro, releaseIntro } from "@/lib/intro-gate";

/**
 * Shortest the cover may stay after the page is ready. Long enough that the
 * intro reads as an animation rather than a flicker; short enough that it is
 * not a loading delay. Everything below is scaled against this number.
 */
const MIN_HOLD_MS = 160;

/**
 * Exit playback speed. The exit is ~1.15s of choreography at 1x; playing it
 * faster keeps every beat and order while nearly halving the time the cover
 * spends on top of already-painted content.
 */
const EXIT_TIME_SCALE = 1.9;

/**
 * One persistent overlay. React owns navigation; GSAP owns the motion.
 *
 * The full sequence plays once per tab. `sessionStorage` survives both client
 * navigations and refreshes, so a returning visitor gets the page immediately
 * instead of the cover again. Route changes are left entirely to Next's own
 * routing — there is no interception here and therefore nothing between the
 * click and the new page.
 *
 * Timings are deliberately short: the cover sits on top of content that is
 * already painted, so every millisecond it stays is a millisecond the visitor
 * is not reading the page — and, on a first load, LCP measured through it.
 */
export function PageLoader() {
  const maskId = useId().replace(/:/g, "");
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    // Already watched in this tab: keep the overlay down and open the intro
    // gate straight away, so nothing is left waiting on a loader that will
    // never run. `html[data-intro="skip"]` hides the overlay before this
    // effect anyway — this is the part that lets gated content in.
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
    } catch {
      // Private mode or a blocked storage partition: behave like a first load.
      seen = false;
    }

    if (seen) {
      el.hidden = true;
      el.setAttribute("aria-hidden", "true");
      el.dataset.state = "idle";
      releaseIntro();
      return;
    }

    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      // Nothing to do: the sequence still runs, it just is not remembered.
    }

    const stage = el.querySelector<HTMLElement>(".charge__stage")!;
    const logo = el.querySelector<HTMLElement>(".charge__logo")!;
    const content = el.querySelector<HTMLElement>(".charge__identity")!;
    const ring = el.querySelector<HTMLElement>(".charge__ring")!;
    const ground = el.querySelector<HTMLElement>(".charge__ground")!;
    const wake = el.querySelectorAll<HTMLElement>(".charge__wake i");
    const indicator = el.querySelector<HTMLElement>(".charge__indicator")!;
    const segment = el.querySelector<HTMLElement>(".charge__segment")!;
    const hole = el.querySelector<SVGCircleElement>(".charge__aperture")!;
    const edge = el.querySelector<SVGCircleElement>(".charge__edge")!;
    const recovery = el.querySelector<HTMLElement>(".charge__recovery")!;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let context: gsap.Context | undefined;
    let loops: gsap.core.Animation[] = [];
    let running: gsap.core.Timeline | undefined;
    let state: "idle" | "waiting" | "revealing" = "idle";
    let started = 0;
    let ready = false;
    let disposed = false;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;
    let recoveryTimer: ReturnType<typeof setTimeout> | undefined;
    let previousOverflow: string | null = null;

    const unlock = () => {
      if (previousOverflow !== null) document.body.style.overflow = previousOverflow;
      previousOverflow = null;
    };
    const preventScroll = (event: Event) => {
      if (state !== "idle") event.preventDefault();
    };
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    const done = () => {
      state = "idle";
      el.hidden = true;
      el.setAttribute("aria-hidden", "true");
      el.dataset.state = "idle";
      unlock();
      releaseIntro();
    };

    const finish = () => {
      if (disposed || !ready || state !== "waiting") return;
      state = "revealing";
      el.dataset.state = "revealing";
      clearTimeout(recoveryTimer);
      recovery.hidden = true;
      loops.filter((animation) => preference.matches || animation !== running)
        .forEach((animation) => animation.kill());
      context?.add(() => {
        if (preference.matches) {
          gsap.to(el, { opacity: 0, duration: 0.12, onComplete: done });
          return;
        }
        const bounds = stage.getBoundingClientRect();
        const cx = bounds.left + bounds.width / 2;
        const cy = bounds.top + bounds.height / 2;
        const radius = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) + 24;
        gsap.set([hole, edge], { attr: { cx, cy, r: 0 } });
        gsap.set(edge, { opacity: 0.45 });
        // `timeScale` compresses the whole choreography proportionally: every
        // beat keeps its order and relative spacing, it just plays faster.
        // Set via the method, not the vars object, so it is unambiguously
        // applied before the first tick.
        const completion = gsap.timeline({ onComplete: done }).timeScale(EXIT_TIME_SCALE);
        if (running) completion.to(running, { timeScale: 1.9, duration: 0.2, ease: "power2.in" }, 0);
        completion
          .call(() => { running?.pause(); }, [], 0.22)
          .to([ground, ...wake], { opacity: 0, duration: 0.1 }, 0.22)
          // Uniform scale plus depth preserves the original flattened artwork.
          .to(logo, { x: 0, y: -5, z: 105, scale: 1.35, rotation: 0, duration: 0.3, ease: "power3.in" }, 0.24)
          .to(ring, { scale: 1.38, opacity: 0.85, duration: 0.3, ease: "power2.out" }, 0.3)
          .to(indicator, { opacity: 0, duration: 0.12 }, 0)
          .to(content, { opacity: 0, duration: 0.24 }, 0.52)
          .to([hole, edge], { attr: { r: radius }, duration: 0.65, ease: "power3.inOut" }, 0.49)
          .to(edge, { opacity: 0, duration: 0.3 }, 0.85);
      });
    };

    const markReady = () => {
      if (state !== "waiting") return;
      ready = true;
      clearTimeout(finishTimer);
      clearTimeout(recoveryTimer);
      // Just enough for the intro to register, not a loading delay. Was 380.
      finishTimer = setTimeout(finish, preference.matches ? 0 : Math.max(0, MIN_HOLD_MS - (performance.now() - started)));
    };

    const begin = () => {
      ready = false;
      clearTimeout(finishTimer);
      clearTimeout(recoveryTimer);
      recovery.hidden = true;
      holdIntro();
      if (state !== "waiting") {
        context?.revert();
        state = "waiting";
        started = performance.now();
        el.hidden = false;
        el.setAttribute("aria-hidden", "false");
        el.dataset.state = "waiting";
        if (previousOverflow === null) {
          previousOverflow = document.body.style.overflow;
          document.body.style.overflow = "hidden";
        }
        context = gsap.context(() => {
          gsap.set(el, { opacity: 1 });
          gsap.set(hole, { attr: { r: 0 } });
          gsap.set(edge, { opacity: 0 });
          gsap.set(content, { opacity: 1 });
          gsap.set(logo, { x: 5, y: 0, z: 0, scale: 1, rotation: 0 });
          gsap.set([ground, ...wake], { opacity: 0 });
          gsap.set(indicator, { opacity: 1 });
          gsap.set(ring, { opacity: 0.22, scale: 1 });
          loops = [];
          running = undefined;
          if (preference.matches) return;
          gsap.fromTo(content, { opacity: 0, y: 7 }, { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" });
          // One deterministic stride: drive, lift, contact, recovery. The logo
          // faces left; the short ground and wake streaks travel rightward.
          running = gsap.timeline({ repeat: -1 })
            .to(logo, { x: -10, y: -6, rotation: -0.8, duration: 0.18, ease: "power2.in" }, 0)
            .to(logo, { x: -13, y: -4, rotation: -0.4, duration: 0.1, ease: "power1.out" }, 0.18)
            .to(logo, { x: -2, y: 2, rotation: 0.4, duration: 0.14, ease: "power2.in" }, 0.28)
            .to(logo, { x: 5, y: 0, rotation: 0, duration: 0.2, ease: "power2.out" }, 0.42)
            .fromTo(ground, { x: -28, scaleX: 0.65, opacity: 0 }, { x: -12, scaleX: 1, opacity: 0.85, duration: 0.1 }, 0.02)
            .to(ground, { x: 52, scaleX: 0.5, opacity: 0, duration: 0.32, ease: "power2.in" }, 0.12)
            .fromTo(wake, { x: -4, opacity: 0 }, { x: 4, opacity: 0.65, duration: 0.08, stagger: 0.06 }, 0.08)
            .to(wake, { x: 38, opacity: 0, duration: 0.24, stagger: 0.06, ease: "power2.in" }, 0.28);
          loops.push(
            running,
            gsap.fromTo(segment, { xPercent: -110 }, { xPercent: 350, duration: 1.25, repeat: -1, ease: "power1.inOut" }),
          );
        }, el);
      }
      // A slow/failed request stays covered; recovery is explicit, never a fake completion.
      recoveryTimer = setTimeout(() => { recovery.hidden = false; }, 15000);
    };

    const onPreference = () => {
      if (state === "idle") return;
      const wasReady = ready;
      context?.revert();
      state = "idle";
      begin();
      if (wasReady) markReady();
    };
    preference.addEventListener("change", onPreference);
    begin();
    const image = el.querySelector("img");
    void (image?.decode().catch(() => {}) ?? Promise.resolve()).then(() => {
      if (!disposed) markReady();
    });

    return () => {
      disposed = true;
      clearTimeout(finishTimer);
      clearTimeout(recoveryTimer);
      context?.revert();
      unlock();
      releaseIntro();
      preference.removeEventListener("change", onPreference);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  return (
    <div ref={root} className="charge" data-state="waiting" data-lenis-prevent>
      <svg className="charge__veil" width="100%" height="100%" aria-hidden="true">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect width="100%" height="100%" fill="white" />
            <circle className="charge__aperture" cx="50%" cy="50%" r="0" fill="black" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="#06111f" mask={`url(#${maskId})`} />
        <circle className="charge__edge" r="0" fill="none" stroke="#ff8a38" strokeWidth="1.5" opacity="0" />
      </svg>
      <div className="charge__identity">
        <div className="charge__stage">
          <span className="charge__ring" aria-hidden="true" />
          <span className="charge__ground" aria-hidden="true" />
          <span className="charge__wake" aria-hidden="true"><i /><i /><i /></span>
          <div className="charge__logo">
            <Image src={bullLogo} alt="" width={bullLogo.width} height={bullLogo.height} sizes="160px" priority unoptimized draggable={false} />
          </div>
        </div>
        <div className="charge__brand">BULL<span>SHILL</span></div>
        <p className="charge__label" role="status" aria-live="polite">Preparing your experience</p>
        <div className="charge__indicator" aria-hidden="true"><span className="charge__segment" /></div>
        <button type="button" className="charge__recovery" hidden onClick={() => location.reload()}>
          Taking longer than expected. Retry navigation
        </button>
      </div>
    </div>
  );
}
