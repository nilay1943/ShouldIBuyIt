/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  ...(process.env.NODE_ENV === 'production' ? {
    output: 'export',
    images: {
      unoptimized: true,
    },
    basePath: '/ShouldIBuyIt',
    assetPrefix: '/ShouldIBuyIt/',
  } : {
    // Development config
    images: {
      unoptimized: true,
    }
  })
}

module.exports = nextConfig 