"use client";

import { useRef } from "react";

import { heroCoins } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";

// Arc geometry, all in percentages so the whole thing scales with its
// container and needs no resize handling.
const SPAN = 80; // horizontal % of the container the arc occupies
const ARC_TOP = 8; // % from top at the outer edges
const ARC_DEPTH = 34; // extra % the centre dips below the edges
const COIN_SIZE = 17; // coin diameter as % of container width
const EDGE_SHRINK = 0.14; // outer coins render this much smaller

/**
 * Normalised horizontal position for coin `index`, from -1 (far left) through
 * 0 (centre) to 1 (far right).
 */
function normalised(index: number, total: number) {
  return total === 1 ? 0 : (index / (total - 1)) * 2 - 1;
}

/**
 * The overlapping arc of crypto coins under the hero headline.
 *
 * Coins are currently gradient placeholders — swap the inner div for an
 * <Image> once renders land in `public/assets/images/`. The layout maths is
 * independent of the artwork, so nothing here needs to change.
 *
 * Decorative: hidden from assistive tech.
 */
export function CoinArc() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const coins = gsap.utils.toArray<HTMLElement>("[data-coin]");
      if (coins.length === 0) return;

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
            // Entrance: outward from the centre, so the arc "unfolds".
            gsap.from(coins, {
              yPercent: 40,
              scale: 0.75,
              opacity: 0,
              duration: 0.9,
              ease: "back.out(1.4)",
              stagger: { each: 0.07, from: "center" },
            });
          } else {
            gsap.from(coins, { opacity: 0, duration: 0.4, stagger: 0.04 });
          }

          // Scrubbed parallax is the expensive part — desktop only.
          if (desktop && motionOk) {
            coins.forEach((coin, index) => {
              const offset = Math.abs(normalised(index, coins.length));
              // Centre coins read as closest, so they travel furthest.
              const depth = 1 - offset * 0.5;

              gsap.to(coin, {
                yPercent: -22 * depth,
                ease: "none",
                scrollTrigger: {
                  trigger: container.current,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              });
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
      // `@container` so the coin glyphs can size in cqw and stay proportional
      // once max-w-5xl stops the arc growing with the viewport.
      className="@container relative mx-auto aspect-[16/6] w-full max-w-5xl"
    >
      {heroCoins.map((coin, index) => {
        const x = normalised(index, heroCoins.length);
        const left = 50 + x * (SPAN / 2);
        const top = ARC_TOP + ARC_DEPTH * (1 - x * x);
        const scale = 1 - EDGE_SHRINK * Math.abs(x);

        return (
          <div
            key={coin.name}
            data-coin
            className="absolute aspect-square rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${COIN_SIZE * scale}%`,
              // Negative margins centre the coin on its point. Percentage
              // margins resolve against the container width in both axes, and
              // the coin is square, so the same value works for each. Doing it
              // this way leaves `transform` entirely to GSAP.
              marginLeft: `${(-COIN_SIZE * scale) / 2}%`,
              marginTop: `${(-COIN_SIZE * scale) / 2}%`,
              // Centre coins sit in front.
              zIndex: Math.round((1 - Math.abs(x)) * 10),
            }}
          >
            <div
              className="grid size-full place-items-center rounded-full ring-1 shadow-2xl ring-white/15"
              style={{
                backgroundImage: `radial-gradient(circle at 32% 26%, ${coin.from}, ${coin.to})`,
              }}
            >
              <span
                className="leading-none font-semibold text-white/90 drop-shadow"
                style={{ fontSize: "clamp(0.75rem, 3.2cqw, 2.25rem)" }}
              >
                {coin.symbol}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
