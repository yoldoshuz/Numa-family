import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "numa.yoldosh.uz" },
      { protocol: "https", hostname: "**.yoldosh.uz" },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
