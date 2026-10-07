import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { Stagger } from "@/components/motion/stagger";
import { Container, Section } from "@/components/ui/section";
import { intro, stats } from "@/lib/content";
import bgShine from "../../app/assets/images/bg-shine.png";

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
      <Container className="2xl:max-w-[1440px]">
        <div className="mx-auto w-full max-w-[916px] xl:max-w-[1100px] 2xl:max-w-[1280px]">
          <Reveal>
            <div className="about-eyebrow mx-auto mb-8">
              <span>{intro.eyebrow}</span>
            </div>
            <p className="about-copy">
              {intro.bodyLead} <span>{intro.bodyAccent}</span>
            </p>
          </Reveal>

          <Stagger className="mt-9 grid gap-6 sm:grid-cols-2" stagger={0.1}>
            {stats.map((stat) => (
              <div key={stat.label} className="about-stat-card">
                <Counter
                  value={stat.value}
                  prefix={"prefix" in stat ? stat.prefix : ""}
                  suffix={stat.suffix}
                  className="about-stat-value"
                />
                <p className="about-stat-label">{stat.label}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
