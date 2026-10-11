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

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ anchors: true }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
