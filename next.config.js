/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/ShouldIBuyIt' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ShouldIBuyIt/' : '',
  experimental: {
    runtime: 'edge',
  }
}

module.exports = nextConfig 