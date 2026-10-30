import { ParticleBackground } from "@/components/motion/particle-background";
import { Reveal } from "@/components/motion/reveal";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { faqs } from "@/lib/content";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "home" | "page";
};

export function Faqs({ variant = "home" }: Props) {
  return (
    <Section
      id="faqs"
      className={cn(
        "faqs-section bubble-zone has-particles",
        variant === "page" && "faqs-section--page",
      )}
    >
      <ParticleBackground />
      <Container>
        <div className="faqs-layout grid">
          <Reveal x={-24} y={0}>
            <div className="faq-intro">
              <h2>{faqs.title}</h2>
              <p>{faqs.body}</p>
            </div>

            {/* Wraps rather than overflowing: both buttons are nowrap, and at
                320px the pair is ~46px wider than the column. */}
            <div className="faq-actions mt-8 flex flex-wrap items-center gap-3">
              {faqs.ctas.map((cta) => (
                <Button
                  key={cta.label}
                  href={cta.href}
                  variant={cta.variant}
                  size="md"
                  className={
                    cta.label === "More questions"
                      ? "faq-more-button"
                      : "faq-contact-button"
                  }
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          </Reveal>

          <Reveal x={24} y={0} delay={0.1}>
            <div className="faq-accordion">
              <Accordion items={faqs.items} />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
