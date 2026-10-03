import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { ArrowIcon, TagGlyph } from "@/components/ui/icons";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { TagPill } from "@/components/ui/tag-pill";

type Props = {
  /** 1-based position, rendered as the numbered chip. */
  index: number;
  title: string;
  body: string;
  tags: readonly string[];
  /** Supporting line under the artwork. */
  caption: string;
  cta: { label: string; href: string };
  visual: { label: string; from: string; to: string };
};

/**
 * One service on the /services page: numbered copy on the left, artwork with a
 * caption and call to action on the right.
 *
 * Server Component — the two <Reveal> wrappers are the only client code, and
 * everything here reaches them as children.
 */
export function ServiceRow({
  index,
  title,
  body,
  tags,
  caption,
  cta,
  visual,
}: Props) {
  return (
    <li className="grid gap-8 py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      {/* Copy and artwork enter from opposite sides, so the eye is pulled
          across the row rather than straight down the page. */}
      <Reveal x={-24} y={0}>
        <div className="flex gap-4 sm:gap-5">
          <span
            aria-hidden
            className="grid size-8 shrink-0 place-items-center rounded-lg border border-surface-border bg-surface-card text-sm font-medium text-blue-light-active tabular-nums"
          >
            {index}.
          </span>

          <div className="min-w-0">
            <h2 className="text-display-xs font-semibold text-white sm:text-display-sm">
              {title}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-blue-light-active">
              {body}
            </p>

            <ul className="mt-6 grid max-w-md grid-cols-1 gap-2.5 sm:grid-cols-2">
              {tags.map((tag) => (
                <li key={tag}>
                  <TagPill icon={<TagGlyph />} className="w-full justify-start">
                    {tag}
                  </TagPill>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <Reveal x={24} y={0} delay={0.1}>
        <PlaceholderVisual
          label={visual.label}
          from={visual.from}
          to={visual.to}
          className="aspect-[16/11] w-full"
        />

        <p className="mt-5 text-sm leading-relaxed text-blue-light-active">
          {caption}
        </p>

        <Button href={cta.href} variant="light" size="sm" className="mt-5">
          {cta.label}
          <span
            aria-hidden
            className="grid size-5 place-items-center rounded-full bg-blue-darker text-white"
          >
            <ArrowIcon className="size-3" />
          </span>
        </Button>
      </Reveal>
    </li>
  );
}
