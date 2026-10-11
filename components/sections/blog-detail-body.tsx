import { Reveal } from "@/components/motion/reveal";
import { ArticleToc } from "@/components/ui/article-toc";
import { Container } from "@/components/ui/section";
import { blogArticle } from "@/lib/content";

export function BlogDetailBody() {
  const sections = blogArticle.sections.filter(
    (section) => section.paragraphs.length > 0,
  );

  return (
    <section className="blog-detail-body">
      <Container>
        <div className="blog-detail-grid">
          <Reveal className="blog-article">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </Reveal>

          <Reveal delay={0.1} className="blog-toc-rail">
            <ArticleToc
              title={blogArticle.tocTitle}
              items={blogArticle.sections}
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
