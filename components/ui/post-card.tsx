import Link from "next/link";

import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import type { BlogPost } from "@/lib/content";
import { cn } from "@/lib/utils";

type Props = {
  post: BlogPost;
  href?: string;
  className?: string;
};

export function PostCard({
  post,
  href = `/blog/${post.slug}`,
  className,
}: Props) {
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

          <time className="mt-auto pt-5 text-xs text-blue-light-active/70">
            {post.date}
          </time>
        </div>
      </Link>
    </article>
  );
}
