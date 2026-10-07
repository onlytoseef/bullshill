import type { CSSProperties } from "react";

import { ProcessConnectors } from "@/components/motion/process-connectors";
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
    <Section className="process-section">
      <Container>
        <SectionHeading
          eyebrow={process.eyebrow}
          title={process.title}
          className="mb-16"
        />

        <div className="process-flow relative lg:aspect-[16/12]">
          <ProcessConnectors />

          <ol className="process-list flex flex-col gap-4 lg:block">
            {process.steps.map((step, index) => (
              <li
                key={step.title}
                style={
                  { "--x": `${step.x}%`, "--y": `${step.y}%` } as CSSProperties
                }
                className="process-item relative z-10 lg:absolute lg:top-[var(--y)] lg:left-[var(--x)]"
              >
                <div
                  data-process-card
                  className="process-card flex h-full flex-col"
                >
                  <span className="process-card-icon" aria-hidden>
                    {String(index + 1)}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/85">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
