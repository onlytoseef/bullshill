import Image, { type StaticImageData } from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { ServiceImage } from "@/components/motion/service-image";
import { Button } from "@/components/ui/button";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { Container } from "@/components/ui/section";
import { servicesPage } from "@/lib/content";
import findMoreIcon from "../../app/assets/images/find-more-icon.svg";
import tickIcon from "../../app/assets/images/tick-icon.png";
import aiProductLaunchImage from "../../app/assets/services-section/ai-product-launch.png";
import nftPromotionImage from "../../app/assets/services-section/nft-promotion.png";
import socialMediaMarketingImage from "../../app/assets/services-section/social-media-marketing.png";
import tokenMarketingImage from "../../app/assets/services-section/token-marketing.png";

type Service = (typeof servicesPage.items)[number];

const serviceImages: Partial<Record<Service["slug"], StaticImageData>> = {
  "meme-coins": tokenMarketingImage,
  "social-media-marketing": socialMediaMarketingImage,
  "ai-product-launch": aiProductLaunchImage,
  "nft-marketing": nftPromotionImage,
};

type Props = {
  service: Service;
  index: number;
};

export function ServiceDetail({ service, index }: Props) {
  const image = serviceImages[service.slug];

  return (
    <section className="service-detail">
      <div
        aria-hidden
        className="page-hero-backdrop page-hero-backdrop--image"
      />

      <Container className="relative z-10 max-w-[1200px]">
        <Reveal trigger="mount" className="service-detail-grid">
          <p className="service-detail-heading">{servicesPage.title}</p>
          <div className="service-detail-eyebrow">
            <span>{servicesPage.eyebrow}</span>
          </div>
        </Reveal>

        <div className="service-detail-grid service-detail-row">
          <Reveal trigger="mount" delay={0.1} x={-32} y={0}>
            <div className="service-detail-copy">
              <span aria-hidden className="service-number service-detail-number">
                {index}.
              </span>

              <div className="min-w-0">
                <h1>{service.title}</h1>
                <p>{service.body}</p>

                <ul className="service-detail-tags">
                  {servicesPage.tags.map((tag) => (
                    <li key={tag}>
                      <Image src={tickIcon} alt="" width={18} height={18} />
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal trigger="mount" delay={0.2} x={32} y={0}>
            <div className="service-detail-image">
              {image ? (
                <ServiceImage>
                  <Image
                    src={image}
                    alt={service.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 484px"
                    className="object-cover"
                  />
                </ServiceImage>
              ) : (
                <div className="absolute inset-0">
                  <PlaceholderVisual
                    label={service.visual.label}
                    from={service.visual.from}
                    to={service.visual.to}
                    className="size-full rounded-none ring-0"
                  />
                </div>
              )}
            </div>

            <div className="service-detail-aside">
              <p>{servicesPage.caption}</p>
              <Button
                href={servicesPage.cta.href}
                variant="light"
                className="services-image-cta"
              >
                {servicesPage.cta.label}
                <Image src={findMoreIcon} alt="" width={20} height={20} />
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
