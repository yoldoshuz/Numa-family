"use client";

import { useQuery } from "@tanstack/react-query";
import {
  MARKETPLACE_STORES,
  productsApi,
} from "@/lib/api/products";
import { queryKeys } from "@/lib/api/queryKeys";
import type { ListProductsParams, MarketplaceStoreSlug } from "@/lib/api/types";

export function useProducts(
  stores: MarketplaceStoreSlug[] = MARKETPLACE_STORES,
  params: ListProductsParams = { limit: 100 }
) {
  return useQuery({
    queryKey: queryKeys.products.list(stores, params),
    queryFn: () => productsApi.list(stores, params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedProducts(
  stores: MarketplaceStoreSlug[] = MARKETPLACE_STORES
) {
  return useQuery({
    queryKey: queryKeys.products.featured(stores),
    queryFn: () => productsApi.featured(stores),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => productsApi.bySlug(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
}
