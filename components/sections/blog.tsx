import Link from "next/link";

import { Stagger } from "@/components/motion/stagger";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { Container, Section } from "@/components/ui/section";
import { blog } from "@/lib/content";

export function Blog() {
  return (
    <Section id="blog">
      <Container>
        <div className="testimonials-heading mb-16">
          <span className="testimonials-eyebrow">{blog.eyebrow}</span>
          <h2>{blog.title}</h2>
          <p>{blog.subtitle}</p>
        </div>

        <Stagger
          className="blog-grid"
          stagger={0.07}
        >
          {blog.posts.map((post) => (
            <article key={post.title} className="blog-card-wrapper h-full">
              <Link
                href="#blog"
                className="blog-card group flex h-full flex-col overflow-hidden transition-colors hover:border-orange/50"
              >
                <div className="blog-card-media overflow-hidden">
                  <PlaceholderVisual
                    from={post.from}
                    to={post.to}
                    className="blog-card-image w-full rounded-3xl ring-0 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="blog-card-content flex flex-1 flex-col">
                  <div className="blog-card-meta flex items-center gap-2">
                    <span className="blog-card-category font-medium">
                      {post.category}
                    </span>
                    <span aria-hidden>-</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="blog-card-title text-balance">{post.title}</h3>
                </div>
              </Link>
            </article>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
