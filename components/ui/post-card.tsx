import Link from "next/link";

import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import type { BlogPost } from "@/lib/content";
import { cn } from "@/lib/utils";

type Props = {
  post: BlogPost;
  /**
   * Detail routes don't exist yet, so cards point at a placeholder. Swap for
   * `/blog/${post.slug}` once `app/blog/[slug]/page.tsx` lands.
   */
  href?: string;
  className?: string;
};

/**
 * Article card: inset artwork above title, excerpt and date.
 *
 * The whole card is one link, with the heading as its accessible name — the
 * date and excerpt sit inside and don't need separate tab stops.
 */
export function PostCard({ post, href = "#", className }: Props) {
  return (
    <article className={cn("h-full", className)}>
      <Link
        href={href}
        className="group flex h-full flex-col rounded-3xl border border-surface-border bg-surface-card p-3 transition-colors hover:border-orange/50"
      >
        <PlaceholderVisual
          from={post.from}
          to={post.to}
          className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-[1.02]"
        />

        <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
          <h3 className="text-lg font-semibold text-balance text-white">
            {post.title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-blue-light-active">
            {post.excerpt}
          </p>

          {/* `mt-auto` pins the date to the bottom so it lines up across a row
              of cards with differently sized titles. */}
          <time className="mt-auto pt-5 text-xs text-blue-light-active/70">
            {post.date}
          </time>
        </div>
      </Link>
    </article>
  );
}
