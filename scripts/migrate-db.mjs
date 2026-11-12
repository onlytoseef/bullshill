import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));
nextRequire("@next/env").loadEnvConfig(root, process.env.NODE_ENV !== "production");

const pgRequire = createRequire(require.resolve("@payloadcms/db-postgres"));
const { Client } = pgRequire("pg");
const migrationName = "20261105_094052_initial_cms";
const contactMigrationName = "20261112_075413_contact_submissions";

async function migrateContactSubmissions(client, checkOnly = false) {
  const { rows } = await client.query(
    "SELECT 1 FROM public.payload_migrations WHERE name = $1",
    [contactMigrationName],
  );
  if (rows.length) return;
  if (checkOnly) {
    console.log("Contact submissions migration is pending.");
    return;
  }
  await client.query(readFileSync(path.join(root, "migrations/002_contact_submissions.sql"), "utf8"));
  console.log("Contact submissions table and dashboard relations created.");
}

async function existingSchemaMatches(client) {
  const snapshot = JSON.parse(readFileSync(path.join(root, "migrations/20261105_094052_initial_cms.json"), "utf8"));
  const { rows: columns } = await client.query(
    "SELECT table_name,column_name,udt_name,is_nullable FROM information_schema.columns WHERE table_schema = 'public'",
  );
  const tables = Object.values(snapshot.tables);
  if (!columns.some((column) => tables.some((table) => table.name === column.table_name))) return false;

  const types = { serial: "int4", integer: "int4", varchar: "varchar", numeric: "numeric", jsonb: "jsonb", boolean: "bool", "timestamp(3) with time zone": "timestamptz" };
  const problems = [];
  for (const table of tables) {
    for (const expected of Object.values(table.columns)) {
      const actual = columns.find((column) => column.table_name === table.name && column.column_name === expected.name);
      if (!actual || actual.udt_name !== (types[expected.type] ?? expected.type) ||
        (actual.is_nullable === "NO") !== Boolean(expected.notNull)) {
        problems.push(table.name + "." + expected.name);
      }
    }
  }
  const { rows: enums } = await client.query(
    "SELECT t.typname, e.enumlabel FROM pg_type t JOIN pg_enum e ON e.enumtypid = t.oid JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname = 'public' ORDER BY e.enumsortorder",
  );
  for (const expected of Object.values(snapshot.enums)) {
    const actual = enums.filter((value) => value.typname === expected.name).map((value) => value.enumlabel);
    if (JSON.stringify(actual) !== JSON.stringify(expected.values)) problems.push(expected.name);
  }
  const { rows: indexes } = await client.query("SELECT indexname FROM pg_indexes WHERE schemaname = 'public'");
  const { rows: constraints } = await client.query("SELECT conname FROM pg_constraint WHERE connamespace = 'public'::regnamespace");
  for (const table of tables) {
    for (const index of Object.values(table.indexes)) {
      if (!indexes.some((actual) => actual.indexname === index.name)) problems.push(index.name);
    }
    for (const key of Object.values(table.foreignKeys)) {
      if (!constraints.some((actual) => actual.conname === key.name)) problems.push(key.name);
    }
  }
  if (problems.length) {
    throw new Error("Existing CMS schema differs from this migration: " + problems.slice(0, 8).join(", ") + ". No tables or data were changed.");
  }
  return true;
}

async function migrate() {
  if (!process.env.DATABASE_URI?.trim()) {
    throw new Error("DATABASE_URI is missing. Set it in .env.local or your server environment.");
  }
  const client = new Client({
    connectionString: process.env.DATABASE_URI,
    connectionTimeoutMillis: 10000,
  });
  try {
    await client.connect();
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext('bullshill-cms-migration'))");
    await client.query("SET LOCAL search_path TO public");
    const { rows } = await client.query("SELECT to_regclass('public.payload_migrations') AS existing");
    let applied = false;
    if (rows[0].existing) {
      const result = await client.query(
        "SELECT 1 FROM public.payload_migrations WHERE name = $1",
        [migrationName],
      );
      applied = result.rowCount > 0;
    }
    if (process.argv.includes("--check")) {
      const matches = applied || await existingSchemaMatches(client);
      if (rows[0].existing) await migrateContactSubmissions(client, true);
      await client.query("ROLLBACK");
      console.log(matches ? "Existing CMS schema verified. No database changes made." : "No CMS tables found; initial migration can be applied.");
      return;
    }
    if (applied) {
      console.log("CMS migration already applied; nothing to change.");
    } else if (await existingSchemaMatches(client)) {
      await client.query(
        "INSERT INTO public.payload_migrations (name, batch) VALUES ($1, 1)",
        [migrationName],
      );
      console.log("Existing CMS schema verified; initial migration recorded. Existing data preserved.");
    } else {
      const sql = readFileSync(path.join(root, "migrations/001_initial_cms.sql"), "utf8");
      await client.query(sql);
      console.log("CMS tables created successfully.");
    }
    await migrateContactSubmissions(client);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    await client.end();
  }
}

migrate().catch((error) => {
  const message = error instanceof Error ? error.message : "Migration failed.";
  console.error(message.replace(/postgres(?:ql)?:\/\/[^\s]+/gi, "[redacted DATABASE_URI]"));
  process.exitCode = 1;
});
