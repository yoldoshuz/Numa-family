import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { blogApi } from "@/lib/api/articles";

/*
 * Where this site actually answers. It was `https://numafamily.uz`, which has
 * never resolved, so every URL the sitemap published was dead — the worst
 * possible thing to hand a crawler. The env var is the seam for the day the
 * brand domain is finally cut over; until then it is the deploy URL.
 */
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://numa-family.vercel.app";

/**
 * The article list below is read from the CMS with axios, which Next's fetch
 * cache knows nothing about — without this the sitemap is whatever the backend
 * answered at build time and never learns about a new article.
 */
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/blog", "/contact"];

  const staticPages = locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1 : 0.8,
    }))
  );

  // Article slugs come from the CMS. Never let a backend hiccup break the build.
  let slugs: string[] = [];
  try {
    const posts = await blogApi.list("family", { limit: 200 });
    slugs = Array.from(new Set(posts.map((p) => p.slug)));
  } catch {
    slugs = [];
  }

  const articlePages = locales.flatMap((locale) =>
    slugs.map((slug) => ({
      url: `${baseUrl}/${locale}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...articlePages];
}
