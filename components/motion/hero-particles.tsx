"use client";

import { useEffect, useRef } from "react";

type Props = { className?: string; color?: string };

/** Keep the host in SSR; Three.js is not needed to hydrate the hero text. */
export function HeroParticles({ className, color = "#b6c9de" }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    const frame = requestAnimationFrame(() => {
      void import("@/lib/hero-particles").then(({ mountHeroParticles }) => {
        if (!cancelled) dispose = mountHeroParticles(host, color);
      }).catch((error: unknown) => console.warn("[hero-particles] could not load field", error));
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      dispose?.();
    };
  }, [color]);
  return <div ref={hostRef} aria-hidden className={className} />;
}
