import { getPayload, type Payload } from "payload";

let client: Payload | null = null;
let pending: Promise<Payload | null> | null = null;

/**
 * Loads the Payload config lazily, on first use.
 *
 * `payload.config.ts` throws at module scope when `PAYLOAD_SECRET` is missing —
 * correct for the admin, which cannot run without it, but fatal for the public
 * site: a static import here meant the whole production build died while
 * collecting `/sitemap.xml`, before any of the fail-soft handling below could
 * run. Importing it inside the chain puts a missing secret on the same footing
 * as an unreachable database: the blog renders empty and the build still ships.
 */
async function loadConfig() {
  const loaded = await import("@payload-config");
  return loaded.default;
}

/**
 * The one Payload instance this process uses.
 *
 * Fail-soft by design: if the config cannot be built, or the database is
 * unreachable, the caller gets `null` and renders an empty blog rather than a
 * 500 — the site must keep serving even when the CMS is down. The instance is
 * cached on success only, so a database that comes back up is picked up without
 * a restart.
 */
export async function getCms(): Promise<Payload | null> {
  if (client) return client;

  if (!pending) {
    pending = loadConfig()
      .then((config) => getPayload({ config }))
      .then((payload) => {
        client = payload;
        return payload;
      })
      .catch((error: unknown) => {
        console.warn(
          "[cms] Payload is unavailable — the blog will render empty.",
          error instanceof Error ? error.message : error,
        );
        return null;
      })
      .finally(() => {
        pending = null;
      });
  }

  return pending;
}
