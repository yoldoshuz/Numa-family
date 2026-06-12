import axios from "axios";
import { apiClient, API_BASE_URL } from "./client";
import type {
  ListProductsParams,
  MarketplaceStoreSlug,
  Product,
  ProductListResponse,
  SuccessResponse,
} from "./types";

const unwrap = <T>(payload: SuccessResponse<T>): T => payload.data;

const isRecoverable = (err: unknown) =>
  axios.isAxiosError(err) &&
  (err.response?.status === 404 ||
    err.code === "ERR_NETWORK" ||
    err.code === "ECONNABORTED");

/**
 * Numa Family is informational and has no `/products` surface of its own — the
 * backend rejects `family` on every marketplace endpoint. The family storefront
 * therefore aggregates the three marketplace catalogs (nutrition + kids + halal).
 */
export const MARKETPLACE_STORES: MarketplaceStoreSlug[] = [
  "nutrition",
  "kids",
  "halal",
];

/** Origin of the backend (`https://numa.yoldosh.uz`) without the `/api/v1` suffix. */
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

/** Turn a possibly-relative media path (`/public/...`) into an absolute URL. */
export function resolveMediaUrl(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Pick the best image for a product card (main image → any image → any media). */
export function productImage(product: Product): string | null {
  const media = product.media ?? [];
  const main =
    media.find((m) => m.isMain && m.type === "image") ??
    media.find((m) => m.type === "image") ??
    media[0];
  return resolveMediaUrl(main?.url ?? null);
}

async function listStore(
  store: MarketplaceStoreSlug,
  params: ListProductsParams
): Promise<Product[]> {
  try {
    const { data } = await apiClient.get<SuccessResponse<ProductListResponse>>(
      `/products/store/${store}`,
      { params }
    );
    return unwrap(data).products ?? [];
  } catch (err) {
    if (isRecoverable(err)) return [];
    throw err;
  }
}

export const productsApi = {
  /** Merged catalog across the requested marketplace stores. */
  list: async (
    stores: MarketplaceStoreSlug[] = MARKETPLACE_STORES,
    params: ListProductsParams = { limit: 100 }
  ): Promise<Product[]> => {
    const results = await Promise.allSettled(
      stores.map((store) => listStore(store, params))
    );
    return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  },

  /** Featured products merged across marketplace stores. */
  featured: async (
    stores: MarketplaceStoreSlug[] = MARKETPLACE_STORES
  ): Promise<Product[]> => {
    const results = await Promise.allSettled(
      stores.map(async (store) => {
        try {
          const { data } = await apiClient.get<SuccessResponse<Product[]>>(
            `/products/featured/${store}`
          );
          return unwrap(data) ?? [];
        } catch (err) {
          if (isRecoverable(err)) return [];
          throw err;
        }
      })
    );
    return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  },

  /**
   * Resolve a single product by slug. Family aggregates 3 stores, so the slug is
   * looked up in each in parallel and the first match wins.
   */
  bySlug: async (
    slug: string,
    stores: MarketplaceStoreSlug[] = MARKETPLACE_STORES
  ): Promise<Product | null> => {
    const results = await Promise.allSettled(
      stores.map(async (store) => {
        const { data } = await apiClient.get<SuccessResponse<Product>>(
          `/products/${store}/${slug}`
        );
        return unwrap(data);
      })
    );
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) return r.value;
    }
    return null;
  },
};
