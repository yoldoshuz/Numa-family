"use client";

import { useQuery } from "@tanstack/react-query";
import { siteApi } from "@/lib/api/site";
import { queryKeys } from "@/lib/api/queryKeys";
import type { StoreSlug } from "@/lib/api/types";

export function useSitePage(slug: string, store: StoreSlug = "family") {
  return useQuery({
    queryKey: queryKeys.site.page(store, slug),
    queryFn: () => siteApi.page(slug, store),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSitePageConfig(slug: string, store: StoreSlug = "family") {
  return useQuery({
    queryKey: queryKeys.site.config(store, slug),
    queryFn: () => siteApi.config(slug, store),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSiteSettings(store: StoreSlug = "family") {
  return useQuery({
    queryKey: queryKeys.site.settings(store),
    queryFn: () => siteApi.settings(store),
    staleTime: 1000 * 60 * 5,
  });
}
