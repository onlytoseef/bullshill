"use client";

import { useEffect, useState, type RefObject } from "react";

/** Start enhancement one viewport ahead, and retain it for the whole visit. */
export function useNearViewport(ref: RefObject<Element | null>) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => setReady(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setReady(true);
      observer.disconnect();
    }, { rootMargin: "100% 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return ready;
}
