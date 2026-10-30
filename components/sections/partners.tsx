import { Reveal } from "@/components/motion/reveal";
import Image from "next/image";
import type { CSSProperties } from "react";
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

/**
 * A few individual grid cells tinted a shade lighter. Positions are whole cells,
 * so each one lines up with the painted lines exactly; the scatter is irregular
 * on purpose, not a pattern.
 */
const GRID_HIGHLIGHTS = [
  { col: 3, row: 0 },
  { col: 15, row: 0 },
  { col: 9, row: 1 },
  { col: 6, row: 2 },
  { col: 17, row: 2 },
  { col: 2, row: 3 },
  { col: 12, row: 3 },
  { col: 8, row: 4 },
  { col: 14, row: 4 },
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

            <div className="partner-marquee partners-strip-marquee">
              <div className="partner-marquee-track">
                {[...partnerImages, ...partnerImages].map((logo, index) => (
                  <span
                    key={`${logo.name}-${index}`}
                    className="partner-logo partners-strip-logo"
                    aria-hidden={index >= partnerImages.length}
                  >
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      fill
                      sizes="120px"
                    />
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    );
  }

  return (
    <Section className="partners-section py-16 sm:py-20">
      <div aria-hidden className="partners-grid">
        {GRID_HIGHLIGHTS.map((cell) => (
          <span
            key={`${cell.col}-${cell.row}`}
            className="partners-grid-cell"
            style={{ "--col": cell.col, "--row": cell.row } as CSSProperties}
          />
        ))}
      </div>
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
