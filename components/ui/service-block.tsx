import Image, { type StaticImageData } from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { ServiceImage } from "@/components/motion/service-image";
import { Button } from "@/components/ui/button";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { servicesPage } from "@/lib/content";
import findMoreIcon from "../../app/assets/images/find-more-icon.svg";
import tickIcon from "../../app/assets/images/tick-icon.png";
import aiProductLaunchImage from "../../app/assets/services-section/ai-product-launch.png";
import nftPromotionImage from "../../app/assets/services-section/nft-promotion.png";
import tokenMarketingImage from "../../app/assets/services-section/token-marketing.png";

export type Service = (typeof servicesPage.items)[number];

const serviceImages: Partial<Record<Service["slug"], StaticImageData>> = {
  "ico-token-launches": tokenMarketingImage,
  "ai-product-marketing": aiProductLaunchImage,
  "nft-marketing": nftPromotionImage,
};

type Props = {
  service: Service;
  index: number;
  href: string;
  titleAs?: "h1" | "h2";
  eager?: boolean;
};

export function ServiceBlock({
  service,
  index,
  href,
  titleAs: Title = "h2",
  eager = false,
}: Props) {
  const image = serviceImages[service.slug];
  const trigger = eager ? "mount" : "inView";

  return (
    <div className="service-detail-grid service-detail-row">
      <Reveal trigger={trigger} delay={eager ? 0.1 : 0} x={-32} y={0}>
        <div className="service-detail-copy">
          <span aria-hidden className="service-number service-detail-number">
            {index}.
          </span>

          <div className="min-w-0">
            <Title className="service-detail-title">{service.title}</Title>
            <p>{service.body}</p>

            <ul className="service-detail-tags">
              {service.tags.map((tag) => (
                <li key={tag}>
                  <Image src={tickIcon} alt="" width={18} height={18} />
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <Reveal trigger={trigger} delay={eager ? 0.2 : 0.1} x={32} y={0}>
        <div className="service-detail-image">
          {image ? (
            <ServiceImage>
              <Image
                src={image}
                alt={service.title}
                fill
                priority={eager}
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
          <p>{service.caption}</p>
          <Button href={href} variant="light" className="services-image-cta">
            {service.button}
            <Image src={findMoreIcon} alt="" width={20} height={20} />
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
