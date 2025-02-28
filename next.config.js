/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  // Importante: non utilizzare basePath o assetPrefix in sviluppo
};

module.exports = nextConfig;