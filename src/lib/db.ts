import { PrismaClient } from '../generated/prisma'
import { PrismaD1 } from '@prisma/adapter-d1'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export function getPrisma() {
  const { env } = getCloudflareContext();

  // Cast 'env' to 'any' to bypass the missing DB property error in CloudflareEnv
  const cloudflareEnv = env as any;
  const dbBinding = cloudflareEnv.DB;

  if (!dbBinding) {
    throw new Error("D1 Database binding 'DB' was not found.");
  }

  const adapter = new PrismaD1(dbBinding)
  return new PrismaClient({ adapter })

}