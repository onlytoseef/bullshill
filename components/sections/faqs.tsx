import { Reveal } from "@/components/motion/reveal";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { faqs } from "@/lib/content";

export function Faqs() {
  return (
    <Section id="faqs" className="faqs-section">
      <Container>
        <div className="faqs-layout grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal x={-24} y={0}>
            <div className="faq-intro">
              <h2>{faqs.title}</h2>
              <p>{faqs.body}</p>
            </div>

            <div className="faq-actions mt-8 flex flex-wrap gap-3">
              {faqs.ctas.map((cta) => (
                <Button
                  key={cta.label}
                  href={cta.href}
                  variant={cta.variant}
                  size="md"
                  className={cta.label === "More questions" ? "faq-more-button" : undefined}
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
