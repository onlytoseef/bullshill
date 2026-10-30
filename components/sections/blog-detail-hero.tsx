import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { Container } from "@/components/ui/section";
import { ShareLinksLazy } from "@/components/ui/share-links-lazy";
import { SocialIcon } from "@/components/ui/social-icons";
import type { BlogArticleView } from "@/lib/cms/types";
import authorPhoto from "../../app/assets/team-section/Muhammad Jawad Nawaz.webp";

const SHARE = {
  title: "Share with your community!",
  networks: ["Facebook", "X", "LinkedIn"],
};

/**
 * The article's cover, aside and byline. Only the data source changed — the
 * cover falls back to the design's gradient when the post has no upload, and
 * the author card is hidden rather than faked when no author is set.
 */
export function BlogDetailHero({ article }: { article: BlogArticleView }) {
  return (
    <section className="blog-detail-hero">
      <div
        aria-hidden
        className="page-hero-backdrop page-hero-backdrop--image"
      />

      <Container className="relative z-10">
        <Reveal trigger="mount" className="blog-detail-grid">
          <div className="blog-detail-cover">
            {article.cover ? (
              <div className="blog-detail-cover-image relative overflow-hidden">
                <Image
                  src={article.cover.url}
                  alt={article.cover.alt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 695px"
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <PlaceholderVisual
                from={article.from}
                to={article.to}
                className="blog-detail-cover-image"
              />
            )}

            <div className="blog-detail-cover-body">
              <h1>{article.title}</h1>
              <p>
                <time>{article.date}</time>
                <span aria-hidden>•</span>
                {article.readTime}
              </p>
            </div>
          </div>

          <div className="blog-detail-aside">
            {article.author ? (
              <div className="blog-author-card">
                <div className="blog-author-top">
                  <Image
                    src={authorPhoto}
                    alt={article.author.name}
                    width={100}
                    height={100}
                    className="blog-author-photo"
                  />
                  <a
                    href={article.author.linkedin || "#"}
                    aria-label={`${article.author.name} on LinkedIn`}
                    className="blog-author-linkedin"
                  >
                    <SocialIcon name="LinkedIn" />
                  </a>
                </div>
                <p className="blog-author-name">{article.author.name}</p>
                <p className="blog-author-role">{article.author.role}</p>
                {article.author.bio ? (
                  <p className="blog-author-bio">{article.author.bio}</p>
                ) : null}
              </div>
            ) : null}

            <div className="blog-share-card">
              <p>{SHARE.title}</p>
              <ShareLinksLazy networks={SHARE.networks} />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
