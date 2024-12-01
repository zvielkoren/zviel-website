import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    HOST_VERSIONS_API: process.env.HOST_VERSIONS_API || 'https://zvielkoren.com/api/versions',
    // Add other environment-specific configurations here
  },
  // Other Next.js configurations
  reactStrictMode: true,
  swcMinify: true,
};

async function setupDevEnvironment() {
    if (process.env.NODE_ENV === 'development') {
        await setupDevPlatform();
    }
}

setupDevEnvironment();

export default nextConfig;
