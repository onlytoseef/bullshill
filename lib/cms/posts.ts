import { unstable_cache } from "next/cache";

import { getCms } from "./client";
import { mediaUrl } from "./media";
import { countWords, lexicalHeadings, lexicalToPlainText } from "./text";
import type { BlogArticleView, BlogCover, BlogPostView } from "./types";

/**
 * The gradient pairs the design already used for placeholder art. Picking one
 * from the slug keeps an article's card stable between renders without storing
 * a colour in the CMS.
 */
const GRADIENTS: readonly (readonly [string, string])[] = [
  ["#1d4ed8", "#0b1d4a"],
  ["#16a34a", "#052e16"],
  ["#f59e0b", "#44270b"],
  ["#ea580c", "#431407"],
  ["#7c3aed", "#2a1358"],
  ["#0ea5e9", "#082f49"],
  ["#6b7280", "#1f2937"],
  ["#eab308", "#0b3a22"],
];

function gradientFor(slug: string) {
  let hash = 0;
  for (let index = 0; index < slug.length; index += 1) {
    hash = (hash * 31 + slug.charCodeAt(index)) >>> 0;
  }
  const [from, to] = GRADIENTS[hash % GRADIENTS.length];
  return { from, to };
}

/** Fixed locale and zone so server and client can never disagree. */
function formatDate(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  });
}

type MediaDoc = {
  url?: string | null;
  alt?: string | null;
  updatedAt?: string | null;
} | number | null;

type PostDoc = {
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  coverImage?: MediaDoc;
  content?: unknown;
  featured?: boolean | null;
  categories?: { label?: string | null }[] | null;
  author?: {
    name?: string | null;
    role?: string | null;
    bio?: string | null;
    linkedin?: string | null;
  } | null;
  seo?: {
    title?: string | null;
    description?: string | null;
  } | null;
};

function coverFrom(value?: MediaDoc): BlogCover | null {
  if (!value || typeof value !== "object" || !value.url) return null;
  return {
    url: mediaUrl(value.url, value.updatedAt),
    alt: value.alt ?? "",
  };
}

function labelsOf(items?: { label?: string | null }[] | null): string[] {
  return (items ?? [])
    .map((item) => item.label?.trim() ?? "")
    .filter((label) => label.length > 0);
}

function toPostView(doc: PostDoc): BlogPostView {
  const slug = doc.slug ?? "";
  const categories = labelsOf(doc.categories);

  return {
    slug,
    title: doc.title ?? "Untitled",
    excerpt: doc.excerpt ?? "",
    date: formatDate(doc.publishedAt ?? doc.createdAt),
    category: categories[0] ?? "Article",
    filters: [...(doc.featured ? ["Featured"] : []), ...categories],
    ...gradientFor(slug),
    cover: coverFrom(doc.coverImage),
  };
}

function toArticleView(doc: PostDoc): BlogArticleView {
  const base = toPostView(doc);
  const words = countWords(lexicalToPlainText(doc.content));
  const author = doc.author;

  return {
    ...base,
    publishedAt: doc.publishedAt ?? doc.createdAt ?? null,
    updatedAt: doc.updatedAt ?? null,
    readTime: `${Math.max(1, Math.round(words / 200))} min read`,
    seo: {
      title: doc.seo?.title?.trim() || null,
      description: doc.seo?.description?.trim() || null,
    },
    author:
      author?.name
        ? {
            name: author.name,
            role: author.role ?? "",
            bio: author.bio ?? "",
            linkedin: author.linkedin ?? "#",
          }
        : null,
    toc: lexicalHeadings(doc.content),
    content: doc.content ?? null,
  };
}

/**
 * The only fields the cards and the listing read. `content` (a Lexical tree of
 * ~10 KB per post), `author`, `seo` and `tags` are deliberately absent: they
 * are article-page data, and pulling them here was the bulk of the homepage's
 * Payload work. `updatedAt` rides along because the cover URL is versioned
 * from it.
 */
const LISTING_SELECT = {
  slug: true,
  title: true,
  excerpt: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  featured: true,
  categories: { label: true },
  coverImage: { url: true, alt: true, updatedAt: true },
} as const;

/**
 * How long a cached listing may be served before Payload is asked again.
 * Kept in step with `revalidate` in the blog routes; publishing invalidates
 * immediately through `revalidateBlogPost`, so this is only the backstop.
 */
export const REVALIDATE = 60;

