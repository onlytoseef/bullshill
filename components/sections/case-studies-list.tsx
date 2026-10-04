import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { CaseStudyRow } from "@/components/ui/case-study-row";
import { SendBadge } from "@/components/ui/icons";
import { Container } from "@/components/ui/section";
import { caseStudiesPage } from "@/lib/content";

export function CaseStudiesList() {
  return (
    <section id="case-studies" className="scroll-mt-24 pb-12 sm:pb-16">
      <Container>
        {/* Divided list rather than cards — the design separates rows with a
            hairline and lets the artwork carry the visual weight. */}
        <ul className="divide-y divide-surface-border">
          {caseStudiesPage.items.map((study) => (
            <CaseStudyRow
              key={study.slug}
              study={study}
              cta={caseStudiesPage.readCta}
            />
          ))}
        </ul>

        <Reveal className="mt-12 flex justify-center">
          <Button
            href={caseStudiesPage.moreCta.href}
            variant="light"
            size="md"
          >
            {caseStudiesPage.moreCta.label}
            <SendBadge />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
