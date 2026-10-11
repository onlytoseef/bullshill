import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/sections/contact-form";
import { Container } from "@/components/ui/section";
import { contactPage } from "@/lib/content";

export function ContactHero() {
  return (
    <section className="contact-hero">
      <div
        aria-hidden
        className="page-hero-backdrop page-hero-backdrop--image"
      />

      <Container className="relative z-10">
        <Reveal trigger="mount" className="contact-heading">
          <h1>{contactPage.title}</h1>
          <p>{contactPage.subtitle}</p>
        </Reveal>

        <Reveal trigger="mount" delay={0.15}>
          <ContactForm />
        </Reveal>
      </Container>
    </section>
  );
}
