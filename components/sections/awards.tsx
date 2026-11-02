import Image, { type StaticImageData } from "next/image";

import { ParticleBackground } from "@/components/motion/particle-background";
import { Reveal } from "@/components/motion/reveal";
import { StaggerHeading } from "@/components/motion/stagger-heading";
import { AwardsCarousel } from "@/components/sections/awards-carousel";
import { CarouselItem } from "@/components/ui/carousel";
import { Container, Section } from "@/components/ui/section";
import { awards } from "@/lib/content";
import adnanImage from "../../app/assets/bullshill-team/Adnan Hussain.png";
import faisalNoorImage from "../../app/assets/bullshill-team/Faisal Noor.png";
import junaidImage from "../../app/assets/bullshill-team/Junaid Muneer.png";
import saadImage from "../../app/assets/bullshill-team/M Saad Akhtar.png";
import bilalImage from "../../app/assets/bullshill-team/Muhammad Bilal.png";
import faisalImage from "../../app/assets/bullshill-team/Muhammad Faisal Bashir.png";
import jawadImage from "../../app/assets/bullshill-team/Muhammad Jawad Nawaz.png";
import rehanImage from "../../app/assets/bullshill-team/Muhammad Rehan.png";
import rizwanImage from "../../app/assets/bullshill-team/Muhammad Rizwan.png";
import zeeshanImage from "../../app/assets/bullshill-team/Muhammad Zeeshan.png";
import sadaqatImage from "../../app/assets/bullshill-team/Sadaqat.png";
import saqibImage from "../../app/assets/bullshill-team/Saqib Ijaz.png";
import usamaImage from "../../app/assets/bullshill-team/Usama Abid_.png";
import zaighamImage from "../../app/assets/bullshill-team/Zaigham.png";

type PersonName = (typeof awards.people)[number]["name"];

/** Keyed by the name in `awards.people`, which mirrors the artwork's filename. */
const teamImages: Record<PersonName, StaticImageData> = {
  "Muhammad Jawad Nawaz": jawadImage,
  "Muhammad Zeeshan": zeeshanImage,
  "Muhammad Bilal": bilalImage,
  "Adnan Hussain": adnanImage,
  "Faisal Noor": faisalNoorImage,
  "Junaid Muneer": junaidImage,
  "M Saad Akhtar": saadImage,
  "Muhammad Faisal Bashir": faisalImage,
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
