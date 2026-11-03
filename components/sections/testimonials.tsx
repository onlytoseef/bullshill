import { ParticleBackground } from "@/components/motion/particle-background";
import { Reveal } from "@/components/motion/reveal";
import { StaggerHeading } from "@/components/motion/stagger-heading";
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { Container, Section } from "@/components/ui/section";
import { testimonials } from "@/lib/content";

export function Testimonials() {
  return (
    <Section id="testimonials" className="testimonials-section bubble-zone has-particles">
      <ParticleBackground />
      <Container>
        <StaggerHeading
          eyebrow={testimonials.eyebrow}
          title={testimonials.title}
          subtitle={testimonials.subtitle}
          className="testimonials-heading mb-16"
          eyebrowClassName="testimonials-eyebrow"
        />

        <Reveal>
          <TestimonialsCarousel />
        </Reveal>
      </Container>
    </Section>
  );
}
