/** @type {import('next').NextConfig} */
const nextConfig = {
  
  runtime: 'node',
  env: {
    EDGE_RUNTIME: '1',
  },

}

module.exports = nextConfig
