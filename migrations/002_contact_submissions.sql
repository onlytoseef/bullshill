-- Run against the same PostgreSQL database used by DATABASE_URI.
-- Requires the initial Payload CMS migration. Safe to run again.
DO $migration$
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('bullshill-cms-migration'));

  IF to_regclass('public.payload_migrations') IS NULL
     OR to_regclass('public.payload_locked_documents_rels') IS NULL THEN
    RAISE EXCEPTION 'Initial CMS tables are missing. Run npm run db:migrate first.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.payload_migrations
    WHERE name = '20261112_075413_contact_submissions'
  ) THEN
    RAISE NOTICE 'Contact submissions migration already applied; no changes made.';
    RETURN;
  END IF;

  CREATE TABLE public.contact_submissions (
    id serial PRIMARY KEY NOT NULL,
    name varchar NOT NULL,
    phone varchar,
    email varchar NOT NULL,
    message varchar NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE public.payload_locked_documents_rels
    ADD COLUMN contact_submissions_id integer;
  CREATE INDEX contact_submissions_updated_at_idx
    ON public.contact_submissions USING btree (updated_at);
  CREATE INDEX contact_submissions_created_at_idx
    ON public.contact_submissions USING btree (created_at);
  ALTER TABLE public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_contact_submissions_fk
    FOREIGN KEY (contact_submissions_id) REFERENCES public.contact_submissions(id)
    ON DELETE cascade ON UPDATE no action;
  CREATE INDEX payload_locked_documents_rels_contact_submissions_id_idx
    ON public.payload_locked_documents_rels USING btree (contact_submissions_id);

  INSERT INTO public.payload_migrations (name, batch)
    SELECT '20261112_075413_contact_submissions', COALESCE(MAX(batch), 0) + 1
    FROM public.payload_migrations;
  RAISE NOTICE 'Contact submissions table and dashboard relations created.';
END
$migration$;
