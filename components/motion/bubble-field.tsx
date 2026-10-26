"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * One fixed canvas for every `.bubble-zone` section on the page, so five
 * sections cost one WebGL context rather than five.
 *
 * The field is a single `THREE.Points` draw call — the cheap instanced path for
 * thousands of small sprites, since points share one geometry and one material
 * and the per-bubble variation lives in vertex attributes. The orbital rings are
 * two `LineLoop`s with a handful of node points; their travelling pulse is a
 * per-vertex alpha in the shader, so a pulse costs no geometry at all.
 *
 * Scoping: the canvas covers the viewport, but a vertical `mask-image` built
 * from the rects of the zones currently on screen clips it to those bands, so
 * nothing here can appear in a section it does not belong to. All bubble motion
 * — wander, depth parallax, scroll response, edge fade — is computed in the
 * vertex shader from two uniforms, so a frame costs a couple of draw calls and
 * effectively no CPU work.
 */

const FOV = 55;
const CAMERA_Z = 6;
const TAU = Math.PI * 2;
/** One bubble per this many square pixels of viewport, within the caps. */
const AREA_PER_BUBBLE = 16000;
const MIN_BUBBLES = 34;
const MAX_BUBBLES = 120;
/** Buffers are cheap here (tiny points), but this is on screen a long time. */
const DPR_CAP = 1.5;
const PIXEL_BUDGET = 2_200_000;

const COLOR_BLUE = "#9dc0ff";
const COLOR_CYAN = "#8fd8ff";
const COLOR_ORANGE = "#e8750a";

const BUBBLE_VERTEX = /* glsl */ `
  attribute float aPx;
  attribute float aPhase;
  attribute float aRate;
  uniform float uTime;
  uniform float uScroll;
  uniform float uPixelRatio;
  uniform float uCameraZ;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    vec3 p = position;

    // Wander: each bubble carries its own rate and phase, so no two paths line
    // up and the drift never reads as a single moving field.
    p.x += sin(uTime * aRate + aPhase) * 0.55;
    p.y += cos(uTime * aRate * 0.82 + aPhase * 1.7) * 0.65;
    p.z += sin(uTime * aRate * 0.6 + aPhase * 2.3) * 0.3;

    // Depth parallax: the nearer the bubble, the further the scroll carries it.
    float depth = (p.z + 1.8) / 3.6;
    p.y += uScroll * (0.16 + depth * 0.34);
    p.x += uScroll * 0.07 * (depth - 0.5);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    // aPx is the intended CSS-pixel size at the focal plane, so the perspective
    // divide keeps it honest at every depth.
    gl_PointSize = aPx * uPixelRatio * (uCameraZ / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    // Thin out towards the frame edges so nothing is sliced off on the border.
    vec2 ndc = gl_Position.xy / gl_Position.w;
    vAlpha = smoothstep(1.15, 0.6, length(vec2(ndc.x * 0.8, ndc.y)));
    // A deterministic seed — picks the bubbles that get the orange highlight.
    vSeed = aPhase;
  }
`;

const BUBBLE_FRAGMENT = /* glsl */ `
  uniform vec3 uBlue;
  uniform vec3 uOrange;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    // Glass: a soft fill, a brighter rim right at the edge, and one specular
    // glint up and to the left, as if lit from above.
    float fill = smoothstep(0.5, 0.12, d) * 0.16;
    float rim = smoothstep(0.3, 0.5, d) * 0.5;
    float glint = smoothstep(0.24, 0.0, length(uv - vec2(-0.15, -0.16))) * 0.5;

    // Roughly one bubble in seven takes the muted brand highlight.
    vec3 tint = mix(uBlue, uOrange, step(0.86, fract(vSeed * 0.618)));

    float alpha = (fill + rim + glint) * vAlpha * 0.72;
    gl_FragColor = vec4(tint, alpha);
  }
`;

/**
 * The ring's stroke is its own alpha ramp: a narrow bright head with a soft
 * trail, slid around the circle by `uTime`, under a slow envelope so the pulse
 * arrives, crosses and fades instead of running at a constant strength forever.
 */
