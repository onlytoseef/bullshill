"use client";

/**
 * Single place where GSAP plugins are registered.
 *
 * Registering here rather than per-component means it happens exactly once, and
 * the explicit reference keeps bundlers from tree-shaking the plugin out of
 * production builds — a known cause of "works in dev, broken in prod".
 *
 * Safe at module scope: registerPlugin does not touch `window`, and useGSAP
 * falls back to useEffect when `window` is undefined, so this survives the
 * server render that Client Components still go through. SplitText and
 * DrawSVGPlugin only read `window`/`document` lazily inside their own
 * functions, so they are safe here too. Flip's `register` checks for
 * `document` itself and does nothing on the server, and so does Draggable's.
 * InertiaPlugin (Draggable's throw) only touches the GSAP core.
 *
 * SplitText and DrawSVGPlugin were Club GSAP plugins; since 3.13 the whole
 * former Club set ships free in the public package. No licence, no extra
 * dependency — they are already in `node_modules/gsap/`.
 */

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  Flip,
  Draggable,
  InertiaPlugin,
);

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, Flip, Draggable, useGSAP };
