import type { CSSProperties } from "react";

import { ProcessFlow } from "@/components/motion/process-flow";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, Section } from "@/components/ui/section";
import { process } from "@/lib/content";

export function Process() {
  return (
    <Section className="process-section">
      <Container>
        <SectionHeading
          eyebrow={process.eyebrow}
          title={process.title}
          className="mb-20 lg:mb-28"
        />

        <ProcessFlow>
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
        </ProcessFlow>
      </Container>
    </Section>
  );
}
