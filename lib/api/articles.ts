import axios from "axios";
import { apiClient } from "./client";
import type {
  BlogPost,
  BlogPostDetail,
  ListBlogParams,
  StoreSlug,
  SuccessResponse,
} from "./types";

const unwrap = <T>(payload: SuccessResponse<T>): T => payload.data;

const isRecoverable = (err: unknown) =>
  axios.isAxiosError(err) &&
  (err.response?.status === 404 ||
    err.code === "ERR_NETWORK" ||
    err.code === "ECONNABORTED");

export const blogApi = {
  list: async (
    store: StoreSlug = "family",
    params: ListBlogParams = {}
  ): Promise<BlogPost[]> => {
    try {
      const { data } = await apiClient.get<SuccessResponse<BlogPost[]>>(
        `/blog/${store}`,
        { params }
      );
      return unwrap(data);
    } catch (err) {
      if (isRecoverable(err)) return [];
      throw err;
    }
  },

  bySlug: async (
    slug: string,
    store: StoreSlug = "family"
  ): Promise<BlogPostDetail | null> => {
    try {
      const { data } = await apiClient.get<SuccessResponse<BlogPostDetail>>(
        `/blog/${store}/${slug}`
      );
      return unwrap(data);
    } catch (err) {
      if (isRecoverable(err)) return null;
      throw err;
    }
  },
};

export const articlesApi = blogApi;
