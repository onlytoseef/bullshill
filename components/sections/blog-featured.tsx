import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { PostCard } from "@/components/ui/post-card";
import { Container } from "@/components/ui/section";
import type { BlogPostView } from "@/lib/cms/types";

type Props = {
  featured: BlogPostView;
  secondary: BlogPostView[];
};

/**
 * The featured card and the two beside it. Data now comes from the CMS rather
 * than `lib/content.ts`; the markup, spacing and gradient fallback are unchanged.
 */
export function BlogFeatured({ featured, secondary }: Props) {
  return (
    <section className="blog-featured">
      <Container>
        <Reveal>
          <Link href={`/blog/${featured.slug}`} className="blog-feature-card">
            {featured.cover ? (
              <div className="blog-feature-image relative overflow-hidden">
                <Image
                  src={featured.cover.url}
                  alt={featured.cover.alt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 718px"
                  className="object-cover"
                />
              </div>
            ) : (
              <PlaceholderVisual
                from={featured.from}
                to={featured.to}
                className="blog-feature-image"
              />
            )}

            <div className="blog-feature-copy">
              <span className="blog-feature-tag">{featured.category}</span>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <time>{featured.date}</time>
            </div>
          </Link>
        </Reveal>

        {secondary.length > 0 ? (
          <Stagger
            className="blog-post-grid"
            itemClassName="h-full"
            stagger={0.08}
          >
            {secondary.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </Stagger>
        ) : null}
      </Container>
    </section>
  );
}
