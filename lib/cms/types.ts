/**
 * The shapes the blog components already speak.
 *
 * Payload document → these views happens in `lib/cms/posts.ts`; nothing outside
 * `lib/cms/` imports a Payload type, so swapping the CMS later touches one
 * directory.
 */

export type BlogCover = {
  url: string;
  alt: string;
};

/** What the cards and the listing need. Matches `PostCard`'s props. */
export type BlogPostView = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  filters: string[];
  /** Gradient pair — the design's placeholder while a cover is absent. */
  from: string;
  to: string;
  cover: BlogCover | null;
};

/** Everything the article page needs. */
export type BlogArticleView = BlogPostView & {
  readTime: string;
  /** Per-post SEO overrides; both fall back to the title/excerpt. */
  seo: {
    title: string | null;
    description: string | null;
  };
  author: {
    name: string;
    role: string;
    bio: string;
    linkedin: string;
  } | null;
  toc: { id: string; title: string }[];
  /** Raw Lexical JSON, rendered by `components/ui/rich-text.tsx`. */
  content: unknown;
};
