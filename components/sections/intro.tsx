import { StatsReveal } from "@/components/motion/stats-reveal";
import { Container, Section } from "@/components/ui/section";
import { intro, stats } from "@/lib/content";
import bgShine from "../../app/assets/images/bg-shine.webp";
import bgShineMobile from "../../app/assets/images/bg-shine-mobile.webp";

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
      {/*
        Two files, one visible. The 1440px original is 281 KiB and a phone
        never displays more than ~390 CSS px of it; the 800px variant is 71 KiB.
        Both arrive as custom properties and the stylesheet picks the one the
        media query asks for, so only that file is downloaded. Setting
        `background-image` inline here would win over the media query.
      */}
      <div
        aria-hidden
        className="about-shine"
        style={{
          ["--about-shine-wide" as string]: `url(${bgShine.src})`,
          ["--about-shine-mobile" as string]: `url(${bgShineMobile.src})`,
        }}
      />
      <Container className="pointer-events-none relative z-10 2xl:max-w-[90rem]">
        <StatsReveal className="mx-auto w-full max-w-[57.25rem] xl:max-w-[68.75rem] 2xl:max-w-[80rem]">
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
