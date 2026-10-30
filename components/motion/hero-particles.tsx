"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  className?: string;
  /** Granule tint. Defaults to the pale blue-grey of the reference field. */
  color?: string;
};

/** Device pixel ratio is capped so retina phones do not render 3x the work. */
const DPR_CAP = 2;

/**
 * Squares sit on a fixed lattice, but a noise field decides which slots hold
 * one at all. That is what keeps it clustered and organic instead of reading as
 * uniform dotted wallpaper: the pitch is fine enough that the clusters look
 * dense, while the gaps between them stay genuinely empty.
 *
 * The noise is indexed on normalized slot coordinates, not pixels, so pitch and
 * square size can be retuned here without disturbing the cluster pattern.
 */
const GRID_PITCH = 10;
const MAX_POINTS = 26000;
/**
 * Pitch sits mid-range of the reference's, with the squares a step larger than
 * its dots. At this pair the field covers about the same area as before, so the
 * granules read chunkier without the field getting busier.
 */
const SQUARE_MIN = 4;
const SQUARE_MAX = 5.5;
const ALPHA_MIN = 0.4;
const ALPHA_MAX = 0.78;

/**
 * The cluster field: feature size radially and vertically, where it cuts from
 * solid to empty, a per-square nudge that breaks the mirror at granule scale,
 * and an extra bias at the upper corners.
 */
const NOISE_RADIAL = 6;
const NOISE_VERTICAL = 5;
const NOISE_THRESHOLD = 0.38;
const NOISE_SOFTNESS = 0.34;
const NOISE_JITTER = 0.3;
const CORNER_BOOST = 0.18;

/**
 * Vertical weighting: the top of the frame keeps most of its slots, the base
 * keeps this fraction — and the shader fades them on top of that, so the field
 * both thins out and dims as it falls.
 */
const BOTTOM_KEEP = 0.6;
const KEEP_CURVE = 1.1;
const BOTTOM_FADE = 0.1;
const FADE_CURVE = 1.4;

/**
 * The sides and corners carry more than the middle column, and the headline
 * block is held back further still — noticeably, but without emptying the frame.
 */
const CENTRE_EDGE = 0.55;
const CENTRE_CLEAR = 0.22;

/** Cursor scatter radius and travel, plus the depth-parallax drift. */
const POINTER_RADIUS = 120;
const POINTER_PUSH = 16;
const PARALLAX = 9;
const POINTER_LERP = 0.12;
/** Where the cursor parks when it leaves the hero, i.e. far enough to be inert. */
const POINTER_PARKED = 1e5;

/** Ambient wander, in CSS pixels — small against the pitch, so rows breathe. */
const SWAY = 1.6;

const VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aDepth;
  attribute float aPhase;

  uniform vec2 uResolution;
  uniform float uAspect;
  uniform float uPixelRatio;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform vec2 uParallax;
  uniform float uPointerRadius;
  uniform float uPointerPush;
  uniform float uSway;

  varying float vAlpha;
  varying float vFeather;

  const float TAU = 6.283185307179586;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  /** Three octaves, normalized: the shape of the clusters. */
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 3; i++) {
      v += amp * valueNoise(p);
      p *= 2.03;
      amp *= 0.5;
    }
    return v / 0.875;
  }

  void main() {
    // position.xy is the square's slot in CSS pixels; the slot never moves, so
    // every offset below is applied here and the lattice stays a lattice.
    vec2 base = position.xy;
    vec2 slot = base / uResolution;

    // --- organic density ---------------------------------------------------
    // Sampled on distance from the focus rather than on x, so both sides hold
    // the same amount of cluster and their contours arc around the middle
    // instead of running straight down one side. The per-square nudge keeps the
    // mirror from being visible granule-to-granule while leaving the left and
    // right totals equal.
    vec2 focus = vec2(0.5, 0.42);
    vec2 rel = vec2((slot.x - focus.x) * uAspect, slot.y - focus.y);
    vec2 np = vec2(
      length(rel) * ${NOISE_RADIAL.toFixed(3)},
      slot.y * ${NOISE_VERTICAL.toFixed(3)}
    );
    np.x += aPhase * ${NOISE_JITTER.toFixed(3)};
    // Slow flow, so the clusters drift without ever looking animated.
    np += vec2(uTime * 0.014, uTime * -0.009);

    float cx = clamp(abs(slot.x - 0.5) * 2.0, 0.0, 1.0);
    float down = clamp(slot.y, 0.0, 1.0);

    // Upper-left and upper-right carry the most: a bias added to the noise, so
    // the corners grow cluster where the middle stays clear.
    float bias = ${CORNER_BOOST.toFixed(3)} * pow(cx, 1.6) * pow(1.0 - down, 1.6);

    float presence = smoothstep(
      ${NOISE_THRESHOLD.toFixed(3)},
      ${(NOISE_THRESHOLD + NOISE_SOFTNESS).toFixed(3)},
      fbm(np) + bias
    );

    float vertical = mix(1.0, ${BOTTOM_FADE.toFixed(3)}, pow(down, ${FADE_CURVE.toFixed(3)}));

    // Sides carry more than the middle column — identical on both sides.
    float sides = mix(${CENTRE_EDGE.toFixed(3)}, 1.0, pow(cx, 0.85));

    // ...and the headline block is held back further still.
    vec2 c = vec2((slot.x - 0.5) * 1.5, (slot.y - 0.42) * 1.2);
    float centre = mix(${CENTRE_CLEAR.toFixed(3)}, 1.0, smoothstep(0.10, 0.46, length(c)));

    float mask = presence * vertical * sides * centre;

    // --- motion ------------------------------------------------------------
    vec2 p = base;

    // Continuous ambient wander: two slow, out-of-step waves per square.
    p.x += sin(uTime * 0.27 + aPhase * TAU) * uSway;
    p.y += cos(uTime * 0.21 + aPhase * TAU) * uSway;

    // Depth parallax — squares nearer the viewer travel further with the cursor.
    p += uParallax * aDepth;

    // Soft scatter. The offset is a pure function of the cursor's current
    // position, so as the cursor leaves, the influence fades and every square
    // eases back to its slot with no spring to damp.
    vec2 toPoint = p - uPointer;
    float influence = 1.0 - smoothstep(0.0, uPointerRadius, length(toPoint));
    p += normalize(toPoint + 1e-4) * influence * influence * uPointerPush;

    // Straight to clip space: a pixel-space lattice needs no camera, and this
    // keeps the pitch and the square sizes exact at every viewport.
    vec2 uv = p / uResolution;
    gl_Position = vec4(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, 0.0, 1.0);

    // Park the near-empty slots outside the clip volume rather than paying for
    // their fragments — this is what carves the gaps between clusters.
    if (mask < 0.015) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);

    vAlpha = aAlpha * mask;

    gl_PointSize = aSize * uPixelRatio;

    // Edge feather kept well under a pixel, so the granule reads as a crisp
    // square rather than a soft dot. gl_PointSize is a single scalar, so the
    // proportions are always exactly 1:1.
    vFeather = min(0.18, 0.4 / max(gl_PointSize, 1.0));
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vFeather;

  void main() {
    // Square granules: no round mask, just a hair of anti-aliasing on the edge.
    vec2 d = abs(gl_PointCoord - 0.5);
    float mask = 1.0 - smoothstep(0.5 - vFeather, 0.5, max(d.x, d.y));
    if (mask <= 0.001) discard;
    gl_FragColor = vec4(uColor, mask * vAlpha);
  }
