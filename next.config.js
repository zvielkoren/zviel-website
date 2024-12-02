/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/adapter-d1'],
  },
  env: {
    EDGE_RUNTIME: '1',
  }
}

module.exports = nextConfig
