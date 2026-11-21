"use client";

import * as THREE from "three";

/**
 * The shared grain field.
 *
 * Every section used to own a WebGL renderer, a canvas and a scene. On the
 * landing page that meant nine contexts and 17.4 megapixels of drawing buffer
 * — around 70 MB at 1x and 280 MB on a retina display — for a field that only
 * ever shows one or two sections at a time.
 *
 * There is now one renderer, one full-viewport canvas, and one scene. Each
 * section keeps its own grains, bands and aspect — so the pattern, its density
 * and its cursor response are unchanged — and passes its rectangle to the
 * shader through `uRect`, which maps the section's local 0-1 space onto the
 * part of the viewport it covers.
 *
 * The height fade the CSS `mask-image` used to do is now in the shader, and the
 * per-section element opacity (the reviews wall dims its field as the wall gets
 * deeper) is read from the host and passed as `uOpacity`.
 */

const DPR_CAP = 2;

/**
 * Ceiling on the shared buffer. One viewport at 1440x900 and DPR 2 is 5.2 MPx,
 * which is more than these 1-3px additive squares need, so it is sampled a
 * little coarser instead.
 */
const MAX_BUFFER_MPX = 3;
const MAX_BUFFER_MPX_COARSE = 1.5;
/** Never sample below this, or the squares stop reading as squares. */
const MIN_PIXEL_RATIO = 0.6;

/** Depth palette: blue → bright blue → luminous cyan → near-white cyan. */
const FAR_COLOR = new THREE.Color("#4a7fb5");
const MID_COLOR = new THREE.Color("#6fb3e0");
const NEAR_COLOR = new THREE.Color("#a5dcf5");
const ACCENT_COLOR = new THREE.Color("#d6f4ff");

const MAX_POINTS = 3200;

/** Global multiplier on the field's clock; one knob for every field. */
const TIME_SCALE = 2.5;

/**
 * The field is built from overlapping streams rather than random scatter.
 *
 * Each one has its own tilt, origin, curvature and weight, so no two run the
 * same way and nothing lines up into a single shape. `originX` and `span` keep
 * some streams to a part of the width, which is what stops the field reading as
 * one symmetric ring.
 */
const BANDS = [
  { centre: 0.14, originX: 0.02, span: 1.1, angle: -0.26, amp: 0.05, freq: 3.1, phase: 0.0, speed: 0.1, thickness: 0.17, weight: 1 },
  { centre: 0.32, originX: -0.12, span: 1.05, angle: 0.17, amp: 0.065, freq: 2.4, phase: 1.7, speed: 0.075, thickness: 0.14, weight: 0.72 },
  { centre: 0.47, originX: 0.1, span: 0.9, angle: -0.38, amp: 0.04, freq: 3.9, phase: 3.1, speed: 0.13, thickness: 0.1, weight: 0.4 },
  { centre: 0.6, originX: 0.2, span: 0.85, angle: 0.42, amp: 0.055, freq: 2.8, phase: 4.4, speed: 0.095, thickness: 0.12, weight: 0.55 },
  { centre: 0.79, originX: -0.05, span: 1.15, angle: -0.15, amp: 0.06, freq: 2.2, phase: 5.6, speed: 0.085, thickness: 0.15, weight: 0.9 },
] as const;

/**
 * Grains per million pixels. The count follows the section's area, so the
 * spacing stays the same whether a section is 500px or 1600px tall.
 */
function bandTotal(width: number, height: number) {
  const perMpx = width < 768 ? 460 : width < 1200 ? 680 : 860;
  const areaMpx = (width * height) / 1_000_000;
  return Math.round(Math.min(Math.max(areaMpx * perMpx, 140), MAX_POINTS));
}

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
};

