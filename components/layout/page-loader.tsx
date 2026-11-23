"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import bullLogo from "../../app/assets/images/logo.webp";
import { INTRO_SESSION_KEY } from "@/lib/intro-session";
import { holdIntro, releaseIntro } from "@/lib/intro-gate";

/**
 * The loading cover.
 *
 * It stays up for as long as the page is loading and leaves once the page is
 * ready — it is not on a fixed dismiss timer. The indicator bar underneath
 * loops on a 0.55s CSS cycle for the whole time, and that cycle is the
 * "animation timing": the motion repeats rather than playing once.
 *
 * Ready means the document markup is ready and one frame has been painted
 * since, so the cover never lifts onto a blank screen. A single full cycle is
 * always allowed to play, and a hard cap stops a hung asset from trapping the
 * page.
 */
/** One loop of the bar. Mirrors `charge-sweep` in globals.css. */
const CYCLE_MS = 550;
/** Never hold the page longer than this, whatever the network does. */
const MAX_WAIT_MS = 8000;
/** Length of the fade-out; the overlay is hidden just after it. */
const FADE_MS = 200;

export function PageLoader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // Already watched in this tab. `html[data-intro="skip"]` already hides the
    // overlay before the first paint, so this only needs to let content in.
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

    // Content entrances wait behind the cover, so nothing plays unseen.
    holdIntro();
    el.hidden = false;
    el.setAttribute("aria-hidden", "false");
    el.dataset.state = "waiting";

    // Hold the page still while the cover is up.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const preventScroll = (event: Event) => event.preventDefault();
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    const startedAt = performance.now();
    let finished = false;
    let lifted = false;
    let quietTimer: ReturnType<typeof setTimeout> | undefined;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
      return id;
    };

    const teardown = () => {
      timers.forEach(clearTimeout);
      timers.clear();
      clearTimeout(quietTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("DOMContentLoaded", onLoaded);
      releaseIntro();
    };

    const done = () => {
      if (finished) return;
      finished = true;
      el.hidden = true;
      el.setAttribute("aria-hidden", "true");
      el.dataset.state = "idle";
      teardown();
    };

    /** Fade out, then remove the overlay from the layout. */
    const lift = () => {
      if (lifted || finished) return;
      lifted = true;
      el.dataset.state = "revealing";
      later(done, FADE_MS + 20);
    };

    /**
     * Leave only once the page is loaded *and* at least one full bar cycle has
     * played, so the visitor never sees a cover that flickers for 40ms.
     * `skipCycle` is for reduced motion, where there is no bar to watch.
     */
    const maybeLift = (skipCycle = false) => {
      if (lifted || finished) return;
      const played = performance.now() - startedAt;
      if (!skipCycle && played < CYCLE_MS) {
        later(maybeLift, CYCLE_MS - played);
        return;
      }
      // Two frames: the first paints the finished page, the second confirms it
      // before the cover starts to fade.
      requestAnimationFrame(() => requestAnimationFrame(lift));
    };

    function onLoaded() {
      // Reveal the hero without waiting for unrelated images or other assets.
      clearTimeout(quietTimer);
      quietTimer = later(() => maybeLift(), 100);
    }

    if (document.readyState !== "loading") {
      onLoaded();
    } else {
      document.addEventListener("DOMContentLoaded", onLoaded, { once: true });
    }

    // Backstop: a stalled request must not keep the cover up indefinitely.
    later(() => {
      if (!lifted) lift();
    }, MAX_WAIT_MS);

    // Reduced motion: the bar is already suppressed by its media query, so
    // there is no cycle to watch.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPreference = () => {
      if (reduce.matches) maybeLift(true);
    };
    reduce.addEventListener("change", onPreference);

    if (reduce.matches) maybeLift(true);

    return () => {
      reduce.removeEventListener("change", onPreference);
      if (finished) releaseIntro();
      else teardown();
    };
  }, []);

  return (
    <div ref={root} className="charge" data-state="waiting" data-lenis-prevent>
      <div className="charge__veil" aria-hidden="true" />
      <div className="charge__identity">
        <div className="charge__logo">
          <Image src={bullLogo} alt="" width={bullLogo.width} height={bullLogo.height} sizes="160px" priority unoptimized draggable={false} />
        </div>
        <div className="charge__brand">BULL<span>SHILL</span></div>
        <p className="charge__label" role="status" aria-live="polite">Preparing your experience</p>
        <div className="charge__indicator" aria-hidden="true"><span className="charge__segment" /></div>
      </div>
    </div>
  );
}
