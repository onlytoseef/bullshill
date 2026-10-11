import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function Wordmark({ className }: Props) {
  return (
    <span
      className={cn("text-lg font-semibold tracking-tight select-none", className)}
    >
      {site.name}
      <span className="text-orange">.</span>
    </span>
  );
}