const VERTEX = /* glsl */ `
  attribute float aDepth;
  attribute float aBright;
  attribute float aAlpha;
  attribute float aSize;

  uniform float uPixelRatio;
  /** Section rect in viewport space: xy = bottom-left, zw = size, both 0-1. */
  uniform vec4 uRect;

  varying float vAlpha;
  varying float vDepth;
  varying float vBright;
  varying float vFade;

  void main() {
    vAlpha = aAlpha;
    vDepth = aDepth;
    vBright = aBright;

    // The section's own 0-1 space, mapped onto the slice of the viewport it
    // covers. Local x is flipped-free; local y is 0 at the bottom.
    vec2 screen = uRect.xy + position.xy * uRect.zw;
    gl_Position = vec4(screen * 2.0 - 1.0, 0.0, 1.0);
    gl_PointSize = aSize * uPixelRatio;

    // The old CSS mask-image: transparent at the top and bottom edges, solid
    // across the middle 76%.
    vFade = smoothstep(0.0, 0.12, position.y) * (1.0 - smoothstep(0.88, 1.0, position.y));
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uFar;
  uniform vec3 uMid;
  uniform vec3 uNear;
  uniform vec3 uAccent;
  /** Bubbles up from the host element's computed opacity. */
  uniform float uOpacity;

  varying float vAlpha;
  varying float vDepth;
  varying float vBright;
  varying float vFade;

  void main() {
    // A hard-edged square: no mask, no feather, no glow. Points are axis
    // aligned, which is what keeps the field feeling designed.
    vec3 colour = mix(uFar, uMid, smoothstep(0.0, 0.6, vDepth));
    colour = mix(colour, uNear, smoothstep(0.55, 1.0, vDepth));
    colour = mix(colour, uAccent, step(0.97, vBright));

    gl_FragColor = vec4(colour, vAlpha * vFade * uOpacity);
  }
`;

type Grain = {
  band: number;
  u: number;
  offset: number;
  depth: number;
  sizeK: number;
  bright: number;
  phase: number;
  jitterX: number;
  jitterY: number;
};

type Field = {
  host: HTMLElement;
  grains: Grain[];
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
  points: THREE.Points;
  positions: Float32Array;
  alphas: Float32Array;
  sizes: Float32Array;
  /** CSS size of the section. */
  size: { w: number; h: number };
  aspect: number;
  /** Viewport rect, refreshed for the fields that are on screen. */
  rect: { left: number; top: number; w: number; h: number };
  opacity: number;
  grainCount: number;
};

let renderer: THREE.WebGLRenderer | null = null;
let canvas: HTMLCanvasElement | null = null;
let scene: THREE.Scene | null = null;
const camera = new THREE.Camera();
const fields = new Set<Field>();

let frame = 0;
let last = 0;
let time = 0;
let cursorX = -10;
let cursorY = -10;
let pointerX = -10;
let pointerY = -10;
const parallaxTarget = new THREE.Vector2(0, 0);
const parallax = new THREE.Vector2(0, 0);
let coarse = false;
let reduced = false;
let listening = false;
let resizeObserver: ResizeObserver | null = null;

/** Cursor influence radius, as a fraction of the viewport. */
const RADIUS = 0.32;

function ensureCanvas() {
  if (canvas) return canvas;
  canvas = document.createElement("canvas");
  canvas.className = "particle-field-canvas";
  canvas.setAttribute("aria-hidden", "true");
  // Mounted on <html>, *before* <body>, not inside it.
  //
  // Inside body it was invisible: body sets `overflow-x: clip`, and a clipped
  // ancestor clips `position: fixed` descendants — the canvas rendered but
  // every pixel was cut away.
  //
  // Prepended rather than appended so paint order works out: the body's own
  // background paints in an earlier phase than positioned elements, so the
  // canvas sits above the page colour but below every section, which is where
  // a background belongs. Appending it would paint it over the content.
  document.documentElement.insertBefore(canvas, document.body);
  return canvas;
}

function ensureRenderer() {
  if (renderer) return renderer;
  coarse = window.matchMedia("(hover: none)").matches;
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: ensureCanvas(),
      alpha: true,
      antialias: !coarse,
      powerPreference: coarse ? "default" : "high-performance",
      // The canvas covers the whole viewport, so only its own pixels matter.
      preserveDrawingBuffer: false,
    });
  } catch (error) {
    console.warn("[particles] WebGL context creation failed", error);
    renderer = null;
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  scene = new THREE.Scene();
  return renderer;
}

