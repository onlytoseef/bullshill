import { Reveal } from "@/components/motion/reveal";
import { ParticleBackground } from "@/components/motion/particle-background";
import { ContactForm } from "@/components/sections/contact-form";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/section";
import { contactPage } from "@/lib/content";

export function ContactHero() {
  return (
    <>
    <PageHero title={contactPage.title} eyebrow="Get in touch" subtitle={contactPage.subtitle} />
    <section className="inner-page-content contact-hero has-particles inner-content-grains">
      <ParticleBackground />
      <Container className="relative z-10">
        <Reveal trigger="mount" delay={0.15}>
          <ContactForm />
        </Reveal>
      </Container>
    </section>
    </>
  );
}
