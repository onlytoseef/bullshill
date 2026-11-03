"use client";

import Image from "next/image";
import { useRef } from "react";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import bitcoin from "../../app/assets/coins/Bitcoin.webp";
import dogecoin from "../../app/assets/coins/Dogecoin.webp";
import ethereum from "../../app/assets/coins/Ethereum Glass.webp";
import solana from "../../app/assets/coins/Solana-coin.webp";
import tether from "../../app/assets/coins/Tether Coin.webp";
import xrp from "../../app/assets/coins/XRP.webp";
import { useIntroReady } from "./use-intro-ready";

const COINS = [
  { id: "bitcoin", label: "Bitcoin", image: bitcoin, x: -160, y: 60, rotation: -15, delay: 0, float: 4, tilt: 0.6, duration: 4.4, depth: 0.55 },
  { id: "ethereum-left", label: "Ethereum", image: ethereum, x: -80, y: -130, rotation: -12, delay: 0.1, float: -3, tilt: -0.5, duration: 5, depth: 0.7 },
  { id: "solana", label: "Solana", image: solana, x: -50, y: 120, rotation: -10, delay: 0.2, float: 5, tilt: 0.45, duration: 4.1, depth: 0.6 },
  { id: "tether", label: "Tether", image: tether, x: 0, y: 50, rotation: 0, delay: 0.46, float: -3, tilt: -0.35, duration: 4.6, depth: 1 },
  { id: "ethereum-right", label: "Ethereum", image: ethereum, x: 70, y: -130, rotation: 12, delay: 0.18, float: -4, tilt: 0.65, duration: 3.7, depth: 0.6 },
  { id: "xrp", label: "XRP", image: xrp, x: 80, y: 120, rotation: 10, delay: 0.38, float: -4, tilt: -0.7, duration: 4.8, depth: 0.9 },
  { id: "dogecoin", label: "Dogecoin", image: dogecoin, x: 160, y: 50, rotation: 15, delay: 0.28, float: 4, tilt: 0.5, duration: 4.2, depth: 0.55 },
] as const;

