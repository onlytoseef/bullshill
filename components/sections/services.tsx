import { Reveal } from "@/components/motion/reveal";
import { ParticleBackground } from "@/components/motion/particle-background";
import { ServiceImage } from "@/components/motion/service-image";
import { StackingCards } from "@/components/motion/stacking-cards";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, Section } from "@/components/ui/section";
import { services } from "@/lib/content";
import aiProductLaunchImage from "../../app/assets/services-section/ai-product-launch.webp";
import nftPromotionImage from "../../app/assets/services-section/nft-promotion.webp";
import socialMediaMarketingImage from "../../app/assets/services-section/social-media-marketing.webp";
import tokenMarketingImage from "../../app/assets/services-section/token-marketing.webp";

const serviceImages = [
  tokenMarketingImage,
  socialMediaMarketingImage,
  aiProductLaunchImage,
  nftPromotionImage,
] as const;

/** Small light square with a dark tick, for the feature pills. */
function PillCheck() {
  return (
    <span aria-hidden className="service-pill-box">
      <svg viewBox="0 0 12 12" fill="none" className="service-pill-tick">
        <path
          d="M2.6 6.2 4.9 8.5 9.4 3.6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Services() {
  return (
    <Section id="services" className="services-section has-particles">
      <ParticleBackground />
      <Container className="services-container max-w-[75rem]">
        <SectionHeading
          eyebrow={services.eyebrow}
          title={services.title}
          className="services-section-heading mb-10"
        />

        <StackingCards className="services-list flex flex-col gap-16">
          {services.items.map((service, index) => (
            <li key={service.title}>
              {/* Later cards have to paint above earlier ones as they land. */}
              <div data-stack-pin style={{ zIndex: index + 1 }}>
                <div
                  data-stack-card
                  className="services-row grid gap-10 lg:items-start"
                >
                  <Reveal x={-32} y={0} className="services-copy">
                    <span
                      aria-hidden
                      className="service-number grid shrink-0 place-items-center tabular-nums"
                    >
                      {index + 1}.
                    </span>

                    {/* Heading, copy and pills share this column, so they all
                        line up on the heading's left edge rather than under the
                        badge. */}
                    <div className="min-w-0 flex-1">
                      <h3 className="services-title">{service.title}</h3>
                      <p className="services-body">{service.body}</p>

                      <ul className="services-tags">
                        {service.tags.map((tag) => (
                          <li key={tag} className="service-pill">
                            <PillCheck />
                            <span>{tag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>

                  <Reveal x={32} y={0} delay={0.1} className="services-media">
                    <div className="services-image relative">
                      <ServiceImage>
                        <Image
                          src={serviceImages[index]}
                          alt={service.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 360px"
                          className="object-cover"
                        />
                      </ServiceImage>
                    </div>
                    <p className="services-caption">{services.caption}</p>
                    <Button
                      href={service.href}
                      variant="light"
                      size="md"
                      className="services-image-cta"
                    >
                      Find out more
                      <ArrowIcon className="size-4" />
                    </Button>
                  </Reveal>
                </div>
              </div>
            </li>
          ))}
        </StackingCards>

        <Reveal className="mt-16 flex justify-center">
          <Button
            href={services.cta.href}
            variant="light"
            size="md"
            className="services-view-all cta-hover find-more-cta"
          >
            {services.cta.label}
            <ArrowIcon className="size-4" />
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
