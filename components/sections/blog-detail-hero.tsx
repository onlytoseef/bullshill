import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { Container } from "@/components/ui/section";
import { ShareLinksLazy } from "@/components/ui/share-links-lazy";
import { SocialIcon } from "@/components/ui/social-icons";
import { blogArticle } from "@/lib/content";
import authorPhoto from "../../app/assets/team-section/Muhammad Jawad Nawaz.webp";

const { author, share, visual } = blogArticle;

export function BlogDetailHero() {
  return (
    <section className="blog-detail-hero">
      <div
        aria-hidden
        className="page-hero-backdrop page-hero-backdrop--image"
      />

      <Container className="relative z-10">
        <Reveal trigger="mount" className="blog-detail-grid">
          <div className="blog-detail-cover">
            <PlaceholderVisual
              from={visual.from}
              to={visual.to}
              className="blog-detail-cover-image"
            />
            <div className="blog-detail-cover-body">
              <h1>{blogArticle.title}</h1>
              <p>
                <time>{blogArticle.date}</time>
                <span aria-hidden>•</span>
                {blogArticle.readTime}
              </p>
            </div>
          </div>

          <div className="blog-detail-aside">
            <div className="blog-author-card">
              <div className="blog-author-top">
                <Image
                  src={authorPhoto}
                  alt={author.name}
                  width={100}
                  height={100}
                  className="blog-author-photo"
                />
                <a
                  href={author.linkedin}
                  aria-label={`${author.name} on LinkedIn`}
                  className="blog-author-linkedin"
                >
                  <SocialIcon name="LinkedIn" />
                </a>
              </div>
              <p className="blog-author-name">{author.name}</p>
              <p className="blog-author-role">{author.role}</p>
              <p className="blog-author-bio">{author.bio}</p>
            </div>

            <div className="blog-share-card">
              <p>{share.title}</p>
              <ShareLinksLazy networks={share.networks} />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
