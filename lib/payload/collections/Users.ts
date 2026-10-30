import type { CollectionConfig } from "payload";

/**
 * CMS administrators.
 *
 * Registration is closed: every write requires an existing admin, so the REST
 * and GraphQL create endpoints refuse anonymous callers. The first account is
 * created with `scripts/create-admin.mts`, which goes through Payload's Local
 * API and therefore bypasses access on purpose.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "role", "updatedAt"],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    /**
     * Closed to the public, with one deliberate exception: while the collection
     * is empty, the first account may be created. Without that bootstrap nobody
     * could ever get in, because every other write already needs an admin. As
     * soon as one user exists the rule is admin-only for good.
     */
    create: async ({ req: { payload, user } }) => {
      if (user?.role === "admin") return true;
      const existing = await payload.count({ collection: "users" });
      return existing.totalDocs === 0;
    },
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
    },
  ],
};
