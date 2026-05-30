import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getD1Client(): IDBDatabase {
  const { env } = getCloudflareContext();
  const db = (env as any).DB as IDBDatabase | undefined;
  if (!db) {
    throw new Error(
      "D1 binding 'DB' not available — ensure it is configured in wrangler.toml"
    );
  }
  return db;
}
