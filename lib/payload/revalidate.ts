import { revalidatePath, revalidateTag } from "next/cache";

import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

/**
 * Publishing has to reach the public site without a redeploy.
 *
 * Every write — draft save, publish, unpublish, delete — invalidates the
 * listing, the sitemap and the affected article. Both the new and the previous
 * slug are cleared, because renaming a post leaves the old path cached too.
 *
 * The listing query itself is wrapped in `unstable_cache` with the
 * `blog-posts` tag (`lib/cms/posts.ts`), so that tag is cleared as well —
 * otherwise a published post would appear only when the 60-second window
 * lapsed.
 */
const blogPaths = (slug?: string | null): string[] => [
  "/",
  "/blog",
  "/sitemap.xml",
  ...(slug ? [`/blog/${slug}`] : []),
];

export const revalidateBlogPost: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
}) => {
  const paths = new Set([
    ...blogPaths(doc?.slug as string | undefined),
    ...blogPaths(previousDoc?.slug as string | undefined),
  ]);

  paths.forEach((path) => revalidatePath(path));
  revalidateTag("blog-posts", { expire: 0 });

  return doc;
};

export const revalidateBlogPostDelete: CollectionAfterDeleteHook = ({ doc }) => {
  blogPaths(doc?.slug as string | undefined).forEach((path) =>
    revalidatePath(path),
  );
  revalidateTag("blog-posts", { expire: 0 });

  return doc;
};

/**
 * Media edits reach the site without a redeploy.
 *
 * Every upload URL carries `?v=<updatedAt>` (see `lib/cms/media.ts`) so the
 * optimiser treats a revised image as a new object. That only helps once the
 * HTML referencing it is rebuilt, and the article pages are ISR — so an edit
 * has to invalidate them too, or they would keep the old `?v=` until their
 * 60-second window expired.
 */
export const revalidateMedia: CollectionAfterChangeHook = ({ doc }) => {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");

  return doc;
};

export const revalidateMediaDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");

  return doc;
};
