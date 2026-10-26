"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { ScrollTrigger } from "@/lib/gsap";

type Props = {
  className?: string;
};

/** Field setup. The cloud sits on the z = 0 plane at `CAMERA_Z`. */
const FOV = 55;
const CAMERA_Z = 6;
/**
 * Drawing buffer is capped by *pixels*, not just DPR: the Services section is
 * far taller than the viewport, so `inset-0` makes for a big canvas and a fixed
 * 2x ratio would be millions of wasted fragments. On small screens the same
 * formula still lets DPR climb toward 2, so phones stay crisp.
 */
const DPR_MAX = 2;
const PIXEL_BUDGET = 2_600_000;
/** One point per this many square pixels of the canvas, within the caps. */
const AREA_PER_POINT = 11000;
const MIN_POINTS = 70;
const MAX_POINTS = 220;
/** Target average number of connectors per point — drives the link radius. */
const DESIRED_NEIGHBOURS = 2.4;
/** Hard ceiling on segments, so a dense frame can never grow the buffer. */
const MAX_SEGMENTS_PER_POINT = 3;
/** Base drift, in world units per second. */
const DRIFT = 0.07;
/** How quickly an impulse decays back to the base drift. */
const VELOCITY_DAMPING = 1.5;
/** Cursor influence: radius in world units, and the push it applies. */
const POINTER_RADIUS = 1.15;
const POINTER_FORCE = 2.6;
/** Point size scale, applied through the perspective divide. */
const SIZE_BASE = 26;
const COLOR_BLUE = "#3f7dff";
const COLOR_CYAN = "#6fe3ff";

