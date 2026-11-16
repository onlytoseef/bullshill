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
import styles from "./blog-card.module.css";

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
                className={styles.card}
              >
                <div className={styles.thumbnail}>
                  {post.cover ? (
                      <Image
                        src={post.cover.url}
                        alt={post.cover.alt || post.title}
                        fill
                        sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 33vw"
                        className={styles.image}
                      />
                  ) : <PlaceholderVisual
                    from={post.from}
                    to={post.to}
                    className={styles.placeholder}
                  />}
                </div>

                <div className={styles.content}>
                  <div className={styles.meta}>
                    <span className={styles.category}>
                      {post.category}
                    </span>
                    <span className={styles.date}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                        <rect x="3" y="5" width="18" height="16" rx="3" />
                        <path d="M16 3v4M8 3v4M3 11h18" />
                      </svg>
                      <time>{post.date}</time>
                    </span>
                  </div>

                  <h3 className={styles.title}>{post.title}</h3>
                  {post.excerpt?.trim() ? <p className={styles.excerpt}>{post.excerpt}</p> : null}
                  <span className={styles.readMore}>
                    Read more
                    <svg className={styles.arrow} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                      <path d="M4 12h15m-6-6 6 6-6 6" />
                    </svg>
                  </span>
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
