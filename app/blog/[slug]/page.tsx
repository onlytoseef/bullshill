import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogDetailBody } from "@/components/sections/blog-detail-body";
import { BlogDetailHero } from "@/components/sections/blog-detail-hero";
import { Partners } from "@/components/sections/partners";
import { blogArticle, blogSlugs } from "@/lib/content";

export const metadata: Metadata = {
  title: blogArticle.title,
  description: blogArticle.sections[0].paragraphs[0],
};

export function generateStaticParams() {
  return blogSlugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!blogSlugs.includes(slug)) notFound();

  return (
    <>
      <BlogDetailHero />
      <BlogDetailBody />
      <Partners variant="strip" />
    </>
  );
}
