import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    HOST_VERSIONS_API: process.env.HOST_VERSIONS_API || 'https://zviel.com/api/versions',
    // Add other environment-specific configurations here
  },
  // Other Next.js configurations
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
