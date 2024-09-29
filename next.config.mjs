import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
        // Other configurations...
        experimental: {
          runtime: 'nodejs' // Make sure your API routes use the Node.js runtime
        },
      
};
if (process.env.NODE_ENV === 'development') {
    await setupDevPlatform();
  }
export default nextConfig;
