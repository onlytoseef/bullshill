import { Reveal } from "@/components/motion/reveal";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { faqs } from "@/lib/content";

export function Faqs() {
  return (
    <Section id="faqs">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal x={-24} y={0}>
            <h2 className="text-display-sm font-semibold text-white sm:text-display-md">
              {faqs.title}
            </h2>
            <p className="mt-5 text-base text-blue-light-active">{faqs.body}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {faqs.ctas.map((cta) => (
                <Button
                  key={cta.label}
                  href={cta.href}
                  variant={cta.variant}
                  size="md"
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          </Reveal>

          <Reveal x={24} y={0} delay={0.1}>
            <Accordion items={faqs.items} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
