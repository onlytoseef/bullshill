import { ReactiveGrid } from "@/components/motion/reactive-grid";
import { StatsReveal } from "@/components/motion/stats-reveal";
import { Container, Section } from "@/components/ui/section";
import { intro, stats } from "@/lib/content";
import bgShine from "../../app/assets/images/bg-shine.webp";

/** The final figure, which the counter counts up to: "500+", "$10M+", … */
function statText(stat: (typeof stats)[number]) {
  if ("text" in stat) return stat.text;
  const prefix = "prefix" in stat ? stat.prefix : "";
  return `${prefix}${stat.value.toLocaleString("en-US")}${stat.suffix}`;
}

export function Intro() {
  return (
    <Section
      className="about-section relative overflow-hidden py-20 sm:py-28"
    >
      <div
        aria-hidden
        className="about-shine"
        style={{ backgroundImage: `url(${bgShine.src})` }}
      />
      <ReactiveGrid />
      <Container className="pointer-events-none relative z-10 2xl:max-w-[1440px]">
        <StatsReveal className="mx-auto w-full max-w-[916px] xl:max-w-[1100px] 2xl:max-w-[1280px]">
          <div data-stats-eyebrow className="about-eyebrow mx-auto mb-8">
            <span>{intro.eyebrow}</span>
          </div>
          <h2 data-stats-heading className="about-copy">
            {intro.bodyLead} <span>{intro.bodyAccent}</span>
          </h2>

          <ul className="mt-9 grid gap-6 sm:grid-cols-2">
            {stats.map((stat) => (
              <li key={stat.label} data-stats-card className="about-stat-card">
                <span data-stats-count className="about-stat-value">
                  {statText(stat)}
                </span>
                <p className="about-stat-label">{stat.label}</p>
              </li>
            ))}
          </ul>
        </StatsReveal>
      </Container>
    </Section>
  );
}
