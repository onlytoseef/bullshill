import { revalidatePath } from "next/cache";

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
 */
const blogPaths = (slug?: string | null): string[] => [
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

  return doc;
};

export const revalidateBlogPostDelete: CollectionAfterDeleteHook = ({ doc }) => {
  blogPaths(doc?.slug as string | undefined).forEach((path) =>
    revalidatePath(path),
  );

  return doc;
};
