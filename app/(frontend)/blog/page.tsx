import type { Metadata } from "next";

import { BlogFeatured } from "@/components/sections/blog-featured";
import { BlogHero } from "@/components/sections/blog-hero";
import { BlogMore } from "@/components/sections/blog-more";
import { FinalCta } from "@/components/sections/final-cta";
import { Partners } from "@/components/sections/partners";
import { Container } from "@/components/ui/section";
import { getPublishedPosts } from "@/lib/cms/posts";
import { blogPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

/**
 * Literal, not imported: Next reads segment config by static analysis at build
 * time, and an imported binding fails that check with "Invalid segment
 * configuration export detected" — a dev-only warning that is a hard build
 * error in production. Keep this number in step with `REVALIDATE` in
 * `lib/cms/posts.ts`.
 */
export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Playbooks, post-mortems and strong opinions on Web3 marketing — token launches, community building, and landing pages that convert.",
  path: "/blog",
});

const ALL = "All articles";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  // Nothing published yet — the hero stays, the listing does not invent posts.
  if (posts.length === 0) {
    return (
      <>
        <BlogHero />
        <Container>
          <p className="py-16 text-center text-sm text-blue-light-active">
            No articles published yet — check back soon.
          </p>
        </Container>
        <Partners variant="strip" />
        <FinalCta variant="page" />
      </>
    );
  }

  // A post flagged "featured" leads; otherwise the newest one does.
  const featured =
    posts.find((post) => post.filters.includes("Featured")) ?? posts[0];
  const rest = posts.filter((post) => post.slug !== featured.slug);
  const secondary = rest.slice(0, 2);
  const more = rest.slice(2);

  // Chips are the CMS categories; "Featured" stays a fixed concept.
  const categories = Array.from(
    new Set(
      posts.flatMap((post) =>
        post.filters.filter((filter) => filter !== "Featured"),
      ),
    ),
  );
  const filters = [ALL, "Featured", ...categories];

  return (
    <>
      <BlogHero />
      <BlogFeatured featured={featured} secondary={secondary} />
      {more.length > 0 ? (
        <BlogMore
          title={blogPage.more.title}
          cta={blogPage.more.cta}
          filters={filters}
          posts={more}
        />
      ) : null}
      <Partners variant="strip" />
      <FinalCta variant="page" />
    </>
  );
}
