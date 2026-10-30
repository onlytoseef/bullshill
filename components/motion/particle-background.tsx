"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const DPR_CAP = 2;

/** Depth palette: blue → bright blue → luminous cyan → near-white cyan. */
const FAR_COLOR = new THREE.Color("#4a7fb5");
const MID_COLOR = new THREE.Color("#6fb3e0");
const NEAR_COLOR = new THREE.Color("#a5dcf5");
const ACCENT_COLOR = new THREE.Color("#d6f4ff");

const MAX_POINTS = 3200;

/**
 * The field is built from overlapping streams rather than random scatter.
 *
 * Each one has its own tilt, origin, curvature and weight, so no two run the
 * same way and nothing lines up into a single shape. `originX` and `span` keep
 * some streams to a part of the width, which is what stops the field reading as
 * one symmetric ring.
 */
const BANDS = [
  {
    centre: 0.14,
    originX: 0.02,
    span: 1.1,
    angle: -0.26,
    amp: 0.05,
    freq: 3.1,
    phase: 0.0,
    speed: 0.1,
    thickness: 0.17,
    weight: 1,
  },
  {
    centre: 0.32,
    originX: -0.12,
    span: 1.05,
    angle: 0.17,
    amp: 0.065,
    freq: 2.4,
    phase: 1.7,
    speed: 0.075,
    thickness: 0.14,
    weight: 0.72,
  },
  {
    centre: 0.47,
    originX: 0.1,
    span: 0.9,
    angle: -0.38,
    amp: 0.04,
    freq: 3.9,
    phase: 3.1,
    speed: 0.13,
    thickness: 0.1,
    weight: 0.4,
  },
  {
    centre: 0.6,
    originX: 0.2,
    span: 0.85,
    angle: 0.42,
    amp: 0.055,
    freq: 2.8,
    phase: 4.4,
    speed: 0.095,
    thickness: 0.12,
    weight: 0.55,
  },
  {
    centre: 0.79,
    originX: -0.05,
    span: 1.15,
    angle: -0.15,
    amp: 0.06,
    freq: 2.2,
    phase: 5.6,
    speed: 0.085,
    thickness: 0.15,
    weight: 0.9,
  },
] as const;

/**
 * Grains per million pixels. The count follows the section's area, so the
 * spacing stays the same whether a section is 500px or 1600px tall — a fixed
 * count would read as a full field in a short section and as nothing in a tall
 * one.
 */
