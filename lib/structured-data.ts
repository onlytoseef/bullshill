import { footer } from "@/lib/content";
import { SITE_NAME } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export type SchemaNode = Record<string, unknown>;
export type SchemaLink = { name: string; path: string };
export type PageSchemaOptions = {
  path: string;
  name: string;
  description?: string;
  type?: "WebPage" | "CollectionPage" | "ContactPage";
  parents?: SchemaLink[];
  items?: SchemaLink[];
  entity?: SchemaNode;
};

export const organizationId = `${SITE_URL}/#organization`;
export const websiteId = `${SITE_URL}/#website`;
export const absoluteUrl = (path: string) => new URL(path, `${SITE_URL}/`).href;

export function isoDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function pageSchema({ path, name, description, type = "WebPage", parents = [], items, entity }: PageSchemaOptions) {
  const url = absoluteUrl(path);
  const pageId = `${url}#webpage`;
  const breadcrumbs = path === "/" ? [] : [{ name: "Home", path: "/" }, ...parents, { name, path }];
  const entityId = entity ? `${url}#main-entity` : undefined;
  const listId = items?.length ? `${url}#item-list` : undefined;
  const graph: SchemaNode[] = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: SITE_NAME,
      url: SITE_URL,
      description: footer.description,
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon.png") },
      sameAs: footer.socials.filter(({ label }) => label !== "Discord").map(({ href }) => href),
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "en",
      publisher: { "@id": organizationId },
    },
    {
      "@type": type,
      "@id": pageId,
      url,
      name,
      description,
      inLanguage: "en",
      isPartOf: { "@id": websiteId },
      about: { "@id": organizationId },
      ...(breadcrumbs.length ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
      ...(entityId || listId ? { mainEntity: { "@id": entityId ?? listId } } : {}),
    },
  ];
  if (breadcrumbs.length) graph.push({
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path),
    })),
  });
  if (listId && items) graph.push({
    "@type": "ItemList",
    "@id": listId,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name, url: absoluteUrl(item.path),
    })),
  });
  if (entity) graph.push({ ...entity, "@id": entityId, url, mainEntityOfPage: { "@id": pageId } });
  return { "@context": "https://schema.org", "@graph": graph };
}

// CMS text must not be able to terminate the script element.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
