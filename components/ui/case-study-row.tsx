import Image, { type StaticImageData } from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "@/lib/content";
import findMoreIcon from "../../app/assets/images/find-more-icon.svg";
import amalasImage from "../../app/assets/case-studies/AMALAS case.webp";
import avxImage from "../../app/assets/case-studies/AVX case.webp";
import pcpImage from "../../app/assets/case-studies/PCP case.webp";
import xeraImage from "../../app/assets/case-studies/Xera case.webp";

export const caseStudyImages: Record<string, StaticImageData> = {
  xera: xeraImage,
  amalas: amalasImage,
  avx: avxImage,
  pcp: pcpImage,
};

type Props = {
  study: CaseStudy;
  cta: { label: string; href: string };
};

export function CaseStudyRow({ study, cta }: Props) {
  const image = caseStudyImages[study.slug];

  return (
    <li className="case-row">
      <Reveal x={-24} y={0} className="case-row-copy">
        <h2>{study.client}</h2>

        <p className="case-row-summary">
          <span>{study.summaryLead}</span>
          {study.summaryRest}
        </p>

        <ul className="case-row-tags">
          {study.achievements.map((achievement) => (
            <li key={achievement}>{achievement}</li>
          ))}
        </ul>

        <Button href={cta.href} variant="light" className="case-row-button">
          {cta.label}
          <Image src={findMoreIcon} alt="" width={18} height={18} />
        </Button>
      </Reveal>

      <Reveal x={24} y={0} delay={0.1} className="case-row-visual">
        {image ? (
          <Image
            src={image}
            alt={study.client}
            fill
            sizes="(min-width: 1280px) 440px, (min-width: 1024px) 40vw, (min-width: 768px) 560px, 100vw"
            className="object-cover"
          />
        ) : null}
      </Reveal>
    </li>
  );
}
