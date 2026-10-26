"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  className?: string;
  /** Particle tint. Defaults to the site's light text tone. */
  color?: string;
};

/** Camera / field setup. The cloud lives on the z = 0 plane at `CAMERA_Z`. */
const FOV = 55;
const CAMERA_Z = 6;
/** Roughly one point per this many square pixels of the host, within the caps. */
const AREA_PER_POINT = 2200;
const MIN_POINTS = 280;
const MAX_POINTS = 1800;
/** Device pixel ratio is capped so retina phones do not render 3x the work. */
const DPR_CAP = 2;
/** Points-per-second the field drifts, and how fast it chases the cursor. */
const DRIFT = 0.045;
const PARALLAX_LERP = 0.045;
const PARALLAX_TILT = 0.16;
/** World-space radius of the cursor's push, and how hard it pushes. */
const POINTER_RADIUS = 1.6;
const POINTER_PUSH = 3.2;
/** Point size scale (world units) applied through the perspective divide. */
const SIZE_BASE = 24;

const VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  uniform float uPixelRatio;
  varying float vAlpha;

  void main() {
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (${SIZE_BASE}.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    // Soft round granule: fade from the centre so the square point never shows.
    float d = length(gl_PointCoord - 0.5);
    float mask = smoothstep(0.5, 0.12, d);
    if (mask <= 0.0) discard;
    gl_FragColor = vec4(uColor, mask * vAlpha);
  }
`;

/**
 * A drifting field of glowing granules behind the hero, drawn with three.js.
 *
 * The pointer drives it two ways: the whole cloud tilts toward the cursor
 * (parallax, so nearer points travel further) and points inside a small radius
 * of it are shoved outward, settling back as the cursor moves on.
 *
 * It degrades safely — no WebGL, a thrown context, or `prefers-reduced-motion`
 * all leave a single still frame instead of an animated one — and it pauses
 * its render loop whenever the hero scrolls out of view. The loop is cleaned
 * up fully on unmount (disposables, listeners, canvas) so it cannot leak.
 */
export function HeroParticles({ className, color = "#e8ebee" }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.z = CAMERA_Z;

    const group = new THREE.Group();
    scene.add(group);

    // Field half-extents on the z = 0 plane, so the wrap volume tracks resize
    // (and matches the plane the pointer is mapped onto).
    const bounds = { w: 1, h: 1 };
    const clamp = (v: number, min: number, max: number) =>
      Math.min(Math.max(v, min), max);

    const measure = () => {
      const { clientWidth: w, clientHeight: h } = host;
      const halfH = Math.tan((FOV * Math.PI) / 360) * CAMERA_Z;
      const halfW = halfH * (w / Math.max(h, 1));
      // A touch beyond the frame so points do not pop at the edges.
      bounds.w = halfW * 1.15;
      bounds.h = halfH * 1.15;
      return w * h;
    };

    const count = clamp(
      Math.round(measure() / AREA_PER_POINT),
      MIN_POINTS,
      MAX_POINTS,
    );

    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    const seed = () => {
      for (let i = 0; i < count; i++) {
        const p = i * 3;
        positions[p] = (Math.random() * 2 - 1) * bounds.w;
        positions[p + 1] = (Math.random() * 2 - 1) * bounds.h;
        positions[p + 2] = Math.random() * 4 - 2.5;
        velocities[p] = (Math.random() * 2 - 1) * DRIFT;
        velocities[p + 1] = (Math.random() * 2 - 1) * DRIFT;
        velocities[p + 2] = (Math.random() * 2 - 1) * DRIFT * 0.4;
        sizes[i] = 0.35 + Math.random() * 0.8;
        alphas[i] = 0.25 + Math.random() * 0.6;
      }
    };
    seed();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    // The cloud is larger than the frame and always faces the camera, so let
    // it skip the frustum test rather than cull the whole thing on a tilt.
    points.frustumCulled = false;
    group.add(points);

    // Pointer state: normalized device coords for the tilt, plus the same
    // point unprojected onto z = 0 for the push.
    const pointer = { x: 0, y: 0, active: false };
    const pointerWorld = new THREE.Vector3();

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = 0;
      pointer.y = 0;
    };

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
      const beforeW = bounds.w;
      const beforeH = bounds.h;
      measure();
      // Rescale existing positions so a resize does not re-roll the field.
      const sx = bounds.w / beforeW;
      const sy = bounds.h / beforeH;
      for (let i = 0; i < count; i++) {
        const p = i * 3;
        positions[p] *= sx;
        positions[p + 1] *= sy;
      }
      geometry.attributes.position.needsUpdate = true;
    };

    const step = (dt: number) => {
      const halfH = Math.tan((FOV * Math.PI) / 360) * CAMERA_Z;
      const halfW = halfH * camera.aspect;

      if (pointer.active) {
        pointerWorld.set(pointer.x * halfW, pointer.y * halfH, 0);
      }

      const r2 = POINTER_RADIUS * POINTER_RADIUS;
      for (let i = 0; i < count; i++) {
        const p = i * 3;

        // Drift, then wrap when a point leaves the volume.
        positions[p] += velocities[p] * dt;
        positions[p + 1] += velocities[p + 1] * dt;
        positions[p + 2] += velocities[p + 2] * dt;
        if (positions[p] > bounds.w) positions[p] = -bounds.w;
        else if (positions[p] < -bounds.w) positions[p] = bounds.w;
        if (positions[p + 1] > bounds.h) positions[p + 1] = -bounds.h;
        else if (positions[p + 1] < -bounds.h) positions[p + 1] = bounds.h;

        if (!pointer.active) continue;

        const dx = positions[p] - pointerWorld.x;
        const dy = positions[p + 1] - pointerWorld.y;
        const d2 = dx * dx + dy * dy;
        if (d2 >= r2 || d2 < 1e-6) continue;
        const d = Math.sqrt(d2);
        const push = (1 - d / POINTER_RADIUS) * POINTER_PUSH * dt;
        positions[p] += (dx / d) * push;
        positions[p + 1] += (dy / d) * push;
      }

      geometry.attributes.position.needsUpdate = true;

      // Tilt the whole field toward the cursor; lerp so it trails, not snaps.
      group.rotation.y += (pointer.x * PARALLAX_TILT - group.rotation.y) * PARALLAX_LERP;
      group.rotation.x += (-pointer.y * PARALLAX_TILT - group.rotation.x) * PARALLAX_LERP;
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      // One still frame, no loop, no pointer coupling — the scene at rest.
      renderer.render(scene, camera);
      return () => {
        window.removeEventListener("resize", resize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      step(dt);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    // Pause the loop while the hero is off screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && frame === 0) {
          last = performance.now();
          frame = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && frame !== 0) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(host);

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [color]);

  return <div ref={hostRef} aria-hidden className={className} />;
}
