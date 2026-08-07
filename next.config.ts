import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Editorial covers are large photographs; the default 75 is visibly lossy
    // on them, so 90 is allowed and used by the article components.
    qualities: [75, 90],
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