/** Buffer size follows the viewport, with the megapixel budget applied. */
function applySize() {
  if (!renderer) return;
  const vw = window.innerWidth || 1;
  const vh = window.innerHeight || 1;
  const budget = coarse ? MAX_BUFFER_MPX_COARSE : MAX_BUFFER_MPX;
  const wanted = Math.min(window.devicePixelRatio || 1, DPR_CAP);
  const areaMpx = (vw * vh) / 1_000_000;
  const allowed = areaMpx > 0 ? Math.sqrt(budget / areaMpx) : wanted;
  const ratio = Math.max(MIN_PIXEL_RATIO, Math.min(wanted, allowed));
  const changed =
    renderer.getPixelRatio() !== ratio ||
    canvas!.width !== Math.round(vw * ratio) ||
    canvas!.height !== Math.round(vh * ratio);
  if (!changed) return;
  renderer.setPixelRatio(ratio);
  renderer.setSize(vw, vh, false);
  canvas!.style.width = "100%";
  canvas!.style.height = "100%";
}

function build(field: Field) {
  field.grains.length = 0;
  const total = Math.min(bandTotal(field.size.w, field.size.h), MAX_POINTS);
  const weightSum = BANDS.reduce((sum, band) => sum + band.weight, 0);

  BANDS.forEach((band, bandIndex) => {
    const share = Math.round((band.weight / weightSum) * total);
    for (let i = 0; i < share; i += 1) {
      if (field.grains.length >= MAX_POINTS) break;
      const roll = Math.random();
      const depth =
        roll < 0.55
          ? Math.random() * 0.33
          : roll < 0.88
            ? 0.33 + Math.random() * 0.42
            : 0.75 + Math.random() * 0.25;
      field.grains.push({
        band: bandIndex,
        u: Math.random(),
        offset: (Math.random() + Math.random() - 1) * band.thickness,
        depth,
        sizeK: 1.7 + Math.random() * 0.6 + depth * 0.8,
        bright: Math.random(),
        phase: Math.random() * Math.PI * 2,
        jitterX: (Math.random() - 0.5) * 0.012,
        jitterY: (Math.random() - 0.5) * 0.012,
      });
    }
  });

  const depthAttr = new Float32Array(MAX_POINTS);
  const brightAttr = new Float32Array(MAX_POINTS);
  field.grainCount = 0;
  for (const grain of field.grains) {
    depthAttr[field.grainCount] = grain.depth;
    brightAttr[field.grainCount] = grain.bright;
    field.grainCount += 1;
  }
  field.geometry.setAttribute("aDepth", new THREE.BufferAttribute(depthAttr, 1));
  field.geometry.setAttribute("aBright", new THREE.BufferAttribute(brightAttr, 1));
  field.geometry.setDrawRange(0, field.grainCount);
  field.geometry.attributes.aDepth.needsUpdate = true;
  field.geometry.attributes.aBright.needsUpdate = true;
}

