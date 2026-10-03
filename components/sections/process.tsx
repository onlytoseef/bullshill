import type { CSSProperties } from "react";

import { ProcessConnectors } from "@/components/motion/process-connectors";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, Section } from "@/components/ui/section";
import { process } from "@/lib/content";

/**
 * The process flow.
 *
 * Stays a Server Component — only <ProcessConnectors> crosses to the client,
 * so the card copy never enters the client bundle.
 *
 * Below `lg` the steps are a plain vertical list. At `lg` and up they switch to
 * absolute positions driven by the same `x`/`y` percentages the connectors use,
 * fed in as CSS custom properties so Tailwind can apply them at one breakpoint
 * only (inline `left`/`top` would otherwise leak into the mobile layout).
 */
export function Process() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow={process.eyebrow}
          title={process.title}
          className="mb-16"
        />

        <div className="relative lg:aspect-[16/12]">
          <ProcessConnectors />

          <ol className="flex flex-col gap-4 lg:block">
            {process.steps.map((step, index) => (
              <li
                key={step.title}
                style={
                  { "--x": `${step.x}%`, "--y": `${step.y}%` } as CSSProperties
                }
                className="relative z-10 lg:absolute lg:top-[var(--y)] lg:left-[var(--x)] lg:min-h-[22%] lg:w-[42%]"
              >
                <Reveal delay={index * 0.05} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl bg-orange p-6 shadow-lg shadow-orange-darker/40">
                    <span className="text-xs font-semibold tracking-wider text-white/70 tabular-nums">
                      STEP {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
