import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
    
};

async function setupDevEnvironment() {
    if (process.env.NODE_ENV === 'development') {
        await setupDevPlatform();
    }
}

setupDevEnvironment();

export default nextConfig;
