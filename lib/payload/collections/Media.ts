import path from "node:path";
import { fileURLToPath } from "node:url";

import type { CollectionConfig } from "payload";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Uploads for cover images and in-article art.
 *
 * Files land on local disk (`<project>/media`, gitignored). On the VPS that
 * directory has to be a mounted volume, otherwise a redeploy wipes the uploads
 * — noted in the deferred production phase.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "alt",
  },
  access: {
    // Public: the site renders these images to anonymous visitors.
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    staticDir: path.resolve(dirname, "../../../media"),
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "card", width: 768, height: 512, position: "centre" },
      { name: "og", width: 1200, height: 630, position: "centre" },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: { description: "Describe the image for screen readers and SEO." },
    },
  ],
};