export function CoinArc() {
  const container = useRef<HTMLDivElement>(null);
  const ready = useIntroReady();

  useGSAP(
    () => {
      const stage = container.current;
      if (!stage || !ready) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          always: "(min-width: 0px)",
          compact: "(max-width: 767px)",
          finePointer: "(hover: hover) and (pointer: fine)",
          motionOk: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { compact, finePointer, motionOk } = context.conditions as {
            compact: boolean;
            finePointer: boolean;
            motionOk: boolean;
          };
          const layers = COINS.map((coin) => {
            const root = stage.querySelector<HTMLElement>(`[data-coin="${coin.id}"]`)!;
            return {
              coin,
              root,
              float: root.querySelector<HTMLElement>("[data-coin-float]")!,
              parallax: root.querySelector<HTMLElement>("[data-coin-parallax]")!,
              visual: root.querySelector<HTMLElement>("[data-coin-visual]")!,
              glow: root.querySelector<HTMLElement>("[data-coin-glow]")!,
              button: root.querySelector<HTMLButtonElement>("button")!,
            };
          });
          const cleanup: (() => void)[] = [];
          for (const { button } of layers) {
            const disabled = button.disabled;
            button.disabled = true;
            cleanup.push(() => { button.disabled = disabled; });
          }

          // Reduced motion gets the complete composition immediately, with no
          // entrance, idle motion, parallax, or animated coin controls.
          if (!motionOk) return () => cleanup.forEach((dispose) => dispose());

          let assembled = false;
          let onScreen = false;
          const travel = Math.min(1, stage.clientWidth / 760) * (compact ? 0.55 : 1);
          const idle = layers.map(({ coin, float }) => gsap.to(float, {
            y: coin.float * (compact ? 0.65 : 1),
            rotation: coin.tilt,
            duration: coin.duration,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            paused: true,
          }));
          const entrance = gsap.timeline({
            paused: true,
            onComplete: () => {
              assembled = true;
              layers.forEach(({ button }) => { button.disabled = false; });
              syncPlayback();
            },
          });

          for (const { coin, root } of layers) {
            entrance.fromTo(root, {
              x: coin.x * travel,
              y: coin.y * travel,
              rotation: coin.rotation,
              scale: coin.id === "tether" ? 0.45 : 0.94,
              opacity: 0,
            }, {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
              duration: 1.1,
              ease: coin.id === "tether" ? "expo.out" : "power3.out",
            }, coin.delay);
          }

          function syncPlayback() {
            const active = onScreen && !document.hidden;
            if (active && !assembled) entrance.play();
            else entrance.pause();
            idle.forEach((animation) => {
              if (active && assembled) animation.play();
              else animation.pause();
            });
          }

          // Observe the fixed scene box, never a coin that moves during entry.
          const visibility = ScrollTrigger.create({
            trigger: stage,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => { onScreen = self.isActive; syncPlayback(); },
            onRefresh: (self) => { onScreen = self.isActive; syncPlayback(); },
          });
          onScreen = visibility.isActive;
          syncPlayback();
          document.addEventListener("visibilitychange", syncPlayback);
          cleanup.push(() => document.removeEventListener("visibilitychange", syncPlayback));

          let eventId = 0;
          const listen = <K extends keyof HTMLElementEventMap>(
            element: HTMLElement,
            event: K,
            handler: (event: HTMLElementEventMap[K]) => void,
          ) => {
            // Bind event-created tweens to this matchMedia context so resizing,
            // changing motion preferences, navigation and StrictMode clean up.
            const safe = context.add(`coin-event-${eventId++}`, handler) as typeof handler;
            element.addEventListener(event, safe);
            cleanup.push(() => element.removeEventListener(event, safe));
          };

          for (const { coin, button, visual, glow } of layers) {
            let hovered = false;
            let focused = false;
            let response: gsap.core.Timeline | null = null;
            const lifted = () => hovered || focused;
            const settle = context.add(`settle-${coin.id}`, () => {
              response?.kill();
              response = null;
              gsap.to(visual, {
                scale: lifted() ? 1.07 : 1,
                y: lifted() ? -8 : 0,
                rotationX: 0,
                rotationY: 0,
                duration: 0.35,
                ease: "power3.out",
                overwrite: true,
              });
              gsap.to(glow, { opacity: lifted() ? 1 : 0, duration: 0.35, overwrite: true });
            }) as () => void;

            if (finePointer) {
              listen(button, "pointerenter", (event) => {
                if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
                hovered = true;
                settle();
              });
              listen(button, "pointerleave", () => { hovered = false; settle(); });
            }
            listen(button, "focus", () => {
              focused = button.matches(":focus-visible");
              if (focused) settle();
            });
            listen(button, "blur", () => { focused = false; settle(); });
            listen(button, "click", () => {
              if (!assembled) return;
              response?.kill();
              gsap.killTweensOf(visual);
              gsap.to(glow, { opacity: 1, duration: 0.18, overwrite: true });
              response = gsap.timeline({
                onComplete: () => { response = null; settle(); },
              }).to(visual, {
                scale: 1.12,
                y: lifted() ? -8 : -3,
                rotationY: 18,
                rotationX: -6,
                duration: 0.18,
                ease: "power2.out",
              }).to(visual, {
                scale: () => lifted() ? 1.07 : 1,
                y: () => lifted() ? -8 : 0,
                rotationY: 0,
                rotationX: 0,
                duration: 0.4,
                ease: "power3.out",
              });
            });
          }

          if (finePointer && !compact) {
            const parallax = layers.map(({ coin, parallax: target }) => ({
              depth: coin.depth,
              x: gsap.quickTo(target, "x", { duration: 0.65, ease: "power3.out" }),
              y: gsap.quickTo(target, "y", { duration: 0.65, ease: "power3.out" }),
            }));
            listen(stage, "pointermove", (event) => {
              if (!assembled || event.pointerType !== "mouse") return;
              const rect = stage.getBoundingClientRect();
              const x = gsap.utils.clamp(-1, 1, (event.clientX - rect.left) / rect.width * 2 - 1);
              const y = gsap.utils.clamp(-1, 1, (event.clientY - rect.top) / rect.height * 2 - 1);
              parallax.forEach((coin) => { coin.x(x * 5 * coin.depth); coin.y(y * 4 * coin.depth); });
            });
            listen(stage, "pointerleave", () => {
              parallax.forEach((coin) => { coin.x(0); coin.y(0); });
            });
          }

          return () => cleanup.forEach((dispose) => dispose());
        },
      );

      return () => mm.revert();
    },
    { scope: container, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <div
      ref={container}
      className="crypto-coins-scene"
      data-coin-image
      data-ready={ready}
    >
      {COINS.map((coin) => (
        <div key={coin.id} className={`coin ${coin.id}`} data-coin={coin.id}>
          <div className="coin-layer" data-coin-parallax>
            <div className="coin-layer coin-float" data-coin-float>
              <div className="coin-layer" data-coin-visual>
                <span aria-hidden className="coin-glow" data-coin-glow />
                <Image
                  src={coin.image}
                  alt=""
                  loading="eager"
                  sizes="(max-width: 767px) 22vw, (max-width: 1535px) 190px, 225px"
                  className="coin-image"
                  draggable={false}
                />
              </div>
              <button type="button" className="coin-hit-target" aria-label={`${coin.label} coin`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
