import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { ParticleBackground } from "@/components/motion/particle-background";
import { Button } from "@/components/ui/button";
import { CaseStudyRow } from "@/components/ui/case-study-row";
import { Container } from "@/components/ui/section";
import { caseStudiesPage } from "@/lib/content";
import findMoreIcon from "../../app/assets/images/find-more-icon.svg";

export function CaseStudiesList() {
  return (
    <section
      id="case-studies"
      className="bubble-zone scroll-mt-24 pb-12 sm:pb-16 has-particles inner-content-grains"
    >
      <ParticleBackground />
      <Container>
        <ul className="case-rows">
          {caseStudiesPage.items.map((study) => (
            <CaseStudyRow
              key={study.slug}
              study={study}
              cta={{
                label: caseStudiesPage.readCta.label,
                href: `/case-studies/${study.slug}`,
              }}
            />
          ))}
        </ul>

        <Reveal className="mt-10 flex justify-center">
          <Button
            href={caseStudiesPage.moreCta.href}
            variant="primary"
            className="case-row-button"
          >
            {caseStudiesPage.moreCta.label}
            <Image src={findMoreIcon} alt="" width={18} height={18} />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
