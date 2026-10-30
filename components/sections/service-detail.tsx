import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/section";
import { ServiceBlock, type Service } from "@/components/ui/service-block";
import { servicesPage } from "@/lib/content";

type Props = {
  service: Service;
  index: number;
};

export function ServiceDetail({ service, index }: Props) {
  return (
    <section className="service-detail service-detail--single">
      <div
        aria-hidden
        className="page-hero-backdrop page-hero-backdrop--image"
      />

      <Container className="relative z-10 max-w-[75rem]">
        <Reveal trigger="mount" className="service-detail-grid">
          <p className="service-detail-heading">{servicesPage.title}</p>
          <div className="service-detail-eyebrow">
            <span>{servicesPage.eyebrow}</span>
          </div>
        </Reveal>

        <ServiceBlock
          service={service}
          index={index}
          href={servicesPage.cta.href}
          titleAs="h1"
          eager
        />
      </Container>
    </section>
  );
}
