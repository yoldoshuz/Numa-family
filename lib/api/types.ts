export type LocalizedText = {
  uz: string;
  ru: string;
  en: string;
};

export type StoreSlug = "nutrition" | "kids" | "halal" | "family";

export type ArticleStatus = "draft" | "published" | "archived";

export interface Article {
  id: string;
  title: LocalizedText;
  excerpt: LocalizedText | null;
  slug: string;
  coverImageUrl: string | null;
  store: StoreSlug | null;
  status: ArticleStatus;
  publishedAt: string | null;
  tags: string[];
  readTimeMinutes: number | null;
  viewCount: number;
  createdAt: string;
}

export interface ArticleDetail extends Article {
  content: LocalizedText;
  seoTitle: LocalizedText | null;
  seoDescription: LocalizedText | null;
  seoKeywords: string[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedArticles extends PaginationMeta {
  articles: Article[];
}

export interface SuccessResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ListArticlesParams {
  store?: StoreSlug;
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
}
