"use client";

import { useEffect, useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Grid tile size, in px. Mirrored in `globals.css` as `--rg-cell` — the painted
 * `background-size`, the cell grid and the pulse squares all read that, so the
 * two have to agree.
 */
const CELL = 64;
/** How far the plane drifts either way across the section, in px. */
const PARALLAX = 22;
/**
 * Soft lights that come and go on their own. These are *elements*, not a class
 * toggled across the whole cell grid: the old version mutated cell classes a
 * few times a second, and since the plane is a big promoted layer every one of
 * those re-rasterised it. Twelve small boxes animating `opacity`/`transform` on
 * the compositor cost a fraction of that.
 */
const PULSES = 12;

type Layout = { cols: number; rows: number };

/**
 * Reactive 3D grid — a low-opacity perspective plane behind a section's content
 * (partners, statistics).
 *
 * Cells are 64px tiles of the plane and exist only so the pointer can fill one:
 * the grid itself is painted as a background, and the hover is a plain CSS
 * `:hover` on the cell, so nothing runs on move. The pulses and the drift are
 * the only motion — twelve composited opacity fades, plus one scrubbed
 * transform — which keeps this cheap enough to scroll past without stuttering.
 *
 * The section content is set to `pointer-events: none` so the cells actually
 * receive that hover.
 */
export function ReactiveGrid({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout>({ cols: 0, rows: 0 });

  useEffect(() => {
    const plane = planeRef.current;
    if (!plane) return;

    const measure = () => {
      const cols = Math.max(1, Math.floor(plane.clientWidth / CELL));
      const rows = Math.ceil(plane.clientHeight / CELL);
      setLayout((current) =>
        current.cols === cols && current.rows === rows
          ? current
          : { cols, rows },
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(plane);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const host = hostRef.current;
      const drift = host?.querySelector(".reactive-grid-drift");
      if (!host || !drift) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        drift,
        { y: PARALLAX },
        {
          y: -PARALLAX,
          ease: "none",
          scrollTrigger: {
            trigger: host,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: hostRef },
  );

  const cellCount = layout.cols * layout.rows;

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={className ? `reactive-grid ${className}` : "reactive-grid"}
    >
      <div className="reactive-grid-drift">
        <div ref={planeRef} className="reactive-grid-plane">
          {Array.from({ length: cellCount }, (_, index) => (
            <span key={index} className="reactive-grid-cell" />
          ))}

          {Array.from({ length: PULSES }, (_, index) => (
            <span
              key={`pulse-${index}`}
              className="reactive-grid-pulse"
              style={{
                left: `${((index * 7 + 3) % layout.cols) * CELL}px`,
                top: `${((index * 5 + 2) % layout.rows) * CELL}px`,
                animationDelay: `${-(index * 0.73).toFixed(2)}s`,
                animationDuration: `${7 + (index % 4) * 1.6}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
