import Link from "next/link";
import Image from "next/image";

import { ParticleBackground } from "@/components/motion/particle-background";
import { Stagger } from "@/components/motion/stagger";
import { StaggerHeading } from "@/components/motion/stagger-heading";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { Container, Section } from "@/components/ui/section";
import { blog } from "@/lib/content";
import { getPublishedPosts } from "@/lib/cms/posts";
import { Button } from "@/components/ui/button";

export async function Blog() {
  const posts = await getPublishedPosts(6);
  if (posts.length === 0) return null;

  return (
    <Section id="blog" className="bubble-zone has-particles">
      <ParticleBackground />
      <Container>
        <StaggerHeading
          eyebrow={blog.eyebrow}
          title={blog.title}
          subtitle={blog.subtitle}
          className="blog-heading mb-16"
          eyebrowClassName="blog-eyebrow"
        />

        <Stagger
          className="blog-grid"
          stagger={0.07}
        >
          {posts.map((post) => (
            <article key={post.slug} className="blog-card-wrapper h-full">
              <Link
                href={`/blog/${post.slug}`}
                className="blog-card group flex h-full flex-col overflow-hidden transition-colors hover:border-orange/50"
              >
                <div className="blog-card-media overflow-hidden">
                  {post.cover ? (
                    <div className="blog-card-image relative w-full overflow-hidden rounded-3xl">
                      <Image
                        src={post.cover.url}
                        alt={post.cover.alt || post.title}
                        fill
                        sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : <PlaceholderVisual
                    from={post.from}
                    to={post.to}
                    className="blog-card-image w-full rounded-3xl ring-0 transition-transform duration-500 group-hover:scale-105"
                  />}
                </div>

                <div className="blog-card-content flex flex-1 flex-col">
                  <div className="blog-card-meta flex items-center gap-2">
                    <span className="blog-card-category font-medium">
                      {post.category}
                    </span>
                    <span aria-hidden>-</span>
                    <time>{post.date}</time>
                  </div>

                  <h3 className="blog-card-title text-balance">{post.title}</h3>
                </div>
              </Link>
            </article>
          ))}
        </Stagger>
        <div className="mt-10 flex justify-center">
          <Button href="/blog" variant="secondary">View all articles</Button>
        </div>
      </Container>
    </Section>
  );
}