async function readPublishedPosts(limit?: number): Promise<BlogPostView[]> {
  const cms = await getCms();
  if (!cms) return [];

  try {
    const result = await cms.find({
      collection: "blog-posts",
      depth: 1,
      pagination: false,
      select: LISTING_SELECT,
      ...(limit === undefined ? {} : { limit }),
      sort: ["-publishedAt", "-createdAt", "-id"],
      where: { _status: { equals: "published" } },
    });

    return (result.docs as PostDoc[]).map(toPostView);
  } catch (error) {
    console.warn("[cms] could not read blog posts", error);
    return [];
  }
}

/**
 * Every published article, newest first.
 *
 * `_status` is filtered here *and* enforced by the collection's `access.read`,
 * so a draft cannot reach the site even if this query is ever changed.
 *
 * Cached for `REVALIDATE` seconds. The homepage is `force-dynamic`, so without
 * this every visit re-queried Payload — the single largest share of its TTFB.
 * Publishing, unpublishing and deleting a post all call `revalidatePath("/")`
 * from the collection's hooks, so a change shows up on the next request rather
 * than waiting for the window to lapse. The limit is part of the cache key, so
 * the homepage's six and the listing's "all" are cached separately.
 */
export function getPublishedPosts(limit?: number): Promise<BlogPostView[]> {
  return unstable_cache(
    () => readPublishedPosts(limit),
    ["blog-posts", "published", limit === undefined ? "all" : String(limit)],
    { revalidate: REVALIDATE, tags: ["blog-posts"] },
  )();
}

/** One published article, or `null` — never a draft, never a 500. */
export async function getPostBySlug(
  slug: string,
): Promise<BlogArticleView | null> {
  const cms = await getCms();
  if (!cms) return null;

  try {
    const result = await cms.find({
      collection: "blog-posts",
      depth: 1,
      limit: 1,
      where: {
        and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
      },
    });

    const doc = result.docs[0] as PostDoc | undefined;
    return doc ? toArticleView(doc) : null;
  } catch (error) {
    console.warn(`[cms] could not read the post "${slug}"`, error);
    return null;
  }
}

/** Slugs only — what `generateStaticParams` needs. */
export async function getPublishedSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return posts.map((post) => post.slug).filter((slug) => slug.length > 0);
}

/**
 * Slug + last-modified for the sitemap. Drafts are excluded by the same
 * `_status` filter, so an unpublished post disappears from `/sitemap.xml` on the
 * next revalidation.
 */
export async function getPublishedPostEntries(): Promise<
  { slug: string; updatedAt: string | null }[]
> {
  const cms = await getCms();
  if (!cms) throw new Error("Sitemap CMS initialization failed");

  const entries: { slug: string; updatedAt: string | null }[] = [];
  let cursor: number | string | undefined;
  let batch = 0;
  while (true) {
    batch++;
    // Keyset pagination avoids offset skips when an earlier row is deleted.
    // Only the fields used by the sitemap are loaded; no rich text or media.
    let result;
    try {
      result = await cms.find({
        collection: "blog-posts",
        depth: 0,
        draft: false,
        overrideAccess: false,
        limit: 200,
        pagination: true,
        page: 1,
        select: { id: true, slug: true, updatedAt: true },
        sort: "id",
        where: {
          and: [
            { _status: { equals: "published" } },
            ...(cursor === undefined ? [] : [{ id: { greater_than: cursor } }]),
          ],
        },
      });
    } catch (error) {
      console.error(JSON.stringify({
        event: "sitemap.query_failed", timestamp: new Date().toISOString(),
        batch, blogCountRead: entries.length,
        errorName: error instanceof Error ? error.name : "UnknownError",
      }));
      // A partial traversal must never become a successful cached sitemap.
      throw new Error("Sitemap published-post query failed", { cause: error });
    }

    const docs = result.docs as (PostDoc & { id: string | number; updatedAt?: string | null })[];
    for (const doc of docs) {
      if (!doc.slug) throw new Error("Published sitemap post has no slug");
      entries.push({ slug: doc.slug, updatedAt: doc.updatedAt ?? null });
    }
    if (!result.hasNextPage) break;
    const nextCursor = docs.at(-1)?.id;
    if (nextCursor === undefined || nextCursor === cursor) {
      throw new Error("Sitemap pagination did not advance");
    }
    cursor = nextCursor;
  }
  return entries;
}