/** Positions, alphas and sizes for one field, in its own 0-1 space. */
function updateField(field: Field) {
  if (!renderer) return;
  const { grains, positions, alphas, sizes, grainCount, aspect } = field;
  const radiusSq = RADIUS * RADIUS;
  const rect = field.rect;
  const vw = window.innerWidth || 1;
  const vh = window.innerHeight || 1;

  // The pointer in this section's own coordinates. Outside the section it is
  // parked far away so no grain is influenced.
  let px = -10;
  let py = -10;
  if (rect.w > 0 && rect.h > 0 && pointerX > -1) {
    px = (pointerX * vw - rect.left) / rect.w;
    py = 1 - (pointerY * vh - rect.top) / rect.h;
  }
  cursorX += (px - cursorX) * 0.075;
  cursorY += (py - cursorY) * 0.075;

  for (let i = 0; i < grainCount; i += 1) {
    const grain = grains[i];
    const band = BANDS[grain.band];

    const angle = grain.u * band.freq + band.phase + time * band.speed;
    const wobble =
      Math.sin(angle) * band.amp +
      Math.sin(angle * 2.17 + band.phase * 1.7) * band.amp * 0.35;

    const along = grain.u * band.span;
    const cos = Math.cos(band.angle);
    const sin = Math.sin(band.angle);
    const lateral = wobble + grain.offset;

    let x = band.originX + along * cos - lateral * sin + grain.jitterX;
    let y = band.centre + along * sin + lateral * cos + grain.jitterY;

    x += Math.sin(time * 0.27 + grain.phase) * 0.0014;
    y += Math.cos(time * 0.23 + grain.phase * 1.3) * 0.0014;

    x += parallax.x * grain.depth * 0.005;
    y += parallax.y * grain.depth * 0.005;

    const dx = (x - cursorX) * aspect;
    const dy = y - cursorY;
    const distSq = dx * dx + dy * dy;

    let influence = 0;
    if (distSq < radiusSq) {
      influence = 1 - Math.sqrt(distSq) / RADIUS;
      influence *= influence;
      const dist = Math.sqrt(distSq) || 1;
      const push = influence * (0.006 + grain.depth * 0.014);
      x += (dx / dist) * push / aspect - (dy / dist) * push * 0.4;
      y += (dy / dist) * push + (dx / dist) * push * 0.4;
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = 0;

    const ex = (x - 0.5) / 0.44;
    const ey = (y - 0.5) / 0.38;
    const distortion =
      Math.sin(x * 4.6 + y * 3.1 + time * 0.11) * 0.1 +
      Math.sin(y * 6.2 - x * 2.4 + time * 0.07) * 0.075;
    const radial = Math.hypot(ex, ey) + distortion;
    const centreFade = 0.5 + 0.5 * smoothstep(0.24, 0.92, radial);

    const density =
      0.85 + 0.15 * (0.5 + 0.5 * Math.sin(x * 3.1 + y * 2.3 + time * 0.06));

    const b = grain.bright;
    const base =
      b < 0.72 ? 0.46 + grain.depth * 0.32 : b < 0.97 ? 0.72 + grain.depth * 0.26 : 1;

    alphas[i] = Math.min(1, base * centreFade * density * (1 + influence * 1.3));
    sizes[i] = grain.sizeK * (1 + influence * 0.35);
  }

  const geo = field.geometry;
  (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  (geo.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;
  (geo.attributes.aSize as THREE.BufferAttribute).needsUpdate = true;
}

function render() {
  if (!renderer || !scene) return;
  const vw = window.innerWidth || 1;
  const vh = window.innerHeight || 1;
  let anyVisible = false;

  for (const field of fields) {
    const rect = field.host.getBoundingClientRect();
    field.rect.left = rect.left;
    field.rect.top = rect.top;
    field.rect.w = rect.width;
    field.rect.h = rect.height;

    // Skip anything off screen: both the field and its geometry work.
    if (rect.bottom < -80 || rect.top > vh + 80 || rect.width === 0) {
      field.points.visible = false;
      continue;
    }
    anyVisible = true;
    field.points.visible = true;

    const uniforms = field.material.uniforms;
    uniforms.uRect.value.set(
      rect.left / vw,
      (vh - rect.bottom) / vh,
      rect.width / vw,
      rect.height / vh,
    );
    uniforms.uOpacity.value = field.opacity;
    uniforms.uPixelRatio.value = renderer.getPixelRatio();

    updateField(field);
  }

  if (!anyVisible) {
    // Nothing to draw, but the canvas still holds the last frame. Clear it so
    // an off-screen field cannot leave grains frozen on screen — the whole page
    // would otherwise show a stale snapshot as it scrolls.
    renderer.setScissorTest(false);
    renderer.clear(true, false, false);
    return;
  }
  renderer.render(scene, camera);
}

function loop(now: number) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  time += dt * TIME_SCALE;

  parallax.x += (parallaxTarget.x - parallax.x) * 0.04;
  parallax.y += (parallaxTarget.y - parallax.y) * 0.04;

  render();
  frame = requestAnimationFrame(loop);
}

function start() {
  if (frame !== 0 || reduced) return;
  last = performance.now();
  frame = requestAnimationFrame(loop);
}

function stop() {
  if (frame === 0) return;
  cancelAnimationFrame(frame);
  frame = 0;
}

function onPointerMove(event: PointerEvent) {
  pointerX = event.clientX / (window.innerWidth || 1);
  pointerY = event.clientY / (window.innerHeight || 1);
  parallaxTarget.set(
    (event.clientX / (window.innerWidth || 1) - 0.5) * 2,
    -(event.clientY / (window.innerHeight || 1) - 0.5) * 2,
  );
}

function onPointerLeave() {
  pointerX = -10;
  pointerY = -10;
  parallaxTarget.set(0, 0);
}

function onResize() {
  applySize();
  for (const field of fields) {
    const w = field.host.clientWidth || 1;
    const h = field.host.clientHeight || 1;
    if (w !== field.size.w || h !== field.size.h) {
      field.size.w = w;
      field.size.h = h;
      field.aspect = w / Math.max(h, 1);
      build(field);
    }
  }
  if (reduced) {
    // A still field still has to be drawn once at the new size.
    render();
  }
}

function listen() {
  if (listening) return;
  listening = true;
  applySize();
  window.addEventListener("resize", onResize);
  if (!coarse) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
  }
  document.addEventListener("visibilitychange", onVisibility);
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => onResize());
  }
  start();
}

