import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Use remotePatterns instead of domains for fine-grained control over
    // allowed external image sources (Next.js >= 12.3+ / 13.x).
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.pexels.com',
        port: '',
        pathname: '/**',
      },
      // Fallback: allow either http or https schemata if required by any
      // external sources. Uncomment if you need http support.
      // {
      //   protocol: 'http',
      //   hostname: 'images.pexels.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;
