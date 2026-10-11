import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/section";
import { ServiceBlock } from "@/components/ui/service-block";
import { servicesPage } from "@/lib/content";

export function ServicesList() {
  return (
    <section className="service-detail service-detail--list">
      <Container className="max-w-[1200px]">
        <Reveal trigger="mount" className="service-detail-grid">
          <h1 className="service-detail-heading">{servicesPage.title}</h1>
          <div className="service-detail-eyebrow">
            <span>{servicesPage.eyebrow}</span>
          </div>
        </Reveal>

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
  );
}
