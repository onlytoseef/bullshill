import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { SendBadge } from "@/components/ui/icons";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { TagPill } from "@/components/ui/tag-pill";
import type { CaseStudy } from "@/lib/content";

type Props = {
  study: CaseStudy;
  cta: { label: string; href: string };
};

export function CaseStudyRow({ study, cta }: Props) {
  return (
    <li className="grid gap-8 py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      <Reveal x={-24} y={0}>
        <h2 className="text-display-sm font-semibold text-balance text-white sm:text-display-md">
          {study.client}
        </h2>

        <p className="mt-5 max-w-xl text-sm leading-relaxed text-blue-light">
          {study.summaryLead}
          <span className="text-blue-light-active">{study.summaryRest}</span>
        </p>

        <p className="mt-6 inline-flex rounded-xl border border-surface-border bg-surface-card px-4 py-2.5 text-base font-semibold text-white">
          {study.metric}
        </p>

        <p className="mt-5 max-w-xl text-sm leading-relaxed text-blue-light">
          {study.result}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2.5">
          {study.tags.map((tag) => (
            <li key={tag}>
              <TagPill>{tag}</TagPill>
            </li>
          ))}
        </ul>

        <Button href={cta.href} variant="light" size="sm" className="mt-6">
          {cta.label}
          <SendBadge />
        </Button>
      </Reveal>

      <Reveal x={24} y={0} delay={0.1}>
        <div className="rounded-[1.25rem] border border-white/15 p-1.5">
          <PlaceholderVisual
            from={study.visual.from}
            to={study.visual.to}
            className="aspect-[4/3] w-full"
          />
        </div>
      </Reveal>
    </li>
  );
}
