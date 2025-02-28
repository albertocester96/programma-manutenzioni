/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  images: {
    unoptimized: true,
  },
  // Importante: non utilizzare basePath o assetPrefix in sviluppo
};

module.exports = nextConfig;