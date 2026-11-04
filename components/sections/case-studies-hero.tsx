import { PageHero } from "@/components/sections/page-hero";
import { Button } from "@/components/ui/button";
import { caseStudiesPage } from "@/lib/content";

export function CaseStudiesHero() {
  return (
    <PageHero title={caseStudiesPage.title} eyebrow={caseStudiesPage.eyebrow} subtitle={caseStudiesPage.subtitle}>
          <Button
            href={caseStudiesPage.cta.href}
            variant="secondary"
            className="page-hero-button"
          >
            {caseStudiesPage.cta.label}
          </Button>
    </PageHero>
  );
}
