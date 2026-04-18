import type { ListArticlesParams } from "./types";

export const queryKeys = {
  articles: {
    all: ["articles"] as const,
    list: (params: ListArticlesParams = {}) =>
      [...queryKeys.articles.all, "list", params] as const,
    featured: (store: string = "family") =>
      [...queryKeys.articles.all, "featured", store] as const,
    detail: (slug: string) =>
      [...queryKeys.articles.all, "detail", slug] as const,
  },
};
