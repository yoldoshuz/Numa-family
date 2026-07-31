import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { blogApi } from "@/lib/api/articles";

const baseUrl = "https://numafamily.uz";

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
