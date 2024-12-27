/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Disable swc minification in WebContainer
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  webpack: (config) => {
    // Disable native addons in WebContainer
    config.resolve.alias = {
      ...config.resolve.alias,
      '@next/swc-linux-x64-gnu': false,
      '@next/swc-linux-x64-musl': false
    };
    return config;
  }
};

module.exports = nextConfig;