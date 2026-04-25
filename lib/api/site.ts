import axios from "axios";
import { apiClient } from "./client";
import type {
  SitePageConfig,
  SitePageWithSections,
  SiteSettings,
  StoreSlug,
  SuccessResponse,
} from "./types";

const unwrap = <T>(payload: SuccessResponse<T>): T => payload.data;

const isRecoverable = (err: unknown) =>
  axios.isAxiosError(err) &&
  (err.response?.status === 404 ||
    err.code === "ERR_NETWORK" ||
    err.code === "ECONNABORTED");

export const siteApi = {
  settings: async (store: StoreSlug = "family"): Promise<SiteSettings | null> => {
    try {
      const { data } = await apiClient.get<SuccessResponse<SiteSettings | null>>(
        `/sites/${store}/settings`
      );
      return unwrap(data);
    } catch (err) {
      if (isRecoverable(err)) return null;
      throw err;
    }
  },

  page: async (
    slug: string,
    store: StoreSlug = "family"
  ): Promise<SitePageWithSections | null> => {
    try {
      const { data } = await apiClient.get<
        SuccessResponse<SitePageWithSections>
      >(`/sites/${store}/${slug}`);
      return unwrap(data);
    } catch (err) {
      if (isRecoverable(err)) return null;
      throw err;
    }
  },

  config: async (
    slug: string,
    store: StoreSlug = "family"
  ): Promise<SitePageConfig | null> => {
    try {
      const { data } = await apiClient.get<SuccessResponse<SitePageConfig>>(
        `/sites/${store}/${slug}/config`
      );
      return unwrap(data);
    } catch (err) {
      if (isRecoverable(err)) return null;
      throw err;
    }
  },
};
