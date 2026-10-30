import { Reveal } from "@/components/motion/reveal";
import { ArticleToc } from "@/components/ui/article-toc";
import { ArticleBody } from "@/components/ui/rich-text";
import { Container } from "@/components/ui/section";
import type { BlogArticleView } from "@/lib/cms/types";

/**
 * The article body.
 *
 * Payload's rich text renders inside the existing `.blog-article` container, so
 * the CSS that styles `.blog-article h2` / `p` does the typography — nothing
 * about the article design depends on the CMS. The TOC rail is always rendered
 * so the two-column grid keeps its shape; it simply has no nav when the post has
 * no headings yet.
 */
export function BlogDetailBody({ article }: { article: BlogArticleView }) {
  return (
    <section className="blog-detail-body">
      <Container>
        <div className="blog-detail-grid">
          <Reveal className="blog-article">
            <ArticleBody data={article.content} />
          </Reveal>

          <Reveal delay={0.1} className="blog-toc-rail">
            {article.toc.length > 0 ? (
              <ArticleToc title="In this article" items={article.toc} />
            ) : null}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
