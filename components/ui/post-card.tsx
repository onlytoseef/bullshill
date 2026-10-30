import Image from "next/image";
import Link from "next/link";

import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import type { BlogPostView } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

type Props = {
  post: BlogPostView;
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
        {/* A cover replaces the design's gradient only when one was uploaded;
            otherwise the card looks exactly as it always has. */}
        {post.cover ? (
          <div className="blog-post-image relative overflow-hidden">
            <Image
              src={post.cover.url}
              alt={post.cover.alt}
              fill
              sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 360px"
              className="object-cover"
            />
          </div>
        ) : (
          <PlaceholderVisual
            from={post.from}
            to={post.to}
            className="blog-post-image"
          />
        )}

        <div className="blog-post-copy">
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <time>{post.date}</time>
        </div>
      </Link>
    </article>
  );
}
