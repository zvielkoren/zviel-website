import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import { getCloudflareContext } from '@opennextjs/cloudflare'

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export function getPrisma() {
  if (globalThis.prismaGlobal) {
    return globalThis.prismaGlobal;
  }

  let env: any = {};
  try {
    env = getCloudflareContext()?.env || {};
  } catch (e) {
    console.warn("Failed to retrieve Cloudflare context:", e);
  }

  const dbBinding = env.DB;

  let client: PrismaClient;
  if (!dbBinding) {
    console.warn("D1 Database binding 'DB' was not found. Using default PrismaClient fallback.");
    client = new PrismaClient();
  } else {
    const adapter = new PrismaD1(dbBinding);
    client = new PrismaClient({ adapter });
  }

  if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = client;
  }

  return client;
}