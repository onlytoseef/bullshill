import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, Section } from "@/components/ui/section";
import { worried } from "@/lib/content";

export function Worried() {
  return (
    <Section>
      <Container>
        <SectionHeading
          title={worried.title}
          subtitle={worried.subtitle}
          className="mb-12"
        />

        <Reveal className="flex justify-center">
          <Button href={worried.cta.href} size="lg">
            {worried.cta.label}
          </Button>
        </Reveal>

        <Parallax amount={8} className="mt-16">
          <PlaceholderVisual
            label="Campaign hero visual"
            from="#ef7914"
            to="#1a0a02"
            className="aspect-[16/9] w-full"
          />
        </Parallax>
      </Container>
    </Section>
  );
}
