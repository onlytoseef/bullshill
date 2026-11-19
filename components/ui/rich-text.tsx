import {
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type { ComponentProps } from "react";

import { mediaUrl } from "@/lib/cms/media";
import { lexicalToPlainText, slugify } from "@/lib/cms/text";

/** The populated upload behind an `upload` node, as the converter receives it. */
type UploadValue = {
  url?: string | null;
  alt?: string | null;
  updatedAt?: string | null;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  filename?: string | null;
  sizes?: Record<string, { url?: string | null } | null> | null;
};

/**
 * Headings get an `id` derived exactly the way `lexicalHeadings` derives the
 * TOC entries, which is what makes the article's TOC links land. Images reuse
 * Payload's default markup but run their URL through the same versioned helper
 * the covers use — an unversioned upload URL would keep serving the optimiser's
 * year-long cached copy after the image was edited in place.
 */
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag ?? "h2";
    const id = slugify(lexicalToPlainText(node));

    return <Tag id={id}>{nodesToJSX({ nodes: node.children })}</Tag>;
  },
  upload: ({ node }) => {
    const upload = node.value as UploadValue | number | null;
    if (!upload || typeof upload !== "object" || !upload.url) return null;

    const alt = upload.alt ?? "";
    const src = mediaUrl(upload.url, upload.updatedAt);
    if (upload.mimeType && !upload.mimeType.startsWith("image")) {
      return (
        <a href={src} rel="noopener noreferrer">
          {upload.filename}
        </a>
      );
    }

    return <img alt={alt} height={upload.height ?? undefined} src={src} width={upload.width ?? undefined} />;
  },
});

type RichTextData = ComponentProps<typeof RichText>["data"];

export function ArticleBody({ data }: { data: unknown }) {
  return <RichText data={data as RichTextData} converters={converters} />;
}
