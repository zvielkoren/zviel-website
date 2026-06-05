import { getCloudflareContext } from '@opennextjs/cloudflare';

export function getD1(): any {
  let env: any = {};
  try {
    env = getCloudflareContext()?.env || {};
  } catch (e) {
    // Context might be unavailable during local Next.js dev server initialization
  }
  return env.DB || null;
}

export async function queryD1<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = getD1();
  if (!db) {
    console.warn("D1 Database binding 'DB' was not found. Returning empty array.");
    return [];
  }
  try {
    const stmt = db.prepare(sql).bind(...params);
    const res = await stmt.all();
    return (res.results || []) as T[];
  } catch (error) {
    console.error(`D1 query error for statement: ${sql}`, error);
    return [];
  }
}

export async function runD1(sql: string, params: any[] = []): Promise<boolean> {
  const db = getD1();
  if (!db) {
    console.warn("D1 Database binding 'DB' was not found. Mocking successful execution.");
    return true;
  }
  try {
    const stmt = db.prepare(sql).bind(...params);
    await stmt.run();
    return true;
  } catch (error) {
    console.error(`D1 execute error for statement: ${sql}`, error);
    return false;
  }
}