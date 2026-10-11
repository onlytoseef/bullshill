import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { PostCard } from "@/components/ui/post-card";
import { Container } from "@/components/ui/section";
import { blogPage } from "@/lib/content";

const { featured, secondary } = blogPage;

export function BlogFeatured() {
  return (
    <section className="blog-featured">
      <Container>
        <Reveal>
          <Link href={`/blog/${featured.slug}`} className="blog-feature-card">
            <PlaceholderVisual
              from={featured.from}
              to={featured.to}
              className="blog-feature-image"
            />

            <div className="blog-feature-copy">
              <span className="blog-feature-tag">{featured.category}</span>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <time>{featured.date}</time>
            </div>
          </Link>
        </Reveal>

        <Stagger
          className="blog-post-grid"
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
