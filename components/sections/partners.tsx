import { Reveal } from "@/components/motion/reveal";
import Image from "next/image";
import { Container, Section } from "@/components/ui/section";
import { partners } from "@/lib/content";
import mintRewards from "../../app/assets/partner-logos/mintrewards.webp";
import electionEmpire from "../../app/assets/partner-logos/election empire.webp";
import forgate from "../../app/assets/partner-logos/forgate.webp";
import driftFinancial from "../../app/assets/partner-logos/drift financial.webp";
import avirvoxLabs from "../../app/assets/partner-logos/avirvoxlabs.webp";
import fatCatWen from "../../app/assets/partner-logos/fatcatwen.webp";
import steadefi from "../../app/assets/partner-logos/steadefi.webp";
import amalas from "../../app/assets/partner-logos/amalas.webp";
import playnet from "../../app/assets/partner-logos/playnet.webp";
import inky from "../../app/assets/partner-logos/inky.webp";
import ticketsoft from "../../app/assets/partner-logos/ticketsoft.webp";
import meanaRaptor from "../../app/assets/partner-logos/meana raptor.webp";
import escrowly from "../../app/assets/partner-logos/escrowly.webp";

const partnerImages = [
  { name: "Mint Rewards", src: mintRewards },
  { name: "Election Empire", src: electionEmpire },
  { name: "Forgate", src: forgate },
  { name: "Drift Financial", src: driftFinancial },
  { name: "AvirVox Labs", src: avirvoxLabs },
  { name: "FatCatWen", src: fatCatWen },
  { name: "Steadefi", src: steadefi },
  { name: "Amalas", src: amalas },
  { name: "Playnet", src: playnet },
  { name: "Inky", src: inky },
  { name: "TicketSoft", src: ticketsoft },
  { name: "Meana Raptor", src: meanaRaptor },
  { name: "Escrowly", src: escrowly },
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

        <div className="partner-marquee" aria-label={partners.title}>
          <div className="partner-marquee-track">
            {[...partnerImages, ...partnerImages].map((logo, index) => (
              <span
                key={`${logo.name}-${index}`}
                className="partner-logo"
                aria-hidden={index >= partnerImages.length}
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  sizes="(max-width: 1023px) 88px, 120px"
                />
              </span>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
