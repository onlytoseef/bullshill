import { CoinArc } from "@/components/motion/coin-arc";
import { Reveal } from "@/components/motion/reveal";
import { WordReveal } from "@/components/motion/word-reveal";
import { Button } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";
import { hero } from "@/lib/content";

/** Grid wash and brand glow behind the hero. Purely decorative. */
function Backdrop() {
  const grid =
    "radial-gradient(ellipse 75% 55% at 50% 0%, #000 35%, transparent 100%)";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: grid,
          WebkitMaskImage: grid,
        }}
      />
      <div
        className="absolute top-[-14rem] left-1/2 h-[34rem] w-[58rem] -translate-x-1/2 rounded-full opacity-25 blur-[130px]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-orange) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Backdrop />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-12 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <WordReveal
            lines={hero.headline}
            className="text-display-sm font-semibold text-balance text-white sm:text-display-lg lg:text-display-xl"
          />

          {/* `mount` rather than `inView`: this sits above the fold, where
              waiting on an intersection callback shows a blank gap. */}
          <Reveal trigger="mount" delay={0.55} className="mt-6">
            <p className="mx-auto max-w-2xl text-base text-pretty text-blue-light-active sm:text-lg">
              {hero.subcopy}
            </p>
          </Reveal>

          <Reveal trigger="mount" delay={0.7} className="mt-10">
            <Button href={hero.cta.href} size="lg">
              {hero.cta.label}
              <ArrowIcon />
            </Button>
          </Reveal>
        </div>
      </div>

      <div className="relative px-6 pb-20 sm:pb-28">
        <CoinArc />
      </div>
    </section>
  );
}
