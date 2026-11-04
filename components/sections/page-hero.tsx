import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { CoinCycleIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/section";

type Props = {
  title: string;
  eyebrow: string;
  subtitle?: string;
  children?: ReactNode;
};

/** Shared inner-page hero, using the Case Studies layout and artwork. */
export function PageHero({ title, eyebrow, subtitle, children }: Props) {
  return (
    <section className="page-hero page-hero--compact">
      <div aria-hidden className="page-hero-backdrop" />
      <Container className="relative z-10">
        <Reveal trigger="mount" className="page-hero-content">
          <span className="page-hero-eyebrow">
            <CoinCycleIcon />
            {eyebrow}
          </span>
          <h1 className="text-balance">{title}</h1>
          {subtitle ? <p className="page-hero-subtitle">{subtitle}</p> : null}
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
