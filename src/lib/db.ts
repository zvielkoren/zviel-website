import { PrismaClient } from '@/generated/prisma'
import { PrismaD1 } from '@prisma/adapter-d1'
import { getCloudflareContext } from '@opennextjs/cloudflare'

/**
 * Dynamically initializes and returns the Prisma Client using Cloudflare's runtime context.
 * In Cloudflare Pages, bindings like 'DB' are not available on the global process.env.
 */
export function getPrisma() {
  // 1. Fetch the Cloudflare context during runtime (synchronous)
  const { env } = getCloudflareContext();
  const dbBinding = (env as any).DB;

  // 2. Validate that the D1 database binding is injected correctly
  if (!dbBinding) {
    throw new Error("D1 Database binding 'DB' was not found. Check your wrangler.toml or Cloudflare dashboard.");
  }

  // 3. Initialize the Prisma D1 adapter with the live binding object
  const adapter = new PrismaD1(dbBinding)
  return new PrismaClient({ adapter })
}