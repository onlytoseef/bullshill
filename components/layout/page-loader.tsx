"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import bullLogo from "../../app/assets/images/logo.webp";
import { INTRO_SESSION_KEY } from "@/lib/intro-session";
import { holdIntro, releaseIntro } from "@/lib/intro-gate";

/**
 * The cover's whole sequence — hold, then fade — is a CSS animation on
 * `.charge` (see `charge-intro` in `globals.css`). It starts on the first
 * frame, which is the only way to keep it inside 0.4-0.6s: measured on this
 * site, hydration lands 0.4-1.0s after the cover is already visible, so a
 * JS-driven exit would have to add that on top of it.
 *
 * That leaves this component two jobs: record that the tab has seen the intro,
 * and keep the page still while the cover is up. Both are plain DOM work, done
 * from an effect that simply runs as soon as the browser gets to it.
 */
const SEQUENCE_MS = 550;

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

    // The cover is already animating. Take over the page's scroll for exactly
    // as long as it is visible.
    holdIntro();
    el.hidden = false;
    el.setAttribute("aria-hidden", "false");
    el.dataset.state = "waiting";
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const preventScroll = (event: Event) => event.preventDefault();
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      el.hidden = true;
      el.setAttribute("aria-hidden", "true");
      el.dataset.state = "idle";
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      releaseIntro();
    };

    // Matches the CSS animation, with a small margin so the fade has finished.
    const timer = setTimeout(done, SEQUENCE_MS + 60);

    // Reduced motion: the animation is already suppressed by its media query,
    // so there is nothing left to wait for.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      clearTimeout(timer);
      done();
    }

    const onPreference = () => {
      if (reduce.matches) done();
    };
    reduce.addEventListener("change", onPreference);

    return () => {
      clearTimeout(timer);
      reduce.removeEventListener("change", onPreference);
      if (!finished) {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener("wheel", preventScroll);
        window.removeEventListener("touchmove", preventScroll);
      }
      releaseIntro();
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
