"use client";

import Image from "next/image";
import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { replayOnScroll } from "@/lib/scroll-replay";
import coinsImage from "../../app/assets/images/coins.webp";
import { useIntroReady } from "./use-intro-ready";

export function CoinArc() {
  const container = useRef<HTMLDivElement>(null);
  const ready = useIntroReady();

  useGSAP(
    () => {
      const stage = container.current;
      const coinImage = stage?.querySelector<HTMLElement>("[data-coin-image]");
      // The entrance is mount-triggered, so without the latch it would play
      // out behind the page loader's panels. The scroll parallax below is
      // created at the same time; 1.9s later is still long before the hero
      // has scrolled anywhere, and positions are measured on creation.
      if (!stage || !coinImage || !ready) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          motionOk: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { desktop, motionOk } = context.conditions as {
            desktop: boolean;
            motionOk: boolean;
          };

          let stop: (() => void) | undefined;

          if (motionOk) {
            /**
             * Rises on `y`, not `yPercent`: the parallax below owns `yPercent`
             * and GSAP composes the two separately. Sharing one property, the
             * entrance's starting offset leaked into the parallax's recorded
             * start value and left the coins sitting low — and a replay would
             * have yanked them off wherever the parallax had scrolled them to.
             *
             * Replayed every time the arc comes back into view; observed on the
             * stage, which the animation never moves.
             */
            const rise = gsap.from(coinImage, {
              y: () => coinImage.offsetHeight * 0.12,
              scale: 0.96,
              opacity: 0,
              duration: 0.9,
              ease: "back.out(1.4)",
              paused: true,
            });
            stop = replayOnScroll(stage, {
              play: () => rise.restart(),
              reset: () => rise.pause(0),
            });
          } else {
            gsap.from(coinImage, { opacity: 0, duration: 0.4 });
          }

          if (desktop && motionOk) {
            gsap.to(coinImage, {
              yPercent: -10,
              ease: "none",
              scrollTrigger: {
                trigger: stage,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          }

          return () => stop?.();
        },
      );

      return () => mm.revert();
    },
    { scope: container, dependencies: [ready] },
  );

  return (
    <div
      ref={container}
      aria-hidden
      className="relative mx-auto aspect-[16/6] w-full max-w-5xl"
    >
      <div data-coin-image className="absolute inset-0">
        <Image
          src={coinsImage}
          alt=""
          fill
          sizes="(max-width: 768px) 130vw, 1024px"
          className="object-contain"
        />
      </div>
    </div>
  );
}
