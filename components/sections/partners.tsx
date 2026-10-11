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

const stripLogos = [
  { name: "DELL", width: 81, size: 34, weight: 800, tracking: "-0.01em" },
  { name: "zendesk", width: 113, size: 30, weight: 400, tracking: "-0.02em" },
  { name: "Rakuten", width: 88, size: 24, weight: 600, tracking: "-0.01em" },
  { name: "PACIFIC FUNDS", width: 187, size: 21, weight: 600, tracking: "0.04em" },
  { name: "NCR", width: 103, size: 34, weight: 700, tracking: "0.02em" },
  { name: "Lattice", width: 158, size: 34, weight: 500, tracking: "0" },
  { name: "TED", width: 71, size: 35, weight: 900, tracking: "-0.03em" },
] as const;

type Props = {
  variant?: "home" | "strip";
};

export function Partners({ variant = "home" }: Props) {
  if (variant === "strip") {
    return (
      <section className="partners-strip">
        <Container>
          <Reveal>
            <p>{partners.subtitle}</p>

            <ul>
              {stripLogos.map((logo) => (
                <li key={logo.name} style={{ width: logo.width }}>
                  <span
                    style={{
                      fontSize: logo.size,
                      fontWeight: logo.weight,
                      letterSpacing: logo.tracking,
                    }}
                  >
                    {logo.name}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>
    );
  }

  return (
    <Section className="partners-section py-16 sm:py-20">
      <Container>
        <Reveal className="partners-heading text-center">
          <h2>
            {partners.title}
          </h2>
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
