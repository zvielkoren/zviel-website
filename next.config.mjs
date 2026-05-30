/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    HOST_VERSIONS_API: process.env.HOST_VERSIONS_API || 'https://zvielkoren.com/api/versions',
    // Add other environment-specific configurations here
  },
  // Other Next.js configurations
  reactStrictMode: true,
};

export default nextConfig;