const POINT_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aTint;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying float vTint;

  void main() {
    vAlpha = aAlpha;
    vTint = aTint;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (${SIZE_BASE}.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const POINT_FRAGMENT = /* glsl */ `
  uniform vec3 uBlue;
  uniform vec3 uCyan;
  uniform float uGlow;
  varying float vAlpha;
  varying float vTint;

  void main() {
    // Soft round dot: fade from the centre so the square point never shows.
    float d = length(gl_PointCoord - 0.5);
    float mask = smoothstep(0.5, 0.06, d);
    if (mask <= 0.0) discard;
    gl_FragColor = vec4(mix(uBlue, uCyan, vTint), mask * vAlpha * uGlow);
  }
`;

const LINE_VERTEX = /* glsl */ `
  attribute float aAlpha;
  varying float vAlpha;

  void main() {
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const LINE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uGlow;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(uColor, vAlpha * uGlow);
  }
`;

/** One soft cyan blob, stretched across the sprite. Generated once. */
function makeGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(130, 230, 255, 0.5)");
  gradient.addColorStop(0.35, "rgba(90, 190, 255, 0.2)");
  gradient.addColorStop(1, "rgba(60, 130, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * A drifting network of blue/cyan particles with thin lines to their close
 * neighbours, behind the Services cards.
 *
 * Only the visible slice matters, so the field is seeded across the whole
 * section while the link radius is derived from the point density — that keeps
 * the average degree steady whether the section is short or several screens
 * tall, and keeps the pair loop bounded. Everything it needs is allocated once;
 * the per-frame work only writes into the existing arrays.
 *
 * The cursor pushes nearby points with a damped impulse (never a snap), a soft
 * cyan blob trails it, and a scroll trigger fades the whole layer in and nudges
 * the drift and glow as the section moves through the viewport. Touch-only
 * devices skip the pointer work entirely, and the loop parks itself when the
 * section is off screen or the tab is hidden.
 */
export function ServiceNetwork({ className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      // No WebGL: fall back to the CSS glow (see `.services-network--fallback`).
      host.classList.add("services-network--fallback");
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Coarse, hover-less pointers (phones/tablets) get no cursor coupling.
    const touchOnly = window.matchMedia(
      "(hover: none) and (pointer: coarse)",
    ).matches;

    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.z = CAMERA_Z;

    // Field half-extents on the z = 0 plane; matches the plane the cursor maps
    // onto, and the wrap volume, so it has to track resizes.
    const bounds = { w: 1, h: 1, linkRadius: 0.4 };
    const clamp = (v: number, min: number, max: number) =>
      Math.min(Math.max(v, min), max);
    const halfHeight = Math.tan((FOV * Math.PI) / 360) * CAMERA_Z;

    const measure = () => {
      const { clientWidth: w, clientHeight: h } = host;
      bounds.h = halfHeight * 1.12;
      bounds.w = halfHeight * (w / Math.max(h, 1)) * 1.12;
      return w * h;
    };

    const count = clamp(
      Math.round(measure() / AREA_PER_POINT),
      MIN_POINTS,
      MAX_POINTS,
    );

    // Link radius from density, so the average degree is stable regardless of
    // how tall the section is. `(2w · 2h)` is the field area.
    const fieldArea = bounds.w * bounds.h * 4;
    bounds.linkRadius = Math.sqrt(
      (DESIRED_NEIGHBOURS * fieldArea) / (Math.PI * count),
    );

    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);
    const tints = new Float32Array(count);
    // Base drift (never mutated) and the live velocity damped back toward it.
    const baseVelocity = new Float32Array(count * 3);
    const velocity = new Float32Array(count * 3);

    const seed = () => {
      for (let i = 0; i < count; i++) {
        const p = i * 3;
        positions[p] = (Math.random() * 2 - 1) * bounds.w;
        positions[p + 1] = (Math.random() * 2 - 1) * bounds.h;
        // Depth, so nearer points are larger, faster and more connected.
        positions[p + 2] = Math.random() * 3.6 - 2.2;
        const speed = DRIFT * (0.5 + (positions[p + 2] + 2.2) / 3.6);
        baseVelocity[p] = (Math.random() * 2 - 1) * speed;
        baseVelocity[p + 1] = (Math.random() * 2 - 1) * speed;
        baseVelocity[p + 2] = (Math.random() * 2 - 1) * speed * 0.3;
        velocity[p] = baseVelocity[p];
        velocity[p + 1] = baseVelocity[p + 1];
        velocity[p + 2] = baseVelocity[p + 2];
        sizes[i] = 0.35 + Math.random() * 0.85;
        alphas[i] = 0.3 + Math.random() * 0.5;
        tints[i] = Math.random();
      }
    };
    seed();

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    pointGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    pointGeometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
    pointGeometry.setAttribute("aTint", new THREE.BufferAttribute(tints, 1));

    const pointMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uBlue: { value: new THREE.Color(COLOR_BLUE) },
        uCyan: { value: new THREE.Color(COLOR_CYAN) },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uGlow: { value: 0 },
      },
      vertexShader: POINT_VERTEX,
      fragmentShader: POINT_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(pointGeometry, pointMaterial);
    points.frustumCulled = false;
    scene.add(points);

    // Preallocated connectors; each frame only a prefix is drawn.
    const maxSegments = count * MAX_SEGMENTS_PER_POINT;
    const linePositions = new Float32Array(maxSegments * 6);
    const lineAlphas = new Float32Array(maxSegments * 2);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3),
    );
    lineGeometry.setAttribute("aAlpha", new THREE.BufferAttribute(lineAlphas, 1));
    lineGeometry.setDrawRange(0, 0);

    const lineMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(COLOR_CYAN) },
        uGlow: { value: 0 },
      },
      vertexShader: LINE_VERTEX,
      fragmentShader: LINE_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    lines.frustumCulled = false;
    scene.add(lines);

    // Cursor blob. Built even when unused so its texture is disposed with the
    // rest; it simply stays at zero opacity on touch-only devices.
    const glowTexture = makeGlowTexture();
    const glowMaterial = new THREE.SpriteMaterial({
      map: glowTexture ?? undefined,
      color: new THREE.Color(COLOR_CYAN),
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    });
    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.set(2.6, 2.6, 1);
    glow.position.z = 0.4;
    scene.add(glow);

    // Scroll state, written by ScrollTrigger and read by the render loop.
    const scroll = { fade: reduced ? 1 : 0, drift: reduced ? 0.5 : 0 };
    const triggers: ScrollTrigger[] = [];

    if (!reduced) {
      // Fades in as the section climbs into view…
      triggers.push(
        ScrollTrigger.create({
          trigger: host,
          start: "top 90%",
          end: "top 40%",
          onUpdate: (self) => {
            scroll.fade = self.progress;
          },
          onRefresh: (self) => {
            scroll.fade = self.progress;
          },
        }),
        // …while the drift/glow keep responding across the whole pass.
        ScrollTrigger.create({
          trigger: host,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            scroll.drift = self.progress;
          },
          onRefresh: (self) => {
            scroll.drift = self.progress;
          },
        }),
      );
    }

    const pointer = { x: 0, y: 0, active: false };
    const pointerWorld = new THREE.Vector3();
    const glowTarget = { x: 0, y: 0, opacity: 0 };

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      pointer.x = nx;
      pointer.y = ny;
      pointer.active = true;
      const halfW = halfHeight * camera.aspect;
      glowTarget.x = nx * halfW;
      glowTarget.y = ny * halfHeight;
      glowTarget.opacity = 1;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      glowTarget.opacity = 0;
    };

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w === 0 || h === 0) return;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const ratio = clamp(
        Math.min(
          window.devicePixelRatio || 1,
          DPR_MAX,
          Math.sqrt(PIXEL_BUDGET / Math.max(w * h, 1)),
        ),
        0.6,
        DPR_MAX,
      );
      renderer.setPixelRatio(ratio);
      renderer.setSize(w, h);
      pointMaterial.uniforms.uPixelRatio.value = ratio;

      // Rescale the existing field so a resize does not re-roll it.
      const beforeW = bounds.w;
      const beforeH = bounds.h;
      measure();
      const sx = bounds.w / beforeW;
      const sy = bounds.h / beforeH;
      for (let i = 0; i < count; i++) {
        const p = i * 3;
        positions[p] *= sx;
        positions[p + 1] *= sy;
      }
      pointGeometry.attributes.position.needsUpdate = true;

      const fieldAreaNow = bounds.w * bounds.h * 4;
      bounds.linkRadius = Math.sqrt(
        (DESIRED_NEIGHBOURS * fieldAreaNow) / (Math.PI * count),
      );
    };

    /** Advance positions and rebuild the connector buffer for this frame. */
    const update = (dt: number, time: number) => {
      // Glow eases in with scroll and breathes a little as it advances.
      const drift = scroll.drift;
      const glowLevel = scroll.fade * (0.85 + drift * 0.35);
      pointMaterial.uniforms.uGlow.value = glowLevel;
      lineMaterial.uniforms.uGlow.value = glowLevel * 0.75;

      const halfW = halfHeight * camera.aspect;
      if (pointer.active) {
        pointerWorld.set(pointer.x * halfW, pointer.y * halfHeight, 0);
      }

      const pointerRadiusSq = POINTER_RADIUS * POINTER_RADIUS;
      const damp = Math.min(1, VELOCITY_DAMPING * dt);
      const speedScale = 0.6 + drift * 0.8;

      for (let i = 0; i < count; i++) {
        const p = i * 3;

        if (pointer.active) {
          const dx = positions[p] - pointerWorld.x;
          const dy = positions[p + 1] - pointerWorld.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < pointerRadiusSq && dSq > 1e-6) {
            const d = Math.sqrt(dSq);
            const push = POINTER_FORCE * (1 - d / POINTER_RADIUS) * dt;
            velocity[p] += (dx / d) * push;
            velocity[p + 1] += (dy / d) * push;
          }
        }

        // Damp every axis back toward the base drift, so impulses settle out
        // instead of accumulating into jitter.
        velocity[p] += (baseVelocity[p] - velocity[p]) * damp;
        velocity[p + 1] += (baseVelocity[p + 1] - velocity[p + 1]) * damp;
        velocity[p + 2] += (baseVelocity[p + 2] - velocity[p + 2]) * damp;

        positions[p] += velocity[p] * dt * speedScale;
        positions[p + 1] += velocity[p + 1] * dt * speedScale;
        positions[p + 2] += velocity[p + 2] * dt * speedScale;

        if (positions[p] > bounds.w) positions[p] = -bounds.w;
        else if (positions[p] < -bounds.w) positions[p] = bounds.w;
        if (positions[p + 1] > bounds.h) positions[p + 1] = -bounds.h;
        else if (positions[p + 1] < -bounds.h) positions[p + 1] = bounds.h;
        if (positions[p + 2] > 1.6) positions[p + 2] = -2.2;
        else if (positions[p + 2] < -2.2) positions[p + 2] = 1.6;
      }

      pointGeometry.attributes.position.needsUpdate = true;

      // Connectors: straight pair scan, bounded by the segment cap. Points are
      // in a shallow box, so the distance test is a cheap 3D comparison.
      const linkRadius = bounds.linkRadius;
      const linkRadiusSq = linkRadius * linkRadius;
      let segment = 0;
      for (let i = 0; i < count && segment < maxSegments; i++) {
        const a = i * 3;
        for (let j = i + 1; j < count && segment < maxSegments; j++) {
          const b = j * 3;
          const dx = positions[a] - positions[b];
          const dy = positions[a + 1] - positions[b + 1];
          const dz = positions[a + 2] - positions[b + 2];
          const dSq = dx * dx + dy * dy + dz * dz * 1.6;
          if (dSq >= linkRadiusSq) continue;

          const t = segment * 6;
          linePositions[t] = positions[a];
          linePositions[t + 1] = positions[a + 1];
          linePositions[t + 2] = positions[a + 2];
          linePositions[t + 3] = positions[b];
          linePositions[t + 4] = positions[b + 1];
          linePositions[t + 5] = positions[b + 2];

          // Fade with distance, so links die out rather than pop.
          const alpha = (1 - Math.sqrt(dSq) / linkRadius) * 0.5;
          lineAlphas[segment * 2] = alpha;
          lineAlphas[segment * 2 + 1] = alpha;
          segment++;
        }
      }

      if (segment > 0) {
        lineGeometry.setDrawRange(0, segment * 2);
        lineGeometry.attributes.position.needsUpdate = true;
        lineGeometry.attributes.aAlpha.needsUpdate = true;
      } else {
        lineGeometry.setDrawRange(0, 0);
      }

      // Cursor blob trails the pointer with a soft ease, and only shows once
      // the field itself has faded in.
      if (glowTarget.opacity > 0 && scroll.fade > 0.01) {
        const ease = Math.min(1, 6 * dt);
        glow.position.x += (glowTarget.x - glow.position.x) * ease;
        glow.position.y += (glowTarget.y - glow.position.y) * ease;
        glowMaterial.opacity +=
          (glowTarget.opacity * scroll.fade * 0.9 - glowMaterial.opacity) * ease;
      } else {
        glowMaterial.opacity += (0 - glowMaterial.opacity) * Math.min(1, 6 * dt);
      }
      // Gentle breathing so the blob is never perfectly static.
      glow.scale.setScalar(2.5 + Math.sin(time * 0.0012) * 0.25);
    };

    resize();
    window.addEventListener("resize", resize);

    if (!touchOnly) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave);
    }

    let frame = 0;
    let running = false;
    let last = performance.now();

    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      update(dt, now);
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

    if (reduced) {
      // One still frame, no loop and no cursor coupling — the scene at rest.
      update(0, performance.now());
      renderer.render(scene, camera);
    } else {
      start();
    }

    // Park the loop while the section is off screen. Skipped under
    // reduced-motion, which stays on its single still frame.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (reduced) return;
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    observer.observe(host);

    // …and while the tab is in the background.
    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      triggers.forEach((trigger) => trigger.kill());
      pointGeometry.dispose();
      pointMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      glowTexture?.dispose();
      glowMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      host.classList.remove("services-network--fallback");
    };
  }, []);

  return <div ref={hostRef} aria-hidden className={className} />;
}