const RING_VERTEX = /* glsl */ `
  attribute float aAngle;
  uniform float uTime;
  uniform float uLap;
  uniform float uRate;
  uniform float uBase;
  uniform float uGain;
  varying float vBase;
  varying float vPulse;

  const float TAU = 6.2831853;
  const float PI = 3.1415927;

  void main() {
    float head = mod(uTime * uLap, TAU);
    // Shortest signed arc from this vertex to the pulse head.
    float d = mod(aAngle - head + PI, TAU) - PI;
    float core = exp(-d * d * 16.0);
    float trail = exp(-abs(d) * 1.7) * 0.32;

    float cycle = fract(uTime * uRate);
    float envelope =
      smoothstep(0.0, 0.18, cycle) * (1.0 - smoothstep(0.82, 1.0, cycle));

    vBase = uBase;
    vPulse = (core + trail) * uGain * envelope;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* Kept as two weights rather than one colour, so a ring can hold a cyan stroke
   while an orange pulse rides along it. */
const RING_FRAGMENT = /* glsl */ `
  uniform vec3 uStroke;
  uniform vec3 uPulseColor;
  varying float vBase;
  varying float vPulse;

  void main() {
    float alpha = vBase + vPulse;
    float weight = clamp(vPulse / max(alpha, 0.0001), 0.0, 1.0);
    gl_FragColor = vec4(mix(uStroke, uPulseColor, weight), alpha);
  }
`;

const NODE_VERTEX = /* glsl */ `
  uniform float uPixelRatio;
  uniform float uCameraZ;
  uniform float uPx;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uPx * uPixelRatio * (uCameraZ / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const NODE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float mask = smoothstep(0.5, 0.04, d);
    if (mask <= 0.0) discard;
    gl_FragColor = vec4(uColor, mask * uAlpha);
  }
