import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/creator.jpg",
        destination: "/creator-v2.jpg",
      },
    ];
  },
};

export default nextConfig;
