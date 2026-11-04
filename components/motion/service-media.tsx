"use client";

import { useRef, type ReactNode } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { replayOnScroll } from "@/lib/scroll-replay";

export function ServiceMedia({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = ref.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add({
      mobile: "(max-width: 767px)",
      desktop: "(min-width: 768px)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      if (context.conditions?.reduced) return;
      const mobile = context.conditions?.mobile;
      const targets = mobile ? Array.from(root.children) : [root];
      const hidden = { opacity: 0, x: mobile ? 0 : 32, y: mobile ? 16 : 0 };
      gsap.set(targets, hidden);
      const entrance = gsap.to(targets, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.6,
        delay: mobile ? 0 : 0.1,
        stagger: mobile ? 0.14 : 0,
        ease: "power3.out",
        paused: true,
      });
      return replayOnScroll(root, {
        play: () => { entrance.restart(true); },
        reset: () => { entrance.pause(0); },
      });
    });
    return () => media.revert();
  }, { scope: ref });

  return <div ref={ref} className="services-media">{children}</div>;
}
