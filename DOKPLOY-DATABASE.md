# Create the CMS tables

Run the same command locally or in the Dokploy **application terminal**, from the directory containing package.json:

```sh
npm run db:migrate
```

Locally, put the database URL in `.env.local`. On Dokploy, set it in the application's environment:

```dotenv
DATABASE_URI=postgresql://USER:PASSWORD@POSTGRES_HOST:5432/DATABASE_NAME
```

Use Dokploy's internal PostgreSQL host, not localhost, when the database is in a separate container. The database must already exist.

The script applies `migrations/001_initial_cms.sql`, which was generated from this project's Payload collections. It creates **15 tables**, including blog posts, drafts/versions, users, media and Payload's internal tables, with their indexes and relationships. It records the migration in Payload's migration table. Running the command again skips an already-applied migration. If Payload already created the matching schema in dev mode, it verifies the schema and records the initial migration instead of recreating tables.

All changes run in a transaction. An error rolls back the migration. If existing tables differ from the expected schema, it stops rather than overwriting them. Do not delete existing tables to bypass that error. To verify the existing schema without changing the database, run `npm run db:migrate -- --check`.

Deploy `scripts/migrate-db.mjs`, the `migrations` directory and the updated `package.json` with the app. No new npm package is required.

Afterward, restart the app and open `/admin` to save/publish posts. The app also needs its existing `PAYLOAD_SECRET` and other Payload environment settings. This migration creates the schema; it does not insert sample posts or repair an incorrect database URL.

If you prefer running the SQL file directly with psql:

```sh
psql "$DATABASE_URI" --single-transaction -v ON_ERROR_STOP=1 -f migrations/001_initial_cms.sql
```

The Node command checks migration history and is safe to repeat; direct psql execution is for the initial run and will report an error if the schema already exists.

Uploaded images still need a persistent volume for the application's `media` directory; database tables store media metadata, not the image files.

Validation performed: SQL was generated using the installed Payload schema generator and checked against its migration snapshot; the runner's syntax and lint were checked. The migration has not been applied to your local or production database.
