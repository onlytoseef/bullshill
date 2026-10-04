"use client";

import { useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { SendBadge } from "@/components/ui/icons";
import { PostCard } from "@/components/ui/post-card";
import { Container } from "@/components/ui/section";
import { blogPage } from "@/lib/content";
import { cn } from "@/lib/utils";

const { more } = blogPage;
/** First filter is the catch-all, so it needs no membership test. */
const [ALL] = more.filters;

/**
 * The filterable archive below the featured stories.
 *
 * Client-side because the whole archive is already in the bundle — filtering it
 * over the network would be slower and no more correct.
 */
export function BlogMore() {
  const [active, setActive] = useState<string>(ALL);

  const posts =
    active === ALL
      ? more.posts
      : // `as const` on the content makes these literal tuples; widen so the
        // runtime string from state is an acceptable argument.
        more.posts.filter((post) =>
          (post.filters as readonly string[]).includes(active),
        );

  return (
    <section id="more-to-read" className="scroll-mt-24 py-12 sm:py-16">
      <Container>
        <Reveal className="text-center">
          <h2 className="text-display-sm font-semibold text-white sm:text-display-md">
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
          // Keyed by filter so the stagger replays on each change instead of
          // swapping the cards in silently.
          <Stagger
            key={active}
            className="mt-10 grid gap-6 sm:grid-cols-2"
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
          <Button href={more.cta.href} variant="light" size="md">
            {more.cta.label}
            <SendBadge />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
