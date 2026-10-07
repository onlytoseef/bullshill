import { Reveal } from "@/components/motion/reveal";
import { ServiceImage } from "@/components/motion/service-image";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, Section } from "@/components/ui/section";
import { TagPill } from "@/components/ui/tag-pill";
import { services } from "@/lib/content";
import findMoreIcon from "../../app/assets/images/find-more-icon.svg";
import tickIcon from "../../app/assets/images/tick-icon.png";
import aiProductLaunchImage from "../../app/assets/services-section/ai-product-launch.png";
import nftPromotionImage from "../../app/assets/services-section/nft-promotion.png";
import socialMediaMarketingImage from "../../app/assets/services-section/social-media-marketing.png";
import tokenMarketingImage from "../../app/assets/services-section/token-marketing.png";

const serviceImages = [
  tokenMarketingImage,
  socialMediaMarketingImage,
  aiProductLaunchImage,
  nftPromotionImage,
] as const;

export function Services() {
  return (
    <Section id="services" className="services-section">
      <Container className="max-w-[1200px]">
        <SectionHeading
          eyebrow={services.eyebrow}
          title={services.title}
          className="services-section-heading mb-16"
        />

        <ul className="services-list flex flex-col gap-16">
          {services.items.map((service, index) => (
            <li key={service.title}>
              <div className="services-row grid gap-10 lg:grid-cols-[minmax(0,653px)_minmax(0,471px)] lg:items-start lg:gap-14">
                {/* Copy and artwork enter from opposite sides, so the eye is
                    pulled across the row rather than straight down the page. */}
                <Reveal x={-32} y={0}>
                  <div className="services-copy flex items-start gap-5">
                    <span
                      aria-hidden
                      className="service-number hidden shrink-0 text-display-xs font-semibold text-blue-light tabular-nums sm:grid sm:place-items-center"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <h3 className="services-title text-display-xs font-semibold text-white sm:text-display-sm">
                        {service.title}
                      </h3>
                      <p className="services-body mt-4 text-base text-blue-light-active">
                        {service.body}
                      </p>

                      <ul className="services-tags mt-6 grid max-w-[410px] grid-cols-2 gap-4">
                        {service.tags.map((tag) => (
                          <li key={tag}>
                            <TagPill
                              className="service-tag"
                              icon={
                                <Image
                                  src={tickIcon}
                                  alt=""
                                  width={18}
                                  height={18}
                                />
                              }
                            >
                              {tag}
                            </TagPill>
                          </li>
                        ))}
                      </ul>

                    </div>
                  </div>
                </Reveal>

                <Reveal x={32} y={0} delay={0.1}>
                  <div className="services-image relative aspect-[471/314] overflow-hidden rounded-[12px] border-[8px] border-[#3f4750]">
                    <ServiceImage>
                      <Image
                        src={serviceImages[index]}
                        alt={service.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 471px"
                        className="object-cover"
                      />
                    </ServiceImage>
                  </div>
                  <p className="services-caption mt-5 text-sm leading-relaxed text-blue-light-active">
                    {services.caption}
                  </p>
                  <Button href={service.href} variant="light" size="md" className="services-image-cta mt-5">
                    Find out more
                    <Image src={findMoreIcon} alt="" width={20} height={20} />
                  </Button>
                </Reveal>
              </div>
            </li>
          ))}
        </ul>

        <Reveal className="mt-16 flex justify-center">
          <Button
            href={services.cta.href}
            variant="light"
            size="md"
            className="services-view-all"
          >
            {services.cta.label}
            <Image src={findMoreIcon} alt="" width={20} height={20} />
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
