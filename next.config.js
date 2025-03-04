/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '',
  basePath: '',
  trailingSlash: true,
  ...(process.env.NODE_ENV === 'production' ? {
    output: 'export',
  } : {})
}

module.exports = nextConfig