import type { CSSProperties } from "react";

/**
 * Projected city positions, in the map's own 1000x500 space (equirectangular,
 * the same projection the SVG asset was generated with), so the routes and the
 * dotted land can share a viewBox and stay aligned.
 */
const CITIES = {
  newyork: [294.4, 136.9],
  london: [499.6, 106.9],
  lagos: [509.4, 231.9],
  dubai: [653.5, 180],
  singapore: [788.4, 246.2],
  tokyo: [888, 150.9],
  sydney: [920, 344.1],
  saopaulo: [370.5, 315.4],
} as const;

type CityName = keyof typeof CITIES;

/** Trimmed to the populated latitudes — matches `<FooterMap>`'s asset. */
const VIEW_BOX = "0 17 1000 400";

/**
 * A gentle arc between two points: the midpoint pushed out along the normal, so
 * the link reads as a flight path rather than a straight wire.
 */
function arc(from: CityName, to: CityName, lift = 0.18) {
  const [x1, y1] = CITIES[from];
  const [x2, y2] = CITIES[to];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = (x1 + x2) / 2 - dy * lift;
  const cy = (y1 + y2) / 2 + dx * lift;
  return `M${x1} ${y1}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2} ${y2}`;
}

const ROUTES: { d: string; tone: "navy" | "orange" }[] = [
  { d: arc("newyork", "london"), tone: "orange" },
  { d: arc("london", "dubai"), tone: "navy" },
  { d: arc("dubai", "singapore"), tone: "orange" },
  { d: arc("singapore", "sydney"), tone: "navy" },
  { d: arc("newyork", "saopaulo"), tone: "navy" },
  { d: arc("saopaulo", "lagos"), tone: "orange" },
  { d: arc("tokyo", "dubai"), tone: "navy" },
];

/**
 * The footer's animated world map.
 *
 * The dotted land is a prebuilt SVG asset (a land clipPath with round-capped
 * dashes inside it), so the coastlines are real without thousands of DOM nodes.
 * The routes are drawn over it in an SVG that shares the asset's viewBox, which
 * is what keeps the two aligned; the pulses and the slow drift are pure CSS, so
 * this stays a server component and nothing runs per frame.
 *
 * Decorative throughout: `aria-hidden`, `pointer-events: none`, and behind the
 * footer content — the logo, copy, socials, form, watermark and legal links all
 * sit in the layer above it.
 */
export function FooterMap({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={className ? `footer-map ${className}` : "footer-map"}
    >
      <div className="footer-map-drift">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/images/world-map.svg"
          alt=""
          className="footer-map-land"
        />

        <svg className="footer-map-routes" viewBox={VIEW_BOX} fill="none">
          {ROUTES.map((route, index) => (
            <g
              key={route.d}
              className="footer-route"
              style={{ "--i": index } as CSSProperties}
            >
              <path
                className="footer-route-line"
                d={route.d}
                pathLength={100}
              />
              <path
                className={`footer-route-pulse footer-route-pulse--${route.tone}`}
                d={route.d}
                pathLength={100}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
