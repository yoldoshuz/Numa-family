import type {
  ListBlogParams,
  ListProductsParams,
  MarketplaceStoreSlug,
  StoreSlug,
} from "./types";

export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (stores: MarketplaceStoreSlug[], params: ListProductsParams = {}) =>
      [...queryKeys.products.all, "list", stores, params] as const,
    featured: (stores: MarketplaceStoreSlug[]) =>
      [...queryKeys.products.all, "featured", stores] as const,
    detail: (slug: string) =>
      [...queryKeys.products.all, "detail", slug] as const,
  },
  blog: {
    all: ["blog"] as const,
    list: (store: StoreSlug = "family", params: ListBlogParams = {}) =>
      [...queryKeys.blog.all, "list", store, params] as const,
    detail: (store: StoreSlug = "family", slug: string) =>
      [...queryKeys.blog.all, "detail", store, slug] as const,
  },
  site: {
    all: ["site"] as const,
    settings: (store: StoreSlug = "family") =>
      [...queryKeys.site.all, "settings", store] as const,
    page: (store: StoreSlug = "family", slug: string) =>
      [...queryKeys.site.all, "page", store, slug] as const,
    config: (store: StoreSlug = "family", slug: string) =>
      [...queryKeys.site.all, "config", store, slug] as const,
  },
};
