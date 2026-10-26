import { CoinArc } from "@/components/motion/coin-arc";
import { HeroParticles } from "@/components/motion/hero-particles";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeadline } from "@/components/motion/split-headline";
import { Button } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";
import { hero, site } from "@/lib/content";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <HeroParticles className="pointer-events-none absolute inset-0" />

      <div className="hero-content relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-12 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="hero-announcement mx-auto mb-6 max-w-full">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="size-5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="8.25" />
              <path d="M14.5 9.5c-.55-.55-1.3-.83-2.2-.83-1.25 0-2.13.63-2.13 1.52 0 2.2 4.33.92 4.33 3.08 0 .92-.85 1.56-2.14 1.56-.94 0-1.72-.3-2.33-.9M12 7.05v9.9" />
            </svg>
            <span>{site.announcement}</span>
          </div>

          <SplitHeadline
            lines={hero.headline}
            className="hero-heading-gradient"
          />

          <Reveal trigger="mount" delay={0.55} className="mt-6">
            <p className="mx-auto max-w-2xl text-balance text-base text-[#F1FBE8] sm:text-lg">
              {hero.subcopy}
            </p>
          </Reveal>

          <Reveal trigger="mount" delay={0.7} className="mt-10">
            <Button
              href={hero.cta.href}
              size="lg"
              className="hero-cta max-w-full rounded-full border"
            >
              {hero.cta.label}
              <ArrowIcon />
            </Button>
          </Reveal>
        </div>
      </div>

      <div className="hero-coin-stage relative z-10 px-6 pb-20 sm:pb-28">
        <CoinArc />
      </div>
    </section>
  );
}