`;

/**
 * The hero's granule field: a dense lattice of very small squares.
 *
 * Density is weighted by height — every slot is filled along the top, half of
 * them at the base — and the shader fades the survivors on the same curve, over
 * slow interference bands that give the field its clusters and waves. The middle
 * is held back so the headline keeps its contrast.
 *
 * The cursor only scatters, and the offset is derived from its live position
 * inside the shader, so squares drift back on their own as it moves away: there
 * is no per-square state, and the per-frame cost is two uniforms.
 *
 * It degrades safely — no WebGL, a thrown context, or `prefers-reduced-motion`
 * all leave a single still frame — and the loop is paused while the hero is off
 * screen and torn down completely on unmount.
 */
export function HeroParticles({ className, color = "#b6c9de" }: Props) {
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
    // Positions are emitted straight to clip space, so the camera is unused.
    const camera = new THREE.Camera();

    const clamp = (v: number, min: number, max: number) =>
      Math.min(Math.max(v, min), max);

    const positions = new Float32Array(MAX_POINTS * 3);
    const sizes = new Float32Array(MAX_POINTS);
    const alphas = new Float32Array(MAX_POINTS);
    const depths = new Float32Array(MAX_POINTS);
    const phases = new Float32Array(MAX_POINTS);

    const geometry = new THREE.BufferGeometry();
    const positionAttr = new THREE.BufferAttribute(positions, 3);
    const sizeAttr = new THREE.BufferAttribute(sizes, 1);
    const alphaAttr = new THREE.BufferAttribute(alphas, 1);
    const depthAttr = new THREE.BufferAttribute(depths, 1);
    const phaseAttr = new THREE.BufferAttribute(phases, 1);
    positionAttr.setUsage(THREE.DynamicDrawUsage);
    sizeAttr.setUsage(THREE.DynamicDrawUsage);
    alphaAttr.setUsage(THREE.DynamicDrawUsage);
    depthAttr.setUsage(THREE.DynamicDrawUsage);
    phaseAttr.setUsage(THREE.DynamicDrawUsage);

    geometry.setAttribute("position", positionAttr);
    geometry.setAttribute("aSize", sizeAttr);
    geometry.setAttribute("aAlpha", alphaAttr);
    geometry.setAttribute("aDepth", depthAttr);
    geometry.setAttribute("aPhase", phaseAttr);
    geometry.setDrawRange(0, 0);

    /** Fraction of slots kept at a given height — full at the top, thinned down. */
    const keepAt = (down: number) =>
      1 + (BOTTOM_KEEP - 1) * Math.pow(down, KEEP_CURVE);

    let resolution = new THREE.Vector2(1, 1);

    /** Re-tile the lattice for the current size, at a constant pixel pitch. */
    const build = () => {
      const w = Math.max(host.clientWidth, 1);
      const h = Math.max(host.clientHeight, 1);

      // Widen the pitch rather than exceed the cap on very large viewports.
      let pitch = GRID_PITCH;
      while (Math.ceil(w / pitch) * Math.ceil(h / pitch) > MAX_POINTS) {
        pitch *= 1.15;
      }

      const cols = Math.ceil(w / pitch) + 1;
      const rows = Math.ceil(h / pitch) + 1;

      let i = 0;
      for (let row = 0; row < rows && i < MAX_POINTS; row++) {
        for (let col = 0; col < cols && i < MAX_POINTS; col++) {
          const gx = (col + 0.5) * pitch;
          const gy = (row + 0.5) * pitch;
          const down = clamp(gy / h, 0, 1);

          // Density thins toward the base; the shader fades what is left.
          if (Math.random() > keepAt(down)) continue;

          positions[i * 3] = gx;
          positions[i * 3 + 1] = gy;
          positions[i * 3 + 2] = 0;
          sizes[i] = SQUARE_MIN + Math.random() * (SQUARE_MAX - SQUARE_MIN);
          alphas[i] = ALPHA_MIN + Math.random() * (ALPHA_MAX - ALPHA_MIN);
          depths[i] = 0.35 + Math.random() * 0.65;
          phases[i] = Math.random();

          i += 1;
        }
      }

      positionAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;
      alphaAttr.needsUpdate = true;
      depthAttr.needsUpdate = true;
      phaseAttr.needsUpdate = true;
      geometry.setDrawRange(0, i);
    };

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uResolution: { value: resolution },
        uAspect: { value: 1 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uTime: { value: 0 },
        uPointer: {
          value: new THREE.Vector2(POINTER_PARKED, POINTER_PARKED),
        },
        uParallax: { value: new THREE.Vector2(0, 0) },
        uPointerRadius: { value: POINTER_RADIUS },
        uPointerPush: { value: POINTER_PUSH },
        uSway: { value: SWAY },
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    // Positions bypass the camera, so the frustum test would be meaningless.
    points.frustumCulled = false;
    scene.add(points);

    // Scatter target, in the same pixel space as the lattice (top-left origin),
    // plus the parallax it drives. Parking it far away is what releases squares.
    const pointerTarget = new THREE.Vector2(POINTER_PARKED, POINTER_PARKED);
    const pointerWorld = new THREE.Vector2(POINTER_PARKED, POINTER_PARKED);
    const parallaxTarget = new THREE.Vector2(0, 0);
    const parallaxWorld = new THREE.Vector2(0, 0);

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointerTarget.set(x, y);
      parallaxTarget.set(
        (x / rect.width - 0.5) * 2 * PARALLAX,
        (y / rect.height - 0.5) * 2 * PARALLAX,
      );
    };

    const onPointerLeave = () => {
      pointerTarget.set(POINTER_PARKED, POINTER_PARKED);
      parallaxTarget.set(0, 0);
    };

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w === 0 || h === 0) return;
      if (w === resolution.x && h === resolution.y) return;

      resolution.set(w, h);
      renderer.setSize(w, h);
      material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
      // Keeps the noise cells square on screen rather than smeared by aspect.
      material.uniforms.uAspect.value = w / Math.max(h, 1);
      build();
    };

    const step = (dt: number) => {
      material.uniforms.uTime.value += dt;

      // Frame-rate independent lag, so the scatter trails the cursor.
      const k = 1 - Math.pow(1 - POINTER_LERP, dt * 60);
      pointerWorld.lerp(pointerTarget, k);
      parallaxWorld.lerp(parallaxTarget, k);
      (material.uniforms.uPointer.value as THREE.Vector2).copy(pointerWorld);
      (material.uniforms.uParallax.value as THREE.Vector2).copy(parallaxWorld);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      // One still frame, no loop, no pointer coupling — the field at rest.
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
