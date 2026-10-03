import Link from "next/link";

import { Stagger } from "@/components/motion/stagger";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, Section } from "@/components/ui/section";
import { blog } from "@/lib/content";

export function Blog() {
  return (
    <Section id="blog">
      <Container>
        <SectionHeading
          eyebrow={blog.eyebrow}
          title={blog.title}
          subtitle={blog.subtitle}
          className="mb-16"
        />

        <Stagger
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.07}
        >
          {blog.posts.map((post) => (
            <article key={post.title} className="h-full">
              <Link
                href="#blog"
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-surface-border bg-surface-card transition-colors hover:border-orange/50"
              >
                <div className="overflow-hidden">
                  <PlaceholderVisual
                    from={post.from}
                    to={post.to}
                    className="aspect-[16/10] w-full rounded-none ring-0 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-xs text-blue-light-active">
                    <span className="font-medium text-orange">
                      {post.category}
                    </span>
                    <span aria-hidden>·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="mt-3 text-lg font-semibold text-balance text-white">
                    {post.title}
                  </h3>
                </div>
              </Link>
            </article>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
