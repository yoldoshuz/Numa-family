"use client";

import { useQuery } from "@tanstack/react-query";
import { blogApi } from "@/lib/api/articles";
import { queryKeys } from "@/lib/api/queryKeys";
import type { ListBlogParams, StoreSlug } from "@/lib/api/types";

export function useArticles(
  store: StoreSlug = "family",
  params: ListBlogParams = {}
) {
  return useQuery({
    queryKey: queryKeys.blog.list(store, params),
    queryFn: () => blogApi.list(store, params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useArticle(slug: string, store: StoreSlug = "family") {
  return useQuery({
    queryKey: queryKeys.blog.detail(store, slug),
    queryFn: () => blogApi.bySlug(slug, store),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
}
