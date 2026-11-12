import type { CollectionConfig } from "payload";

/**
 * Contact-form submissions, kept as an archive the team can browse in the
 * Payload admin (`/admin`).
 *
 * The public form never hits this collection's REST endpoint — it is written
 * through the local API from a server action, which bypasses access control.
 * Every access rule here is therefore admin-only, so the endpoint can't be
 * used to read submissions or spam rows directly.
 */
export const ContactSubmissions: CollectionConfig = {
  slug: "contact-submissions",
  labels: {
    singular: "Contact submission",
    plural: "Contact submissions",
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "phone", "createdAt"],
    description: "Queries submitted through the website contact form.",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "phone", type: "text" },
    { name: "email", type: "email", required: true },
    { name: "message", type: "textarea", required: true },
  ],
};
