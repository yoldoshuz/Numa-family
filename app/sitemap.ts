import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { productsApi } from "@/lib/api/products";

const baseUrl = "https://numa.uz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/products", "/about", "/blog", "/contact"];

  const staticPages = locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1 : 0.8,
    }))
  );

  // Product slugs come from the merged marketplace catalog. Never let a backend
  // hiccup break the sitemap build.
  let slugs: string[] = [];
  try {
    const products = await productsApi.list();
    slugs = Array.from(new Set(products.map((p) => p.slug)));
  } catch {
    slugs = [];
  }

  const productPages = locales.flatMap((locale) =>
    slugs.map((slug) => ({
      url: `${baseUrl}/${locale}/products/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...productPages];
}
