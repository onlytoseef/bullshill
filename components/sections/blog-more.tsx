"use client";

import Image from "next/image";
import { useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/ui/post-card";
import { Container } from "@/components/ui/section";
import type { BlogPostView } from "@/lib/cms/types";
import { cn } from "@/lib/utils";
import findMoreIcon from "../../app/assets/images/find-more-icon.svg";

type Props = {
  title: string;
  cta: { label: string; href: string };
  /** `filters[0]` is the "show everything" chip. */
  filters: string[];
  posts: BlogPostView[];
};

/**
 * "More to read". The chips and filtering are untouched — they now derive from
 * the CMS categories instead of a hardcoded list, with "Featured" still driven
 * by the post's `featured` flag.
 */
export function BlogMore({ title, cta, filters, posts }: Props) {
  const [ALL] = filters;
  const [active, setActive] = useState<string>(ALL);

  const shown =
    active === ALL
      ? posts
      : posts.filter((post) => post.filters.includes(active));

  return (
    <section id="more-to-read" className="scroll-mt-24 py-12 sm:py-16">
      <Container>
        <Reveal className="text-center">
          <h2 className="blog-more-heading text-display-sm font-semibold text-white sm:text-display-md">
            {title}
          </h2>
        </Reveal>

        <Reveal
          delay={0.05}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              aria-pressed={active === filter}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
                active === filter
                  ? "border-orange bg-orange text-white"
                  : "border-surface-border bg-surface-raised text-blue-light-active hover:border-orange/50 hover:text-white",
              )}
            >
              {filter}
            </button>
          ))}
        </Reveal>

        {shown.length > 0 ? (
          <Stagger
            key={active}
            className="blog-post-grid blog-post-grid--more"
            itemClassName="h-full"
            stagger={0.08}
          >
            {shown.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </Stagger>
        ) : (
          <p className="mt-12 text-center text-sm text-blue-light-active">
            Nothing filed under {active} yet.
          </p>
        )}

        <Reveal className="mt-14 flex justify-center">
          <Button
            href={cta.href}
            variant="light"
            className="case-row-button cta-hover find-more-cta"
          >
            {cta.label}
            <Image src={findMoreIcon} alt="" width={24} height={24} />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
