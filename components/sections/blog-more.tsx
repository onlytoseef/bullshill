"use client";

import Image from "next/image";
import { useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/ui/post-card";
import { Container } from "@/components/ui/section";
import { blogPage } from "@/lib/content";
import { cn } from "@/lib/utils";
import findMoreIcon from "../../app/assets/images/find-more-icon.svg";

const { more } = blogPage;
const [ALL] = more.filters;

export function BlogMore() {
  const [active, setActive] = useState<string>(ALL);

  const posts =
    active === ALL
      ? more.posts
      :
        more.posts.filter((post) =>
          (post.filters as readonly string[]).includes(active),
        );

  return (
    <section id="more-to-read" className="scroll-mt-24 py-12 sm:py-16">
      <Container>
        <Reveal className="text-center">
          <h2 className="blog-more-heading text-display-sm font-semibold text-white sm:text-display-md">
            {more.title}
          </h2>
        </Reveal>

        <Reveal
          delay={0.05}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {more.filters.map((filter) => (
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

        {posts.length > 0 ? (
          <Stagger
            key={active}
            className="blog-post-grid blog-post-grid--more"
            itemClassName="h-full"
            stagger={0.08}
          >
            {posts.map((post) => (
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
            href={more.cta.href}
            variant="light"
            className="case-row-button"
          >
            {more.cta.label}
            <Image src={findMoreIcon} alt="" width={24} height={24} />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
