import Image, { type StaticImageData } from "next/image";

import { StaggerHeading } from "@/components/motion/stagger-heading";
import { TeamScroller } from "@/components/motion/team-scroller";
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
    <Section id="about">
      <Container>
        <StaggerHeading
          eyebrow={awards.eyebrow}
          title={awards.title}
          subtitle={awards.subtitle}
          className="awards-heading mb-16"
          eyebrowClassName="awards-eyebrow"
        />

        <TeamScroller label="Team members" className="awards-scroller">
          {awards.people.map((person) => (
            <li key={person.name} data-team-card>
              <figure className="awards-card relative isolate overflow-hidden">
                {/* 8% wider than the card on each side, so the photo has
                    room to drift without its edges showing. The drift and the
                    entrance zoom each get their own layer: two tweens sharing
                    one element's transform do not compose reliably. */}
                <div data-team-photo className="absolute inset-y-0 -inset-x-[8%]">
                  <div data-team-zoom className="absolute inset-0">
                    <Image
                      src={teamImages[person.name]}
                      alt={person.name}
                      fill
                      sizes="(max-width: 1000px) 330px, 540px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-6">
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
            </li>
          ))}
        </TeamScroller>
      </Container>
    </Section>
  );
}
