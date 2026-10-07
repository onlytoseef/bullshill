import { Reveal } from "@/components/motion/reveal";
import { PartnerLogoMotion } from "@/components/motion/partner-logo-motion";
import Image from "next/image";
import { Container, Section } from "@/components/ui/section";
import { partners } from "@/lib/content";
import partnerOne from "../../app/assets/partner-logos/1.png";
import partnerTwo from "../../app/assets/partner-logos/2.png";
import partnerThree from "../../app/assets/partner-logos/3.png";
import partnerFour from "../../app/assets/partner-logos/4.png";
import partnerFive from "../../app/assets/partner-logos/5.png";
import partnerSix from "../../app/assets/partner-logos/6.png";

const partnerImages = [
  partnerOne,
  partnerTwo,
  partnerThree,
  partnerFour,
  partnerFive,
  partnerSix,
] as const;

type Props = {
  /**
   * The /services page shows only the trusted-by line and the logos; the home
   * page carries the full heading above them.
   */
  showHeading?: boolean;
};

export function Partners({ showHeading = true }: Props) {
  return (
    <Section className="partners-section py-16 sm:py-20">
      <Container>
        <Reveal className="partners-heading text-center">
          {showHeading ? (
            <h2>
              {partners.title}
            </h2>
          ) : null}
          <p>
            {partners.subtitle}
          </p>
        </Reveal>

        <PartnerLogoMotion
          className="partner-logo-row"
        >
          {partnerImages.map((logo, index) => (
            <span
              key={partners.logos[index]}
              data-partner-logo
              className="partner-logo"
            >
              <Image
                src={logo}
                alt={partners.logos[index]}
                fill
                sizes="151px"
              />
            </span>
          ))}
        </PartnerLogoMotion>
      </Container>
    </Section>
  );
}
