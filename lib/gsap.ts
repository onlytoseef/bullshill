"use client";

/**
 * Shared GSAP core and ScrollTrigger registration.
 *
 * Registering here rather than per-component means it happens exactly once, and
 * the explicit reference keeps bundlers from tree-shaking the plugin out of
 * production builds — a known cause of "works in dev, broken in prod".
 *
 * Safe at module scope: registerPlugin does not touch `window`, and useGSAP
 * falls back to useEffect when `window` is undefined, so this survives the
 * server render that Client Components still go through. Feature-specific
 * plugins register in gsap-split-text, gsap-flip and gsap-draggable so unused
 * dragging and SVG tooling do not enter the homepage's startup bundle.
 */

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
);

export {
  gsap,
  ScrollTrigger,
  useGSAP,
};
