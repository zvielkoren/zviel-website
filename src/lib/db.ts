import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Minimal Cloudflare D1 type – covers the API surface used in this project. */
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<D1Result>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  first<T = Record<string, unknown>>(column?: string): Promise<T | null>;
}

export interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
}

export function getD1Client(): D1Database {
  const { env } = getCloudflareContext();
  const db = (env as any).DB as D1Database | undefined;
  if (!db) {
    throw new Error(
      "D1 binding 'DB' not available — ensure it is configured in wrangler.toml"
    );
  }
  return db;
}
