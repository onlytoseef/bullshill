import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { BlogPosts } from "./lib/payload/collections/BlogPosts";
import { Media } from "./lib/payload/collections/Media";
import { Users } from "./lib/payload/collections/Users";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Signs auth cookies and encrypts stored secrets. There is deliberately no
 * fallback: a missing value must fail at boot rather than quietly run with a
 * guessable default. Generate one with `openssl rand -hex 32`.
 */
const secret = process.env.PAYLOAD_SECRET;
if (!secret) {
  throw new Error(
    "PAYLOAD_SECRET is missing — add it to .env.local (openssl rand -hex 32).",
  );
}

export default buildConfig({
  admin: {
    user: "users",
  },
  collections: [Users, Media, BlogPosts],
  editor: lexicalEditor(),
  secret,
  typescript: {
    outputFile: path.resolve(dirname, "lib/payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? "",
    },
  }),
  sharp,
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
});
