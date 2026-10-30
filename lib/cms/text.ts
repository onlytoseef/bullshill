/** URL-safe slug. Accents stripped, punctuation collapses to single hyphens. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The subset of Lexical's serialized shape this module walks. */
type LexicalNode = {
  type?: string;
  tag?: string;
  text?: string;
  children?: LexicalNode[];
};

function childrenOf(node: unknown): LexicalNode[] {
  const candidate = node as { children?: unknown } | null;
  return Array.isArray(candidate?.children)
    ? (candidate.children as LexicalNode[])
    : [];
}

/** Flattens a Lexical node tree to its text. */
export function lexicalToPlainText(node: unknown): string {
  const current = node as LexicalNode | null;
  if (!current) return "";

  if (typeof current.text === "string") return current.text;

  return childrenOf(current)
    .map((child) => lexicalToPlainText(child))
    .join(" ");
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/**
 * The article's headings, for the TOC rail.
 *
 * Ids are derived the same way the renderer derives them (see
 * `components/ui/rich-text.tsx`), so the anchors and the links always agree.
 */
export function lexicalHeadings(
  state: unknown,
  tags: readonly string[] = ["h2"],
): { id: string; title: string }[] {
  const root = state as { root?: unknown } | null;
  if (!root?.root) return [];

  return childrenOf(root.root)
    .filter(
      (node) => node.type === "heading" && tags.includes(node.tag ?? "h2"),
    )
    .map((node) => ({
      id: slugify(lexicalToPlainText(node)),
      title: lexicalToPlainText(node).trim(),
    }))
    .filter((heading) => heading.id.length > 0 && heading.title.length > 0);
}
