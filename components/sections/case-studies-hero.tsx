import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { CoinCycleIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/section";
import { caseStudiesPage } from "@/lib/content";

export function CaseStudiesHero() {
  return (
    <section className="page-hero page-hero--compact">
      <div aria-hidden className="page-hero-backdrop" />

      <Container className="relative z-10">
        <Reveal trigger="mount" className="page-hero-content">
          <span className="page-hero-eyebrow">
            <CoinCycleIcon />
            {caseStudiesPage.eyebrow}
          </span>

          <h1 className="text-balance">{caseStudiesPage.title}</h1>

          <p className="page-hero-subtitle">{caseStudiesPage.subtitle}</p>

          <Button
            href={caseStudiesPage.cta.href}
            variant="secondary"
            className="page-hero-button page-hero-button--outline"
          >
            {caseStudiesPage.cta.label}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
