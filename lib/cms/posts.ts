import { getCms } from "./client";
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

type MediaDoc = { url?: string | null; alt?: string | null } | number | null;

type PostDoc = {
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
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

/**
 * How long a fetched blog payload stays fresh.
 *
 * NOT exported on purpose: the pages that set `revalidate` have to write the
 * number as a literal, because Next reads segment config by static analysis at
 * build time. An imported binding fails that check with "Invalid segment
 * configuration export detected" — which is a hard production build error. If
 * this changes, change those two pages with it.
 */
const REVALIDATE = 60;

/** Payload serves uploads from here, on this same origin. */
const UPLOAD_PATH = "/api/media/";

/**
 * Payload prefixes upload URLs with `serverURL`, so a cover arrives as
 * `http://localhost:3000/api/media/file/….png`. `next/image` only optimises
 * same-origin paths — or hosts listed in `images.remotePatterns` — so an
 * absolute URL pointing at this very server is rejected at render time.
 *
 * Our own uploads are returned relative, which sidesteps that entirely and
 * keeps working whichever host `NEXT_PUBLIC_SERVER_URL` happens to hold.
 * Anything else (a future external CDN, say) is passed through untouched.
 */
function mediaUrl(url: string): string {
  if (url.startsWith(UPLOAD_PATH)) return url;

  try {
    const parsed = new URL(url);
    return parsed.pathname.startsWith(UPLOAD_PATH)
      ? `${parsed.pathname}${parsed.search}`
      : url;
  } catch {
    return url;
  }
}

function coverFrom(value?: MediaDoc): BlogCover | null {
  if (!value || typeof value !== "object" || !value.url) return null;
  return { url: mediaUrl(value.url), alt: value.alt ?? "" };
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
 * Every published article, newest first.
 *
 * `_status` is filtered here *and* enforced by the collection's `access.read`,
 * so a draft cannot reach the site even if this query is ever changed.
 */
export async function getPublishedPosts(): Promise<BlogPostView[]> {
  const cms = await getCms();
  if (!cms) return [];

  try {
    const result = await cms.find({
      collection: "blog-posts",
      depth: 1,
      limit: 200,
      sort: "-publishedAt",
      where: { _status: { equals: "published" } },
    });

    return (result.docs as PostDoc[]).map(toPostView);
  } catch (error) {
    console.warn("[cms] could not read blog posts", error);
    return [];
  }
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
  if (!cms) return [];

  try {
    const result = await cms.find({
      collection: "blog-posts",
      depth: 0,
      limit: 200,
      sort: "-publishedAt",
      where: { _status: { equals: "published" } },
    });

    return (result.docs as (PostDoc & { updatedAt?: string | null })[])
      .filter((doc) => Boolean(doc.slug))
      .map((doc) => ({
        slug: doc.slug as string,
        updatedAt: doc.updatedAt ?? null,
      }));
  } catch (error) {
    console.warn("[cms] could not read blog entries for the sitemap", error);
    return [];
  }
}