function bandTotal(width: number, height: number) {
  const perMpx = width < 768 ? 460 : width < 1200 ? 680 : 860;
  const areaMpx = (width * height) / 1_000_000;
  return Math.round(
    Math.min(Math.max(areaMpx * perMpx, 140), MAX_POINTS),
  );
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

  varying float vAlpha;
  varying float vDepth;
  varying float vBright;

  void main() {
    vAlpha = aAlpha;
    vDepth = aDepth;
    vBright = aBright;

    gl_Position = vec4(position.xy * 2.0 - 1.0, 0.0, 1.0);
    gl_PointSize = aSize * uPixelRatio;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uFar;
  uniform vec3 uMid;
  uniform vec3 uNear;
  uniform vec3 uAccent;

  varying float vAlpha;
  varying float vDepth;
  varying float vBright;

  void main() {
    // A hard-edged square: no mask, no feather, no glow. Points are axis
    // aligned, which is what keeps the field feeling designed.
    vec3 colour = mix(uFar, uMid, smoothstep(0.0, 0.6, vDepth));
    colour = mix(colour, uNear, smoothstep(0.55, 1.0, vDepth));
    colour = mix(colour, uAccent, step(0.97, vBright));

    gl_FragColor = vec4(colour, vAlpha);
  }
`;

type Grain = {
  /** Which stream it belongs to. */
  band: number;
  /** Position along the stream, 0–1. */
  u: number;
  /** Distance across the stream, denser along its centre line. */
  offset: number;
  depth: number;
  sizeK: number;
  bright: number;
  /** Its own tiny phase, only for imperfections. */
  phase: number;
  /** Fixed positional jitter — controlled irregularity, never wandering. */
  jitterX: number;
  jitterY: number;
};

/**
 * A structured data-grain field behind a section.
 *
 * Particles are not scattered: each one belongs to a broad curved band, keeps
 * its slot along that band, and is animated with it. Neighbours therefore stay
 * neighbours, which is what makes the field read as a designed texture instead
 * of noise. The bands drift at slightly different speeds and shapes, and a soft
 * elliptical mask thins the field towards the middle so copy keeps a clean
 * ground.
 *
 * The cursor bends the field locally and lifts nearby grains; because every
 * position is derived from its band slot each frame, releasing it returns the
 * grain exactly to its place in the pattern.
 */
export function ParticleBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    /**
     * Phones get a cheaper context on purpose. `antialias` asks for MSAA and
     * `high-performance` asks for a discrete GPU; on a mobile driver either can
     * make context creation fail outright, and this component mounts once per
     * section, so a failure here is a whole background going white.
     */
    const coarse = window.matchMedia("(hover: none)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !coarse,
        powerPreference: coarse ? "default" : "high-performance",
      });
    } catch (error) {
      console.warn("[particles] WebGL context creation failed", error);
      return;
    }

    renderer.domElement.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      // A lost context can composite as opaque white on mobile. Removing the
      // dead canvas leaves the section's own background visible until the
      // browser hands the context back.
      renderer.domElement.style.display = "none";
      console.warn("[particles] WebGL context lost — this section's field stops");
    });
    renderer.domElement.addEventListener("webglcontextrestored", () => {
      renderer.domElement.style.display = "block";
      console.info("[particles] WebGL context restored");
    });

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const size = { w: 1, h: 1 };
    const grains: Grain[] = [];

    const positions = new Float32Array(MAX_POINTS * 3);
    const alphas = new Float32Array(MAX_POINTS);
    const sizes = new Float32Array(MAX_POINTS);
    // Only the first grainTotal slots are ever used.
    const depthAttr = new Float32Array(MAX_POINTS);
    const brightAttr = new Float32Array(MAX_POINTS);

    const uniforms = {
      uPixelRatio: { value: renderer.getPixelRatio() },
      uFar: { value: FAR_COLOR },
      uMid: { value: MID_COLOR },
      uNear: { value: NEAR_COLOR },
      uAccent: { value: ACCENT_COLOR },
    };

    const geometry = new THREE.BufferGeometry();
    const positionAttr = new THREE.BufferAttribute(positions, 3);
    const alphaAttr = new THREE.BufferAttribute(alphas, 1);
    const sizeAttr = new THREE.BufferAttribute(sizes, 1);
    positionAttr.setUsage(THREE.DynamicDrawUsage);
    alphaAttr.setUsage(THREE.DynamicDrawUsage);
    sizeAttr.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("position", positionAttr);
    geometry.setAttribute("aDepth", new THREE.BufferAttribute(depthAttr, 1));
    geometry.setAttribute("aBright", new THREE.BufferAttribute(brightAttr, 1));
    geometry.setAttribute("aAlpha", alphaAttr);
    geometry.setAttribute("aSize", sizeAttr);
    geometry.setDrawRange(0, 0);

    const material = new THREE.ShaderMaterial({
      uniforms,
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

    let grainCount = 0;

    // ---- build: grains are dealt into bands, not scattered --------------
    const build = () => {
      grains.length = 0;

      const total = Math.min(
        bandTotal(size.w, size.h),
        MAX_POINTS,
      );
      const weightSum = BANDS.reduce((sum, band) => sum + band.weight, 0);

      BANDS.forEach((band, bandIndex) => {
        const share = Math.round((band.weight / weightSum) * total);

        for (let i = 0; i < share; i += 1) {
          if (grains.length >= MAX_POINTS) break;

          const roll = Math.random();
          const depth =
            roll < 0.55
              ? Math.random() * 0.33
              : roll < 0.88
                ? 0.33 + Math.random() * 0.42
                : 0.75 + Math.random() * 0.25;

          grains.push({
            band: bandIndex,
            u: Math.random(),
            // Triangular distribution: dense along the band's centre line,
            // thinning towards its edges, so each band has a soft profile.
            offset:
              (Math.random() + Math.random() - 1) * band.thickness,
            depth,
            // Tiny, with only a little variation: 1.7 – 3.1px.
            sizeK: 1.7 + Math.random() * 0.6 + depth * 0.8,
            bright: Math.random(),
            phase: Math.random() * Math.PI * 2,
            // A fixed ±0.6% nudge: enough to break the perfect rows, far too
            // small to read as randomness.
            jitterX: (Math.random() - 0.5) * 0.012,
            jitterY: (Math.random() - 0.5) * 0.012,
          });
        }
      });

      grainCount = 0;
      for (const grain of grains) {
        depthAttr[grainCount] = grain.depth;
        brightAttr[grainCount] = grain.bright;
        grainCount += 1;
      }

      geometry.attributes.aDepth.needsUpdate = true;
      geometry.attributes.aBright.needsUpdate = true;
      geometry.setDrawRange(0, grainCount);
    };

    const pointer = new THREE.Vector2(-10, -10);
    const cursor = new THREE.Vector2(-10, -10);
    const parallaxTarget = new THREE.Vector2(0, 0);
    const parallax = new THREE.Vector2(0, 0);

    /** Cursor influence radius, as a fraction of the viewport. */
    const RADIUS = 0.32;

    let time = 0;

    const draw = () => {
      cursor.x += (pointer.x - cursor.x) * 0.075;
      cursor.y += (pointer.y - cursor.y) * 0.075;
      parallax.x += (parallaxTarget.x - parallax.x) * 0.04;
      parallax.y += (parallaxTarget.y - parallax.y) * 0.04;

      const aspect = size.w / Math.max(size.h, 1);
      const radiusSq = RADIUS * RADIUS;

      for (let i = 0; i < grainCount; i += 1) {
        const grain = grains[i];
        const band = BANDS[grain.band];

        // The stream's curve, animated: every grain in it moves together.
        const angle = grain.u * band.freq + band.phase + time * band.speed;
        const wobble =
          Math.sin(angle) * band.amp +
          Math.sin(angle * 2.17 + band.phase * 1.7) * band.amp * 0.35;

        // Along the stream, rotated by its own tilt, so the rows run in
        // different directions instead of stacking into one symmetric oval.
        const along = grain.u * band.span;
        const cos = Math.cos(band.angle);
        const sin = Math.sin(band.angle);
        const lateral = wobble + grain.offset;

        let x = band.originX + along * cos - lateral * sin + grain.jitterX;
        let y = band.centre + along * sin + lateral * cos + grain.jitterY;

        // A hair of independent movement, so the rows never look mechanical.
        x += Math.sin(time * 0.27 + grain.phase) * 0.0014;
        y += Math.cos(time * 0.23 + grain.phase * 1.3) * 0.0014;

        x += parallax.x * grain.depth * 0.005;
        y += parallax.y * grain.depth * 0.005;

        const dx = (x - cursor.x) * aspect;
        const dy = y - cursor.y;
        const distSq = dx * dx + dy * dy;

        let influence = 0;

        if (distSq < radiusSq) {
          // Bend, not scatter: a soft push with a slight twist, small enough
          // that the band still reads as a band.
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

        // Clean centre, but not a clean ellipse: two slow waves distort the
        // boundary, so the held-back zone has an uneven, organic edge instead
        // of reading as a ring.
        const ex = (x - 0.5) / 0.44;
        const ey = (y - 0.5) / 0.38;
        const distortion =
          Math.sin(x * 4.6 + y * 3.1 + time * 0.11) * 0.1 +
          Math.sin(y * 6.2 - x * 2.4 + time * 0.07) * 0.075;
        const radial = Math.hypot(ex, ey) + distortion;
        const centreFade = 0.5 + 0.5 * smoothstep(0.24, 0.92, radial);

        // Broad, slow density variation across the field. The floor is high, so
        // the field covers the whole section and never drops to holes.
        const density =
          0.85 +
          0.15 * (0.5 + 0.5 * Math.sin(x * 3.1 + y * 2.3 + time * 0.06));

        const b = grain.bright;
        const base =
          b < 0.72
            ? 0.46 + grain.depth * 0.32
            : b < 0.97
              ? 0.72 + grain.depth * 0.26
              : 1;

        alphas[i] = Math.min(
          1,
          base * centreFade * density * (1 + influence * 1.3),
        );
        sizes[i] = grain.sizeK * (1 + influence * 0.35);
      }

      positionAttr.needsUpdate = true;
      alphaAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;
    };

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;

      const changed = w !== size.w || h !== size.h || grainCount === 0;
      size.w = w;
      size.h = h;

      renderer.setSize(w, h);
      uniforms.uPixelRatio.value = renderer.getPixelRatio();

      if (changed) {
        build();
        draw();
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Section heights settle once fonts and images land, and that does not
    // always fire a window resize — so watch the host itself.
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => resize());
      observer.observe(host);
    }

    if (reduced) {
      renderer.render(scene, camera);
      return () => {
        observer?.disconnect();
        window.removeEventListener("resize", resize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    let onMove: ((event: PointerEvent) => void) | undefined;
    let onLeave: (() => void) | undefined;

    if (!coarse) {
      onMove = (event: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        pointer.set(
          (event.clientX - rect.left) / rect.width,
          1 - (event.clientY - rect.top) / rect.height,
        );

        parallaxTarget.set(
          (event.clientX / window.innerWidth - 0.5) * 2,
          -(event.clientY / window.innerHeight - 0.5) * 2,
        );
      };

      onLeave = () => {
        pointer.set(-10, -10);
        parallaxTarget.set(0, 0);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }

    let frame = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;

      draw();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (frame !== 0) return;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (frame === 0) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(host);

    const onVisibility = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      if (onMove) window.removeEventListener("pointermove", onMove);
      if (onLeave) window.removeEventListener("pointerleave", onLeave);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="particle-background" aria-hidden />;
}
