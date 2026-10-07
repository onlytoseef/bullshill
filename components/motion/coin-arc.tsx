"use client";

import Image from "next/image";
import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import coinsImage from "../../app/assets/images/coins.png";

/**
 * The supplied composite crypto coin artwork under the hero headline.
 *
 * Decorative: hidden from assistive tech.
 */
export function CoinArc() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const coinImage = container.current?.querySelector<HTMLElement>(
        "[data-coin-image]",
      );
      if (!coinImage) return;

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

          if (motionOk) {
            gsap.from(coinImage, {
              yPercent: 12,
              scale: 0.96,
              opacity: 0,
              duration: 0.9,
              ease: "back.out(1.4)",
            });
          } else {
            gsap.from(coinImage, { opacity: 0, duration: 0.4 });
          }

          if (desktop && motionOk) {
            gsap.to(coinImage, {
              yPercent: -10,
              ease: "none",
              scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          }
        },
      );

      return () => mm.revert();
    },
    { scope: container },
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
