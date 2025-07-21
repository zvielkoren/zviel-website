/** @type {import('next').NextConfig} */
const nextConfig = {
  
  runtime: 'node',
  env: {
    EDGE_RUNTIME: '1',
  },
  async rewrites() {
    return [
      {
        source: '/AutoGalleryTool/:path*',
        destination: 'https://zvielkoren.com/AutoGalleryTool/:path*',
      },
    ];
  },
}

module.exports = nextConfig