`;

/** Bounds of a viewport band, top-down. */
type Band = { top: number; bottom: number };

type RingConfig = {
  radius: number;
  x: number;
  y: number;
  z: number;
  tiltX: number;
  tiltY: number;
  /** Radians per second the ring itself turns — deliberately glacial. */
  spin: number;
  /** Radians per second the pulse travels. */
  lap: number;
  /** Pulses per second, for the fade envelope. */
  rate: number;
  base: number;
  gain: number;
  stroke: string;
  pulse: string;
  nodeAngles: number[];
  nodePx: number;
  nodeAlpha: number;
};

/** Ratio the ring scale is tuned against, so phones get a smaller orbit. */
const RING_ASPECT = 1.6;

export function BubbleField({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const zones = Array.from(
      document.querySelectorAll<HTMLElement>(".bubble-zone"),
    );
    if (zones.length === 0) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.z = CAMERA_Z;

    const halfHeight = Math.tan((FOV * Math.PI) / 360) * CAMERA_Z;
    const clamp = (v: number, min: number, max: number) =>
      Math.min(Math.max(v, min), max);

    /** Every material that has to track the drawing buffer's ratio. */
    const ratioUniforms: { value: number }[] = [];
    const disposables: { dispose: () => void }[] = [];

    // ---------------------------------------------------------------- bubbles

    const count = clamp(
      Math.round((window.innerWidth * window.innerHeight) / AREA_PER_BUBBLE),
      MIN_BUBBLES,
      MAX_BUBBLES,
    );

    const positions = new Float32Array(count * 3);
    const pixels = new Float32Array(count);
    const phases = new Float32Array(count);
    const rates = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const p = i * 3;
      positions[p] = (Math.random() * 2 - 1) * halfHeight * 1.5;
      positions[p + 1] = (Math.random() * 2 - 1) * halfHeight;
      positions[p + 2] = Math.random() * 3.6 - 1.8;
      // Mostly small, with the occasional larger bubble.
      pixels[i] =
        Math.random() < 0.88 ? 4 + Math.random() * 8 : 15 + Math.random() * 5;
      phases[i] = Math.random() * Math.PI * 2;
      rates[i] = 0.1 + Math.random() * 0.22;
    }

    const bubbleGeometry = new THREE.BufferGeometry();
    bubbleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    bubbleGeometry.setAttribute("aPx", new THREE.BufferAttribute(pixels, 1));
    bubbleGeometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    bubbleGeometry.setAttribute("aRate", new THREE.BufferAttribute(rates, 1));

    const bubbleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uBlue: { value: new THREE.Color(COLOR_BLUE) },
        uOrange: { value: new THREE.Color(COLOR_ORANGE) },
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uCameraZ: { value: CAMERA_Z },
      },
      vertexShader: BUBBLE_VERTEX,
      fragmentShader: BUBBLE_FRAGMENT,
      transparent: true,
      depthWrite: false,
    });

    ratioUniforms.push(bubbleMaterial.uniforms.uPixelRatio);
    disposables.push(bubbleGeometry, bubbleMaterial);

    const bubbles = new THREE.Points(bubbleGeometry, bubbleMaterial);
    // Driven entirely in the shader and spread wider than the frame, so cull
    // nothing.
    bubbles.frustumCulled = false;
    scene.add(bubbles);

    // ------------------------------------------------------------------ rings

    const buildRing = (config: RingConfig) => {
      const group = new THREE.Group();
      group.position.set(config.x, config.y, config.z);
      group.rotation.set(config.tiltX, config.tiltY, 0);

      const segments = 256;
      const ringPositions = new Float32Array(segments * 3);
      const ringAngles = new Float32Array(segments);
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * TAU;
        ringPositions[i * 3] = Math.cos(angle) * config.radius;
        ringPositions[i * 3 + 1] = Math.sin(angle) * config.radius;
        ringAngles[i] = angle;
      }

      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(ringPositions, 3),
      );
      lineGeometry.setAttribute(
        "aAngle",
        new THREE.BufferAttribute(ringAngles, 1),
      );

      const lineMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uStroke: { value: new THREE.Color(config.stroke) },
          uPulseColor: { value: new THREE.Color(config.pulse) },
          uLap: { value: config.lap },
          uRate: { value: config.rate },
          uBase: { value: config.base },
          uGain: { value: config.gain },
        },
        vertexShader: RING_VERTEX,
        fragmentShader: RING_FRAGMENT,
        transparent: true,
        depthWrite: false,
      });

      const line = new THREE.LineLoop(lineGeometry, lineMaterial);
      line.frustumCulled = false;
      group.add(line);

      // A few glowing nodes riding along the same path.
      const nodePositions = new Float32Array(config.nodeAngles.length * 3);
      config.nodeAngles.forEach((angle, index) => {
        nodePositions[index * 3] = Math.cos(angle) * config.radius;
        nodePositions[index * 3 + 1] = Math.sin(angle) * config.radius;
      });

      const nodeGeometry = new THREE.BufferGeometry();
      nodeGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(nodePositions, 3),
      );

      const nodeMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(COLOR_CYAN) },
          uAlpha: { value: config.nodeAlpha },
          uPx: { value: config.nodePx },
          uPixelRatio: { value: renderer.getPixelRatio() },
          uCameraZ: { value: CAMERA_Z },
        },
        vertexShader: NODE_VERTEX,
        fragmentShader: NODE_FRAGMENT,
        transparent: true,
        depthWrite: false,
      });

      ratioUniforms.push(nodeMaterial.uniforms.uPixelRatio);
      disposables.push(lineGeometry, lineMaterial, nodeGeometry, nodeMaterial);

      const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
      nodes.frustumCulled = false;
      group.add(nodes);

      scene.add(group);
      return { group, lineMaterial, baseY: config.y, spin: config.spin };
    };

    // Oversized on purpose: each spans well past the viewport so it reads as a
    // fragment of a much larger orbit. One carries an orange pulse, so the
    // brand accent appears on the move rather than sitting still.
    const rings = [
      buildRing({
        radius: 3,
        x: -1.5,
        y: 0.8,
        z: -1.4,
        tiltX: -0.28,
        tiltY: 0.2,
        spin: 0.02,
        lap: 0.16,
        rate: 0.07,
        base: 0.11,
        gain: 0.8,
        stroke: COLOR_CYAN,
        pulse: COLOR_CYAN,
        nodeAngles: [0.6, 2.4, 4.3],
        nodePx: 5.5,
        nodeAlpha: 0.75,
      }),
      buildRing({
        radius: 2.1,
        x: 1.7,
        y: -0.9,
        z: -0.5,
        tiltX: 0.22,
        tiltY: -0.16,
        spin: -0.014,
        lap: -0.12,
        rate: 0.055,
        base: 0.09,
        gain: 0.85,
        stroke: COLOR_CYAN,
        pulse: COLOR_ORANGE,
        nodeAngles: [1.2, 3.9],
        nodePx: 5,
        nodeAlpha: 0.65,
      }),
    ];

    // -------------------------------------------------------------- lifecycle

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w === 0 || h === 0) return;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const ratio = clamp(
        Math.min(
          window.devicePixelRatio || 1,
          DPR_CAP,
          Math.sqrt(PIXEL_BUDGET / Math.max(w * h, 1)),
        ),
        0.6,
        DPR_CAP,
      );
      renderer.setPixelRatio(ratio);
      renderer.setSize(w, h);
      ratioUniforms.forEach((uniform) => {
        uniform.value = ratio;
      });

      // Narrow viewports get a smaller orbit, so the rings stay proportionate
      // instead of swallowing the whole screen.
      const scale = clamp(camera.aspect / RING_ASPECT, 0.55, 1);
      rings.forEach((ring) => ring.group.scale.setScalar(scale));
    };

    /**
     * Clip the canvas to the parts of the page that actually want bubbles. All
     * bands run the full width, so one vertical gradient with hard stops is
     * enough — no polygon union needed.
     */
    const applyZones = () => {
      const vh = window.innerHeight;
      const found: Band[] = [];

      // Queried fresh every time rather than off the mount-time snapshot: a
      // section that streams in after the effect ran would otherwise never be
      // masked in, and the whole field would stay invisible.
      for (const zone of document.querySelectorAll<HTMLElement>(".bubble-zone")) {
        const rect = zone.getBoundingClientRect();
        const top = clamp(rect.top, 0, vh);
        const bottom = clamp(rect.bottom, 0, vh);
        if (bottom - top > 1) found.push({ top, bottom });
      }

      found.sort((a, b) => a.top - b.top);

      const bands: Band[] = [];
      for (const band of found) {
        const last = bands[bands.length - 1];
        // Touching or overlapping bands merge, so no hairline seam shows.
        if (last && band.top <= last.bottom + 1) {
          last.bottom = Math.max(last.bottom, band.bottom);
        } else {
          bands.push({ ...band });
        }
      }

      if (bands.length === 0) {
        // Nothing to draw behind: blank the mask and park the loop.
        host.style.setProperty("mask-image", "none");
        host.style.setProperty("-webkit-mask-image", "none");
        host.style.opacity = "0";
        return false;
      }

      const stops: string[] = [];
      let cursor = 0;
      for (const band of bands) {
        if (band.top > cursor) {
          stops.push(`transparent ${cursor}px`, `transparent ${band.top}px`);
        }
        stops.push(`#000 ${band.top}px`, `#000 ${band.bottom}px`);
        cursor = band.bottom;
      }
      stops.push(`transparent ${cursor}px`);

      const mask = `linear-gradient(to bottom, ${stops.join(", ")})`;
      host.style.setProperty("mask-image", mask);
      host.style.setProperty("-webkit-mask-image", mask);
      host.style.opacity = "1";
      return true;
    };

    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    let running = false;
    let last = performance.now();
    let active = false;

    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const time = (bubbleMaterial.uniforms.uTime.value + dt) % 3600;
      bubbleMaterial.uniforms.uTime.value = time;
      // Bounded, scroll-linked drift — parallax without wandering off-screen.
      const scroll = Math.sin(window.scrollY * 0.0016) * 0.45;
      bubbleMaterial.uniforms.uScroll.value = scroll;

      for (const ring of rings) {
        ring.lineMaterial.uniforms.uTime.value = time;
        ring.group.rotation.z += ring.spin * dt;
        // The orbits share the page's parallax, a touch stronger for depth.
        ring.group.position.y = ring.baseY + scroll * 0.5;
      }

      renderer.render(scene, camera);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      if (frame !== 0) cancelAnimationFrame(frame);
      frame = 0;
    };

    // Re-derives the mask, then starts or parks the loop to match.
    const sync = () => {
      active = applyZones();
      if (reduced) return;
      if (active && !document.hidden) start();
      else stop();
    };

    let pending = 0;
    const onScroll = () => {
      if (pending !== 0) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        sync();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) stop();
      else sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    sync();
    if (reduced && active) {
      // One still frame: no drift, no travelling pulses.
      renderer.render(scene, camera);
    }

    return () => {
      stop();
      if (pending !== 0) cancelAnimationFrame(pending);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={className ? `bubble-field ${className}` : "bubble-field"}
    />
  );
}
