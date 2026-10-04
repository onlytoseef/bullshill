import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { PostCard } from "@/components/ui/post-card";
import { Container } from "@/components/ui/section";
import { TagPill } from "@/components/ui/tag-pill";
import { blogPage } from "@/lib/content";

const { featured, secondary } = blogPage;

/**
 * The lead story — artwork and meta side by side — with the two runners-up
 * beneath it.
 */
export function BlogFeatured() {
  return (
    <section className="pb-12 sm:pb-16">
      <Container>
        <Reveal className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <div className="rounded-3xl border border-surface-border bg-surface-card p-3">
            <PlaceholderVisual
              from={featured.from}
              to={featured.to}
              className="h-full min-h-64 w-full"
            />
          </div>

          <div className="flex flex-col justify-center rounded-3xl border border-surface-border bg-surface-card p-7">
            <TagPill className="self-start">{featured.category}</TagPill>

            <h2 className="mt-5 text-display-xs font-semibold text-balance text-white">
              {featured.title}
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-blue-light-active">
              {featured.excerpt}
            </p>

            <time className="mt-6 text-xs text-blue-light-active/70">
              {featured.date}
            </time>
          </div>
        </Reveal>

        {/* `itemClassName` passes the full height through Stagger's generated
            wrappers, which are the real grid items. */}
        <Stagger
          className="mt-6 grid gap-6 sm:grid-cols-2"
          itemClassName="h-full"
          stagger={0.08}
        >
          {secondary.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
