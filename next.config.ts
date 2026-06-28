import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  // Bundle @paalstack/* packages so their ES modules are handled by Next.js
  transpilePackages: ['@paalstack/react-ui', '@paalstack/react-hooks', '@paalstack/react-icons'],

  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
