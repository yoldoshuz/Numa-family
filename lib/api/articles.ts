import axios from "axios";
import { apiClient } from "./client";
import type {
  Article,
  ArticleDetail,
  ListArticlesParams,
  PaginatedArticles,
  SuccessResponse,
} from "./types";

const unwrap = <T>(payload: SuccessResponse<T>): T => payload.data;

const emptyList: PaginatedArticles = {
  articles: [],
  total: 0,
  page: 1,
  limit: 0,
  pages: 0,
};

const isRecoverable = (err: unknown) =>
  axios.isAxiosError(err) &&
  (err.response?.status === 404 ||
    err.code === "ERR_NETWORK" ||
    err.code === "ECONNABORTED");

export const articlesApi = {
  list: async (params: ListArticlesParams = {}): Promise<PaginatedArticles> => {
    try {
      const { data } = await apiClient.get<SuccessResponse<PaginatedArticles>>(
        "/blog/posts",
        { params }
      );
      return unwrap(data);
    } catch (err) {
      if (isRecoverable(err)) return emptyList;
      throw err;
    }
  },

  featured: async (store: string = "family"): Promise<Article[]> => {
    try {
      const { data } = await apiClient.get<SuccessResponse<Article[]>>(
        `/blog/featured/${store}`
      );
      return unwrap(data);
    } catch (err) {
      if (isRecoverable(err)) return [];
      throw err;
    }
  },

  bySlug: async (slug: string): Promise<ArticleDetail | null> => {
    try {
      const { data } = await apiClient.get<SuccessResponse<ArticleDetail>>(
        `/blog/posts/${slug}`
      );
      return unwrap(data);
    } catch (err) {
      if (isRecoverable(err)) return null;
      throw err;
    }
  },
};
