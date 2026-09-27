import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    const apiBaseUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    return [
      {
        source: "/api/ipo/live-stream",
        destination: `${apiBaseUrl.replace(/\/$/, "")}/v2/ipos/stream`,
      },
    ];
  },
};

export default nextConfig;
