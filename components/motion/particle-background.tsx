"use client";

import { useEffect, useRef } from "react";

import { registerField } from "@/lib/particle-field";

/**
 * A structured data-grain field behind a section.
 *
 * Particles are not scattered: each one belongs to a broad curved band, keeps
 * its slot along that band, and is animated with it. Neighbours stay
 * neighbours, which is what makes the field read as a designed texture instead
 * of noise. The bands drift at slightly different speeds and shapes, and a soft
 * elliptical mask thins the field towards the middle so copy keeps a clean
 * ground.
 *
 * The cursor bends the field locally and lifts nearby grains; because every
 * position is derived from its band slot each frame, releasing it returns the
 * grain exactly to its place in the pattern.
 *
 * The drawing is shared: one renderer and one full-viewport canvas for every
 * field on the page (`lib/particle-field.ts`). This element is the measuring
 * stick — it holds the section's place in the layout and its computed opacity,
 * so each field still gets its own rectangle and its own strength.
 */
export function ParticleBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    return registerField(host);
  }, []);

  return <div ref={hostRef} className="particle-background" aria-hidden="true" />;
}
