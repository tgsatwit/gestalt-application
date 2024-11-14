/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Enable streaming for improved performance
  experimental: {
    serverActions: true,
    ppr: true,
  },
  // Improve page loading strategy
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Disable static optimization for dynamic routes
  staticPageGenerationTimeout: 1000,
}

module.exports = nextConfig