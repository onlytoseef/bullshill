# Server database migrations

Deploy the project, including `scripts/` and `migrations/`, and install its dependencies.
Set `DATABASE_URI` to the server's PostgreSQL database in the environment or a root
`.env.production.local` file. Run from the project root:

```sh
NODE_ENV=production npm run db:migrate
```

This creates the initial CMS tables if needed, then the contact submissions table,
indexes, and dashboard document-lock relation. Applied migrations are recorded;
running the command again preserves existing submissions.

For a database that already has the initial CMS tables, the standalone SQL file
can also be run using PostgreSQL's `psql` client:

```sh
psql "$DATABASE_URI" -v ON_ERROR_STOP=1 -f migrations/002_contact_submissions.sql
```

The `psql` command requires `DATABASE_URI` to be exported in the shell; it does not
load Next.js `.env` files. The SQL file runs atomically and skips an already
recorded contact migration. A conflicting, unrecorded table causes an error
without deleting any existing data.

Restart the deployed application after deploying the updated code. Sign in at
`/admin` and open **Contact submissions** to view form messages. The migration
does not create sample submissions or send emails.
