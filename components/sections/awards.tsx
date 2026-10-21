import Image, { type StaticImageData } from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { AwardsCarousel } from "@/components/sections/awards-carousel";
import { CarouselItem } from "@/components/ui/carousel";
import { Container, Section } from "@/components/ui/section";
import { awards } from "@/lib/content";
import adnanImage from "../../app/assets/team-section/Adnan Hussain.png";
import faisalNoorImage from "../../app/assets/team-section/Faisal Noor.png";
import junaidImage from "../../app/assets/team-section/Junaid Muneer.png";
import saadImage from "../../app/assets/team-section/M. Saad Akhtar.png";
import bilalImage from "../../app/assets/team-section/Muhammad Bilal.png";
import faisalImage from "../../app/assets/team-section/Muhammad Faisal.png";
import jawadImage from "../../app/assets/team-section/Muhammad Jawad Nawaz.png";
import rehanImage from "../../app/assets/team-section/Muhammad Rehan (2).png";
import rizwanImage from "../../app/assets/team-section/Muhammad Rizwan.png";
import sadaqatImage from "../../app/assets/team-section/Sadaqat (2).png";
import saqibImage from "../../app/assets/team-section/Saqib Ijaz.png";
import usamaImage from "../../app/assets/team-section/Usama Abid (2).png";
import zaighamImage from "../../app/assets/team-section/Zaigham.png";
import zeeshanImage from "../../app/assets/team-section/zeeshan (2).png";

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
    <Section id="about">
      <Container>
        <div className="awards-heading mb-16">
          <span className="awards-eyebrow">{awards.eyebrow}</span>
          <h2>{awards.title}</h2>
          <p>{awards.subtitle}</p>
        </div>

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
                      sizes="(max-width: 767px) 230px, 280px"
                      className="object-contain object-bottom"
                    />
                  </div>
                  <figcaption className="awards-caption">
                    <span className="block text-lg font-semibold text-white">
                      {person.name}
                    </span>
                    {person.role ? (
                      <span className="block text-sm text-white/70">
                        {person.role}
                      </span>
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
