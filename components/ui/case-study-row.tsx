import Image, { type StaticImageData } from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "@/lib/content";
import findMoreIcon from "../../app/assets/images/find-more-icon.svg";
import amalasImage from "../../app/assets/case-studies/AMALAS case.webp";
import avxImage from "../../app/assets/case-studies/AVX case.webp";
import dmtImage from "../../app/assets/case-studies/DMT Tikabit & Noderocks.webp";
import pcpImage from "../../app/assets/case-studies/PCP case.webp";
import redditImage from "../../app/assets/case-studies/Reddit-marketing.webp";
import xMarketingImage from "../../app/assets/case-studies/X Marketing.webp";
import xeraImage from "../../app/assets/case-studies/Xera case.webp";

export const caseStudyImages: Record<string, StaticImageData> = {
  xera: xeraImage,
  "xera-token-launch-marketing": xeraImage,
  "amalas-token-launch-marketing": amalasImage,
  amalas: amalasImage,
  "avirvox-labs-ai-token-fundraising": avxImage,
  "pcp-memecoin-launch-marketing": pcpImage,
  pcp: pcpImage,
  "dmt-tikabit-noderocks-bitcoin-ordinals": dmtImage,
  "reddit-marketing-aeo-geo-web3-ai": redditImage,
  "crypto-x-marketing-grow-x-followers": xMarketingImage,
};

type Props = {
  study: CaseStudy;
  cta: { label: string; href: string };
};

export function CaseStudyRow({ study, cta }: Props) {
  const image = caseStudyImages[study.slug];

  /**
   * The heading, the artwork and the body are three siblings rather than two,
   * so the single-column layout can put the artwork directly under the heading
   * without the body in between. On two columns each one is placed explicitly,
   * which is why the source order costs the desktop nothing.
   */
  return (
    <li className="case-row">
      <Reveal x={-24} y={0} className="case-row-heading">
        <h2>{study.client}</h2>
      </Reveal>

      <Reveal x={24} y={0} delay={0.1} className="case-row-visual">
        <Image
          src={image}
          alt={study.client}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1280px) 440px, (min-width: 1024px) 40vw, (min-width: 768px) 560px, 100vw"
          className="block h-auto w-full"
        />
      </Reveal>

      <Reveal x={-24} y={0} delay={0.05} className="case-row-copy">
        <p className="case-row-summary">
          <span>{study.summaryLead}</span>
          {study.summaryRest}
        </p>

        <ul className="case-row-tags">
          {study.achievements.map((achievement) => (
            <li key={achievement}>{achievement}</li>
          ))}
        </ul>

        <Button
          href={cta.href}
          variant="light"
          className="case-row-button"
        >
          {cta.label}
          <Image src={findMoreIcon} alt="" width={18} height={18} />
        </Button>
      </Reveal>
    </li>
  );
}
