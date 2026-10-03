import { site } from "@/lib/content";

/** Thin strip above the nav. */
export function AnnouncementBar() {
  return (
    <div className="border-b border-surface-border/50 bg-surface-raised">
      <p className="flex items-center justify-center gap-2 px-6 py-2.5 text-center text-xs text-blue-light-active">
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-orange" />
        {site.announcement}
      </p>
    </div>
  );
}