function unlisten() {
  if (!listening) return;
  listening = false;
  stop();
  window.removeEventListener("resize", onResize);
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerleave", onPointerLeave);
  document.removeEventListener("visibilitychange", onVisibility);
  resizeObserver?.disconnect();
  resizeObserver = null;
  canvas?.remove();
  canvas = null;
  renderer?.dispose();
  renderer = null;
  scene = null;
}

function onVisibility() {
  if (document.hidden) stop();
  else start();
}

/**
 * Registers a section's field.
 *
 * The host element is only a measuring stick now — it keeps its place in the
 * layout (and its mask/opacity styles, which are read back) while the drawing
 * happens on the shared canvas.
 */
export function registerField(host: HTMLElement) {
  ensureRenderer();
  if (!renderer || !scene) return () => {};

  const w = host.clientWidth || 1;
  const h = host.clientHeight || 1;

  const positions = new Float32Array(MAX_POINTS * 3);
  const alphas = new Float32Array(MAX_POINTS);
  const sizes = new Float32Array(MAX_POINTS);

  const geometry = new THREE.BufferGeometry();
  const positionAttr = new THREE.BufferAttribute(positions, 3);
  const alphaAttr = new THREE.BufferAttribute(alphas, 1);
  const sizeAttr = new THREE.BufferAttribute(sizes, 1);
  positionAttr.setUsage(THREE.DynamicDrawUsage);
  alphaAttr.setUsage(THREE.DynamicDrawUsage);
  sizeAttr.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("position", positionAttr);
  geometry.setAttribute("aAlpha", alphaAttr);
  geometry.setAttribute("aSize", sizeAttr);
  geometry.setAttribute("aDepth", new THREE.BufferAttribute(new Float32Array(MAX_POINTS), 1));
  geometry.setAttribute("aBright", new THREE.BufferAttribute(new Float32Array(MAX_POINTS), 1));
  geometry.setDrawRange(0, 0);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uPixelRatio: { value: renderer.getPixelRatio() },
      uRect: { value: new THREE.Vector4(0, 0, 1, 1) },
      uOpacity: { value: 1 },
      uFar: { value: FAR_COLOR },
      uMid: { value: MID_COLOR },
      uNear: { value: NEAR_COLOR },
      uAccent: { value: ACCENT_COLOR },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);

  const field: Field = {
    host,
    grains: [],
    geometry,
    material,
    points,
    positions,
    alphas,
    sizes,
    size: { w, h },
    aspect: w / Math.max(h, 1),
    rect: { left: 0, top: 0, w, h },
    opacity: 1,
    grainCount: 0,
  };

  build(field);
  fields.add(field);
  resizeObserver?.observe(host);

  // The reviews wall tweens the host's opacity as the wall gets deeper. Watch
  // its style attribute and feed the value to the shader instead of polling
  // `getComputedStyle` every frame.
  const readOpacity = () => {
    const value = Number(getComputedStyle(host).opacity);
    field.opacity = Number.isFinite(value) ? value : 1;
  };
  readOpacity();
  const styleObserver = new MutationObserver(readOpacity);
  styleObserver.observe(host, { attributes: true, attributeFilter: ["style", "class"] });

  listen();
  if (reduced) render();

  return () => {
    styleObserver.disconnect();
    resizeObserver?.unobserve(host);
    fields.delete(field);
    scene?.remove(points);
    geometry.dispose();
    material.dispose();
    if (fields.size === 0) unlisten();
  };
}
