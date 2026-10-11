import Image, { type StaticImageData } from "next/image";

import { Reveal } from "@/components/motion/reveal";
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
          <ul className="awards-scroller" tabIndex={0} aria-label="Team members">
            {awards.people.map((person) => (
              <li key={person.name}>
                <figure className="awards-card relative isolate overflow-hidden">
                  <Image
                    src={teamImages[person.name]}
                    alt={person.name}
                    fill
                    sizes="(max-width: 767px) 280px, 460px"
                    className="object-cover"
                  />
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
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
