import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/stocks/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=30, stale-while-revalidate=60' },
        ],
      },
      {
        source: '/ipo/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=15, stale-while-revalidate=30' },
        ],
      },
    ];
  },
  async redirects() {
    return [{
      source: '/:path*',
      has: [{ type: 'host', value: 'www.weestox.com' }],
      destination: 'https://weestox.com/:path*',
      permanent: true,
    }];
  },
};

export default nextConfig;
