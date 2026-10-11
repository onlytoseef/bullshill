"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Props = {
  title: string;
  items: readonly { id: string; title: string }[];
};

export function ArticleToc({ title, items }: Props) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-120px 0px -70% 0px" },
    );

    for (const { id } of items) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={title} className="blog-toc">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(active === item.id && "is-active")}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
