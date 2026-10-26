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
      className="about-section relative overflow-hidden py-12 sm:py-14 lg:py-16"
    >
      <div
        aria-hidden
        className="about-shine"
        style={{ backgroundImage: `url(${bgShine.src})` }}
      />
      <Container>
        <div className="mx-auto w-full max-w-[1100px]">
          <Reveal>
            <div className="about-eyebrow mx-auto mb-5">
              <span>{intro.eyebrow}</span>
            </div>
            <p className="about-copy">
              {intro.bodyLead} <span>{intro.bodyAccent}</span>
            </p>
          </Reveal>

          <Stagger className="about-stats grid gap-4 sm:grid-cols-2" stagger={0.1}>
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
