import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogDetailBody } from "@/components/sections/blog-detail-body";
import { BlogDetailHero } from "@/components/sections/blog-detail-hero";
import { FinalCta } from "@/components/sections/final-cta";
import { Partners } from "@/components/sections/partners";
import { getPostBySlug, getPublishedSlugs, REVALIDATE } from "@/lib/cms/posts";
import { pageMetadata } from "@/lib/seo";

export const revalidate = REVALIDATE;

type Props = {
  params: Promise<{ slug: string }>;
};

/** Only published slugs get prerendered; a draft never produces a route. */
export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Per-slug metadata from the CMS. `seo.title`/`seo.description` win when an
 * editor set them, otherwise the post's own title and excerpt are used — so
 * every article has a real description and a self-referencing canonical.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return pageMetadata({
    title: post.seo.title ?? post.title,
    description: post.seo.description ?? post.excerpt,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Unknown slug, or a draft: 404 rather than a stub page. With an empty CMS
  // that is every /blog/* URL — which is exactly why nothing is indexed until
  // you publish something.
  if (!post) notFound();

  return (
    <>
      <BlogDetailHero article={post} />
      <BlogDetailBody article={post} />
      <Partners variant="strip" />
      <FinalCta variant="page" />
    </>
  );
}
