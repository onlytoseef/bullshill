import { PageHero } from "@/components/sections/page-hero";
import { ParticleBackground } from "@/components/motion/particle-background";
import { Container } from "@/components/ui/section";
import { ServiceBlock } from "@/components/ui/service-block";
import { servicesPage } from "@/lib/content";

export function ServicesList() {
  return (
    <>
    <PageHero title={servicesPage.title} eyebrow={servicesPage.eyebrow} />
    <section className="service-detail service-detail--list has-particles inner-content-grains">
      <ParticleBackground />
      <Container className="max-w-[75rem]">
        <ul>
          {servicesPage.items.map((service, index) => (
            <li key={service.slug}>
              <ServiceBlock
                service={service}
                index={index + 1}
                href={`/services/${service.slug}`}
                eager={index === 0}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
    </>
  );
}
