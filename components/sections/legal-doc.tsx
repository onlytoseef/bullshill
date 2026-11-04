import type { ReactNode } from "react";

import { PageHero } from "@/components/sections/page-hero";
import { ParticleBackground } from "@/components/motion/particle-background";
import { ArticleToc } from "@/components/ui/article-toc";
import { Container } from "@/components/ui/section";
import type { LegalBlock, LegalDocument } from "@/lib/legal";

function withTokens(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\])/g).map((part, i) =>
    part.startsWith("[") && part.endsWith("]") ? (
      <span key={i} className="legal-token">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function ListItem({ text }: { text: string }) {
  const match = text.match(/^([^:]{2,34}):\s([\s\S]+)$/);
  if (match) {
    return (
      <li>
        <b>{match[1]}:</b> {withTokens(match[2])}
      </li>
    );
  }
  return <li>{withTokens(text)}</li>;
}

function Block({ block }: { block: LegalBlock }) {
  if ("p" in block) {
    return <p className="legal-p">{withTokens(block.p)}</p>;
  }
  if ("h" in block) {
    return <h3 className="legal-subheading">{block.h}</h3>;
  }
  if ("ul" in block) {
    return (
      <ul className="legal-list">
        {block.ul.map((item) => (
          <ListItem key={item} text={item} />
        ))}
      </ul>
    );
  }
  return (
    <dl className="legal-defs">
      {block.dl.map((item) => (
        <div key={item.term}>
          <dt>{item.term}</dt>
          <dd>{withTokens(item.text)}</dd>
        </div>
      ))}
    </dl>
  );
}

export function LegalDoc({ doc }: { doc: LegalDocument }) {
  const tocItems = doc.sections.map((section) => ({
    id: section.id,
    title: section.heading,
  }));

  return (
    <>
      <PageHero title={doc.title} eyebrow="Legal" subtitle={doc.intro}>
            <p className="legal-meta">
              <time>{doc.date}</time>
              <span aria-hidden>·</span>
              <span className="legal-author">@{doc.author}</span>
            </p>
            <p className="legal-note">{withTokens(doc.editorNote)}</p>
      </PageHero>

      <section className="legal-body has-particles inner-content-grains">
        <ParticleBackground />
        <Container>
          <div className="legal-grid">
            <div className="legal-article">
              {doc.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="legal-section"
                >
                  <h2>{section.heading}</h2>
                  {section.blocks.map((block, blockIndex) => (
                    <Block key={blockIndex} block={block} />
                  ))}
                </section>
              ))}

              <div className="legal-contact">
                <p>
                  Business name: <b>{doc.contact.business}</b>
                </p>
                <p>
                  Email:{" "}
                  <a href={`mailto:${doc.contact.email}`}>{doc.contact.email}</a>
                </p>
              </div>
            </div>

            <div className="legal-toc-rail">
              <ArticleToc title="Contents" items={tocItems} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
