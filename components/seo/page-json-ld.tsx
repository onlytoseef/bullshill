import { pageSchema, serializeJsonLd, type PageSchemaOptions } from "@/lib/structured-data";

export function PageJsonLd(props: PageSchemaOptions) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(pageSchema(props)) }} />;
}
