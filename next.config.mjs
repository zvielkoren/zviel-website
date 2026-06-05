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
  experimental: {
    optimizePackageImports: [
      "@heroui/react",
      "@heroui/styles",
      "react-icons",
      "framer-motion"
    ]
  },
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization.minimize = true;
    }
    return config;
  }
};

export default nextConfig;
