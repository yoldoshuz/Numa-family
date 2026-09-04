import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * Back to the pre-Next-16 minute.
     *
     * The default became 4 hours, and the optimizer has no invalidation hook —
     * so a photo swapped in the admin could sit stale on the site for that long
     * with nothing anyone could press to fix it. The catalogue's imagery is
     * edited by hand and expected to appear immediately, which is worth far
     * more here than the revalidation the longer default saves.
     */
    minimumCacheTTL: 60,
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
