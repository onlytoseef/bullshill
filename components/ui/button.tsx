import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "whitespace-nowrap transition-colors duration-200 " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // The hero / nav call to action.
  primary: "bg-orange text-white hover:bg-orange-hover active:bg-orange-active",
  // Outlined, for secondary actions on dark surfaces.
  secondary:
    "border border-surface-border text-blue-light hover:border-orange hover:text-orange",
  ghost: "text-blue-light-active hover:text-white",
  // For use on the light cream CTA panel, where the page's dark navy is the
  // high-contrast choice.
  inverse: "bg-blue-darker text-white hover:bg-blue-dark",
  // The inverse of `inverse`: a light pill on a dark surface.
  light: "bg-white text-blue-darker hover:bg-blue-light",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsLink = BaseProps & {
  href: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">;

type ButtonAsButton = BaseProps & {
  href?: never;
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

type ButtonProps = ButtonAsLink | ButtonAsButton;

/**
 * Renders a `<Link>` when given an `href`, otherwise a `<button>`.
 *
 * Server Component — no interactivity of its own. Hover and focus states are
 * plain CSS, so this never needs to ship to the client.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}
