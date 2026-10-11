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
      <Link href={href} className="blog-post-card group">
        <PlaceholderVisual
          from={post.from}
          to={post.to}
          className="blog-post-image"
        />

        <div className="blog-post-copy">
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <time>{post.date}</time>
        </div>
      </Link>
    </article>
  );
}
