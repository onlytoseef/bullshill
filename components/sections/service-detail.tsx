import { PageHero } from "@/components/sections/page-hero";
import { ParticleBackground } from "@/components/motion/particle-background";
import { Container } from "@/components/ui/section";
import { ServiceBlock, type Service } from "@/components/ui/service-block";
import { servicesPage } from "@/lib/content";

type Props = {
  service: Service;
  index: number;
};

export function ServiceDetail({ service, index }: Props) {
  return (
    <>
    <PageHero title={service.title} eyebrow={servicesPage.eyebrow} />
    <section className="inner-page-content service-detail service-detail--single has-particles inner-content-grains">
      <ParticleBackground />
      <Container className="relative z-10 max-w-[75rem]">
        <ServiceBlock
          service={service}
          index={index}
          href={servicesPage.cta.href}
          variant="primary"
          titleAs="h2"
          eager
        />
      </Container>
    </section>
    </>
  );
}
