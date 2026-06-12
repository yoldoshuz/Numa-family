export type LocalizedText = {
  uz: string;
  ru: string;
  en: string;
};

export type MultilingualText = LocalizedText;

export type StoreSlug = "nutrition" | "kids" | "halal" | "family";
export type MarketplaceStoreSlug = "nutrition" | "kids" | "halal";

export type BlogPostStatus = "draft" | "published" | "archived";

export interface BlogPost {
  id: string;
  title: MultilingualText;
  excerpt: MultilingualText | null;
  slug: string;
  coverImageUrl: string | null;
  store: StoreSlug;
  status: BlogPostStatus;
  publishedAt: string | null;
  tags: string[];
  readTimeMinutes: number | null;
  viewCount: number;
  createdAt: string;
}

export interface BlogProductCard {
  blogPostId: string;
  productId: string;
  store: MarketplaceStoreSlug;
  note: string | null;
  sortOrder: number;
  product: {
    id: string;
    name: MultilingualText;
    price: number | string;
    discountPrice: number | string | null;
    store: string;
    slug?: string;
    brand?: string | null;
    imageUrl?: string | null;
    media?: ProductMedia[];
  };
}

// ---------- Product (marketplace catalog, read-only for family) ----------

export type ProductStatus = "active" | "draft" | "archived";

export interface ProductMedia {
  id: string;
  url: string;
  type: "image" | "video";
  isMain: boolean;
  sortOrder: number;
}

export interface ProductCategoryRef {
  id: string;
  name?: MultilingualText;
  slug?: string;
}

export interface Product {
  id: string;
  name: MultilingualText;
  description?: MultilingualText | null;
  slug: string;
  sku?: string;
  price: number | string;
  discountPrice?: number | string | null;
  stock?: number;
  unit?: string;
  store: MarketplaceStoreSlug;
  categoryId?: string;
  category?: ProductCategoryRef | null;
  status?: ProductStatus;
  isFeatured?: boolean;
  brand?: string | null;
  attributes?: Record<string, string | number | boolean> | null;
  media?: ProductMedia[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ListProductsParams {
  categoryId?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "price" | "name";
  sortDir?: "asc" | "desc";
}

export interface BlogPostDetail extends BlogPost {
  content: MultilingualText;
  seoTitle: MultilingualText | null;
  seoDescription: MultilingualText | null;
  seoKeywords: string[];
  products: BlogProductCard[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface SuccessResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ListBlogParams {
  limit?: number;
  offset?: number;
}

// ---------- Site ----------

export type SectionType =
  | "hero"
  | "text_block"
  | "features"
  | "gallery"
  | "cta"
  | "faq"
  | "stats"
  | "team"
  | "reviews"
  | "custom";

export interface SectionStyle {
  backgroundColor?: string;
  textColor?: string;
  paddingTop?: number;
  paddingBottom?: number;
  maxWidth?: string;
}

export interface SiteSection {
  id: string;
  pageId: string;
  type: SectionType;
  sortOrder: number;
  content: Record<string, unknown>;
  style?: SectionStyle | null;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SitePage {
  id: string;
  store: StoreSlug;
  slug: string;
  metaTitle?: Record<string, string> | null;
  metaDescription?: Record<string, string> | null;
  ogImage?: string | null;
  ogType?: string | null;
  canonicalUrl?: string | null;
  structuredData?: Record<string, unknown> | null;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SitePageWithSections extends SitePage {
  sections: SiteSection[];
}

export interface SiteBranding {
  logoUrl?: string;
  faviconUrl?: string;
  siteName?: MultilingualText;
}

export interface SiteColorPalette {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
}

export interface SiteTypography {
  headingFont?: string;
  bodyFont?: string;
  baseFontSize?: number;
}

export interface SiteContact {
  phone?: string;
  email?: string;
  address?: MultilingualText;
  workingHours?: string;
}

export interface SiteSocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface SiteNavChild {
  id: string;
  label: MultilingualText;
  url: string;
  target: "_self" | "_blank";
  sortOrder: number;
  isVisible: boolean;
}

export interface SiteNavItem extends SiteNavChild {
  children?: SiteNavChild[];
}

export interface SiteFooterLink {
  label: MultilingualText;
  url: string;
  target?: "_self" | "_blank";
}

export interface SiteFooterColumn {
  title: MultilingualText;
  links: SiteFooterLink[];
}

export interface SiteFooter {
  columns?: SiteFooterColumn[];
  copyright?: MultilingualText;
}

export interface SiteSettings {
  id: string;
  store: StoreSlug;
  branding?: SiteBranding;
  colors?: SiteColorPalette;
  typography?: SiteTypography;
  contact?: SiteContact;
  socialLinks?: SiteSocialLink[];
  navigation?: SiteNavItem[];
  footer?: SiteFooter;
  customHeadCode?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SitePageConfig {
  settings: SiteSettings | null;
  page: SitePageWithSections;
}
