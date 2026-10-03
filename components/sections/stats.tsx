import { Counter } from "@/components/motion/counter";
import { Stagger } from "@/components/motion/stagger";
import { Container, Section } from "@/components/ui/section";
import { stats } from "@/lib/content";

export function Stats() {
  return (
    <Section className="py-12 sm:py-16">
      <Container>
        <Stagger className="grid gap-5 sm:grid-cols-2" stagger={0.1}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="h-full rounded-3xl border border-orange-darker bg-gradient-to-br from-orange-darker/60 to-surface-card px-8 py-10"
            >
              <Counter
                value={stat.value}
                prefix={"prefix" in stat ? stat.prefix : ""}
                suffix={stat.suffix}
                className="block text-display-sm font-semibold text-orange tabular-nums sm:text-display-md"
              />
              <p className="mt-2 text-sm text-blue-light-active">
                {stat.label}
              </p>
            </div>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
