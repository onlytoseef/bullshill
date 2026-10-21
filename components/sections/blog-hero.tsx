import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { CoinCycleIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/section";
import { blogPage } from "@/lib/content";
import findMoreIcon from "../../app/assets/images/find-more-icon.svg";

export function BlogHero() {
  return (
    <section className="page-hero blog-page-hero">
      <div aria-hidden className="page-hero-backdrop" />

      <Container className="relative z-10">
        <Reveal trigger="mount" className="page-hero-content">
          <span className="page-hero-eyebrow">
            <CoinCycleIcon />
            {blogPage.eyebrow}
          </span>

          <h1 className="text-balance">{blogPage.title}</h1>

          <p className="page-hero-subtitle">{blogPage.subtitle}</p>

          <Button
            href={blogPage.cta.href}
            variant="light"
            className="page-hero-button"
          >
            {blogPage.cta.label}
            <Image src={findMoreIcon} alt="" width={24} height={24} />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
