import { Reveal } from "@/components/motion/reveal";
import { ServiceImage } from "@/components/motion/service-image";
import { ServiceNetwork } from "@/components/motion/service-network";
import { StackingCards } from "@/components/motion/stacking-cards";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, Section } from "@/components/ui/section";
import { TagPill } from "@/components/ui/tag-pill";
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

/** The one phrase the design tints. Everything else in the title stays white. */
const TITLE_ACCENT = "Token Marketing";

/**
 * Splits the title around `TITLE_ACCENT` so the keyword can take the brand
 * orange while the rest of the copy is rendered verbatim — no rewriting, no
 * per-card hard-coding of the text.
 */
function ServiceTitle({ title }: { title: string }) {
  const at = title.indexOf(TITLE_ACCENT);
  if (at === -1) return <>{title}</>;

  return (
    <>
      {title.slice(0, at)}
      <span className="services-title-accent">{TITLE_ACCENT}</span>
      {title.slice(at + TITLE_ACCENT.length)}
    </>
  );
}

/** Small circular check used in the feature pills. */
function FeatureCheck() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className="service-check"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6.6" strokeWidth="1.1" opacity="0.55" />
      <path d="M5.1 8.2 7.2 10.3 11 6.2" strokeWidth="1.4" />
    </svg>
  );
}

export function Services() {
  return (
    <Section id="services" className="services-section">
      <ServiceNetwork className="services-network" />
      <Container className="services-container max-w-[1200px]">
        <SectionHeading
          eyebrow={services.eyebrow}
          title={services.title}
          className="services-section-heading mb-16"
        />

        <StackingCards className="services-list flex flex-col gap-16">
          {services.items.map((service, index) => (
            <li key={service.title}>
              <div data-stack-pin>
                <div
                  data-stack-card
                  className="services-row services-card grid gap-10 lg:grid-cols-[minmax(0,653px)_minmax(0,471px)] lg:items-start lg:gap-14"
                >
                  <Reveal x={-32} y={0}>
                    <div className="services-copy flex items-start gap-5">
                      <span
                        aria-hidden
                        className="service-number grid shrink-0 place-items-center tabular-nums"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3 className="services-title">
                          <ServiceTitle title={service.title} />
                        </h3>
                        <p className="services-body">{service.body}</p>

                        <ul className="services-tags">
                          {service.tags.map((tag) => (
                            <li key={tag}>
                              <TagPill
                                className="service-tag"
                                icon={<FeatureCheck />}
                              >
                                {tag}
                              </TagPill>
                            </li>
                          ))}
                        </ul>
                      </div>
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
                      variant="primary"
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
