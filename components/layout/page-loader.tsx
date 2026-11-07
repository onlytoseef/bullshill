"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useRef, useTransition } from "react";

import bullLogo from "../../app/assets/images/logo.webp";
import { gsap } from "@/lib/gsap";
import { holdIntro, releaseIntro } from "@/lib/intro-gate";

type Controller = { begin: () => void; ready: () => void };

/** One persistent overlay. React owns navigation; GSAP owns the motion. */
export function PageLoader() {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, navigate] = useTransition();
  const maskId = useId().replace(/:/g, "");
  const root = useRef<HTMLDivElement>(null);
  const controller = useRef<Controller | null>(null);
  const target = useRef("");
  const ownedNavigation = useRef(false);
  const committedPath = useRef(pathname);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
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
        const completion = gsap.timeline({ onComplete: done });
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
      // Enough time to finish the introduction, without a fixed loading delay.
      finishTimer = setTimeout(finish, preference.matches ? 0 : Math.max(0, 380 - (performance.now() - started)));
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
    controller.current = { begin, ready: markReady };
    begin();
    const image = el.querySelector("img");
    void (image?.decode().catch(() => {}) ?? Promise.resolve()).then(() => {
      if (!disposed && !target.current) markReady();
    });

    return () => {
      disposed = true;
      clearTimeout(finishTimer);
      clearTimeout(recoveryTimer);
      context?.revert();
      controller.current = null;
      unlock();
      releaseIntro();
      preference.removeEventListener("change", onPreference);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  useEffect(() => {
    if (ownedNavigation.current && !pending) {
      ownedNavigation.current = false;
      controller.current?.ready();
    }
  }, [pending, pathname]);

  useEffect(() => {
    if (committedPath.current !== pathname) {
      committedPath.current = pathname;
      if (!ownedNavigation.current) controller.current?.ready();
    }
  }, [pathname]);

  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
      if (/^\/(admin|api)(\/|$)/.test(url.pathname)) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      event.preventDefault();
      target.current = url.href;
      ownedNavigation.current = true;
      controller.current?.begin();
      // This site's internal links use push navigation. Next's concurrent
      // transition settles with the committed route (including redirect/error UI).
      navigate(() => router.push(url.pathname + url.search + url.hash));
    };
    const pop = () => {
      if (location.pathname === committedPath.current) return;
      target.current = location.href;
      ownedNavigation.current = false;
      controller.current?.begin();
    };
    document.addEventListener("click", click, true);
    window.addEventListener("popstate", pop);
    return () => {
      document.removeEventListener("click", click, true);
      window.removeEventListener("popstate", pop);
    };
  }, [router, navigate]);

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
        <button type="button" className="charge__recovery" hidden onClick={() => location.assign(target.current || location.href)}>
          Taking longer than expected. Retry navigation
        </button>
      </div>
    </div>
  );
}
