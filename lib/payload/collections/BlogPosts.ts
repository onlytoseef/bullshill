import type { CollectionConfig } from "payload";

import {
  revalidateBlogPost,
  revalidateBlogPostDelete,
} from "@/lib/payload/revalidate";

/** URL-safe slug. Accents are stripped, punctuation collapses to hyphens. */
function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "publishedAt"],
  },
  // Gives every document a `_status` of draft | published.
  versions: {
    drafts: true,
  },
  access: {
    /**
     * The one rule that matters: anonymous callers only ever see published
     * documents. That is what keeps drafts out of the site, the REST/GraphQL
     * API and the sitemap — the query layer never has to remember to filter.
     */
    read: ({ req: { user } }) =>
      user ? true : { _status: { equals: "published" } },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [revalidateBlogPost],
    afterDelete: [revalidateBlogPostDelete],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "Generated from the title when left empty.",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const typed = typeof value === "string" ? value.trim() : "";
            const fallback =
              typeof data?.title === "string" ? data.title.trim() : "";
            return slugify(typed || fallback);
          },
        ],
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      maxLength: 220,
      admin: { description: "Shown on the blog cards." },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      // Optional on purpose: without one the site keeps the design's gradient.
      admin: {
        description:
          "Optional. Leave empty to use the design's gradient placeholder.",
      },
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "author",
      type: "group",
      admin: { description: "Shown in the article's author card." },
      fields: [
        { name: "name", type: "text" },
        { name: "role", type: "text" },
        { name: "bio", type: "textarea" },
        { name: "linkedin", type: "text" },
      ],
    },
    {
      name: "categories",
      type: "array",
      admin: { description: "Feeds the ·More to read· filter chips." },
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Drives the ·Featured· chip and the listing hero.",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "seo",
      type: "group",
      label: "SEO",
      fields: [
        {
          name: "title",
          type: "text",
          maxLength: 70,
          admin: { description: "Falls back to the post title." },
        },
        {
          name: "description",
          type: "textarea",
          maxLength: 160,
          admin: { description: "Falls back to the excerpt." },
        },
        {
          name: "ogImage",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
  ],
};
