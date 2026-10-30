import {
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type { ComponentProps } from "react";

import { lexicalToPlainText, slugify } from "@/lib/cms/text";

/**
 * Headings get an `id` derived exactly the way `lexicalHeadings` derives the
 * TOC entries, which is what makes the article's TOC links land. Everything else
 * keeps Payload's default converters, so the existing `.blog-article h2` /
 * `.blog-article p` CSS styles the output unchanged.
 */
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag ?? "h2";
    const id = slugify(lexicalToPlainText(node));

    return <Tag id={id}>{nodesToJSX({ nodes: node.children })}</Tag>;
  },
});

type RichTextData = ComponentProps<typeof RichText>["data"];

export function ArticleBody({ data }: { data: unknown }) {
  return <RichText data={data as RichTextData} converters={converters} />;
}
