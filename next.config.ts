import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  // DEBUG: uncomment this to run with pnpm/symlinks
  // webpack(config) {
  //   // Ensure webpack follows symlinks correctly
  //   config.resolve.symlinks = true;
  //   return config;
  // },
};

export default nextConfig;
