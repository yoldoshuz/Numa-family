import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { products } from "@/data/products";

const baseUrl = "https://numa.uz";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/products", "/about", "/blog", "/contact"];

  const staticPages = locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1 : 0.8,
    }))
  );

  const productPages = locales.flatMap((locale) =>
    products.map((product) => ({
      url: `${baseUrl}/${locale}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...productPages];
}
