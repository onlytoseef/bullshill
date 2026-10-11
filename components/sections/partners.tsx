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
  { name: "Dell", file: "dell", width: 82, height: 27 },
  { name: "Zendesk", file: "zendesk", width: 115, height: 23 },
  { name: "Rakuten", file: "rakuten", width: 89, height: 28 },
  { name: "Pacific Funds", file: "pacific_funds", width: 189, height: 18 },
  { name: "NCR", file: "ncr", width: 106, height: 32 },
  { name: "Lattice", file: "lattice", width: 159, height: 31 },
  { name: "TED", file: "ted", width: 72, height: 27 },
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
                <li key={logo.name}>
                  <Image
                    src={`/assets/icons/${logo.file}.png`}
                    alt={logo.name}
                    width={logo.width}
                    height={logo.height}
                  />
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
