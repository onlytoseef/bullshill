import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import type { CaseStudy } from "@/lib/content";
import findMoreIcon from "../../app/assets/images/find-more-icon.svg";

type Props = {
  study: CaseStudy;
  cta: { label: string; href: string };
};

export function CaseStudyRow({ study, cta }: Props) {
  return (
    <li className="case-row">
      <Reveal x={-24} y={0} className="case-row-copy">
        <h2>{study.client}</h2>

        <p className="case-row-summary">
          <span>{study.summaryLead}</span>
          {study.summaryRest}
        </p>

        <p className="case-row-metric">{study.metric}</p>

        <p className="case-row-result">{study.result}</p>

        <ul className="case-row-tags">
          {study.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <Button href={cta.href} variant="light" className="case-row-button">
          {cta.label}
          <Image src={findMoreIcon} alt="" width={24} height={24} />
        </Button>
      </Reveal>

      <Reveal x={24} y={0} delay={0.1} className="case-row-visual">
        <PlaceholderVisual
          from={study.visual.from}
          to={study.visual.to}
          className="size-full rounded-none ring-0"
        />
      </Reveal>
    </li>
  );
}
