/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.guim.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'i.guim.co.uk',
      },
    ],
    minimumCacheTTL: 2678400, // 31 days cache
    formats: ['image/webp'],
    qualities: [65, 75], // Lower qualities for smaller files
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Common small image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Target device breakpoints
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ]
  },
}

module.exports = withMDX(nextConfig)