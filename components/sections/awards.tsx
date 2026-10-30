import Image, { type StaticImageData } from "next/image";

import { ParticleBackground } from "@/components/motion/particle-background";
import { Reveal } from "@/components/motion/reveal";
import { StaggerHeading } from "@/components/motion/stagger-heading";
import { AwardsCarousel } from "@/components/sections/awards-carousel";
import { CarouselItem } from "@/components/ui/carousel";
import { Container, Section } from "@/components/ui/section";
import { awards } from "@/lib/content";
import adnanImage from "../../app/assets/team-section/Adnan Hussain.webp";
import faisalNoorImage from "../../app/assets/team-section/Faisal Noor.webp";
import junaidImage from "../../app/assets/team-section/Junaid Muneer.webp";
import saadImage from "../../app/assets/team-section/M. Saad Akhtar.webp";
import bilalImage from "../../app/assets/team-section/Muhammad Bilal.webp";
import faisalImage from "../../app/assets/team-section/Muhammad Faisal.webp";
import jawadImage from "../../app/assets/team-section/Muhammad Jawad Nawaz.webp";
import rehanImage from "../../app/assets/team-section/Muhammad Rehan (2).webp";
import rizwanImage from "../../app/assets/team-section/Muhammad Rizwan.webp";
import sadaqatImage from "../../app/assets/team-section/Sadaqat (2).webp";
import saqibImage from "../../app/assets/team-section/Saqib Ijaz.webp";
import usamaImage from "../../app/assets/team-section/Usama Abid (2).webp";
import zaighamImage from "../../app/assets/team-section/Zaigham.webp";
import zeeshanImage from "../../app/assets/team-section/zeeshan (2).webp";

type PersonName = (typeof awards.people)[number]["name"];

const teamImages: Record<PersonName, StaticImageData> = {
  "Jawad Ahmad": jawadImage,
  Zeeshan: zeeshanImage,
  Bilal: bilalImage,
  "Adnan Hussain": adnanImage,
  "Faisal Noor": faisalNoorImage,
  "Junaid Muneer": junaidImage,
  "M. Saad Akhtar": saadImage,
  "Muhammad Faisal": faisalImage,
  "Muhammad Rehan": rehanImage,
  "Muhammad Rizwan": rizwanImage,
  Sadaqat: sadaqatImage,
  "Saqib Ijaz": saqibImage,
  "Usama Abid": usamaImage,
  Zaigham: zaighamImage,
};

export function Awards() {
  return (
    <Section id="about" className="bubble-zone has-particles">
      <ParticleBackground />
      <Container>
        <StaggerHeading
          eyebrow={awards.eyebrow}
          title={awards.title}
          subtitle={awards.subtitle}
          className="awards-heading mb-16"
          eyebrowClassName="awards-eyebrow"
        />

        <Reveal>
          <AwardsCarousel>
            {awards.people.map((person) => (
              <CarouselItem key={person.name} className="awards-slide">
                <figure className="awards-card relative isolate overflow-hidden">
                  <div className="awards-image relative">
                    <Image
                      src={teamImages[person.name]}
                      alt={person.name}
                      fill
                      sizes="(max-width: 767px) 86vw, (max-width: 1023px) 46vw, 30vw"
                      className="object-contain object-bottom"
                    />
                  </div>
                  <figcaption className="awards-caption">
                    <span className="awards-name">{person.name}</span>
                    {person.role ? (
                      <span className="awards-role">{person.role}</span>
                    ) : null}
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </AwardsCarousel>
        </Reveal>
      </Container>
    </Section>
  );
}
