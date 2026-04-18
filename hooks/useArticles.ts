"use client";

import { useQuery } from "@tanstack/react-query";
import { articlesApi } from "@/lib/api/articles";
import { queryKeys } from "@/lib/api/queryKeys";
import type { ListArticlesParams } from "@/lib/api/types";

export function useArticles(params: ListArticlesParams = {}) {
  return useQuery({
    queryKey: queryKeys.articles.list(params),
    queryFn: () => articlesApi.list(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedArticles(store: string = "family") {
  return useQuery({
    queryKey: queryKeys.articles.featured(store),
    queryFn: () => articlesApi.featured(store),
    staleTime: 1000 * 60 * 5,
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: queryKeys.articles.detail(slug),
    queryFn: () => articlesApi.bySlug(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
}
