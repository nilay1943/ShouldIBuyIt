/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/FinanceHelper',
  assetPrefix: '/FinanceHelper',
}

module.exports = nextConfig 