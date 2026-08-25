import { apiClient } from "./client";
import type { StoreSlug, SuccessResponse } from "./types";

/** Every CMS string arrives in all three languages; the site picks one. */
type I18nText = Record<"uz" | "ru" | "en", string>;

export interface ApiReview {
  id: string;
  store: StoreSlug;
  title: I18nText;
  description: I18nText;
  authorName: string | null;
  rating: number | null;
  videoUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface ApiReviewList {
  items: ApiReview[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/** A review shaped the way the section already renders one. */
export interface ReviewCard {
  text: string;
  name: string;
  avatar: string;
  rating: number;
}

/**
 * Avatars are not a CMS field. They cycle through the portraits the section was
 * designed around, so a review added in the admin lands looking like the rest
 * without anyone having to upload a picture for it.
 */
const AVATARS = [
  "/img/avatar-malika.png",
  "/img/avatar-azizbek.png",
  "/img/avatar-shahnoza.png",
];

/**
 * Published reviews, in the reader's language.
 *
 * `null` means "use the copy bundled in the dictionary" — returned both when
 * the CMS cannot be reached and when it answers with nothing. The empty case is
 * deliberate: the reviews are being migrated into the CMS store by store, and
 * until this one is filled in, an empty response would silently delete a
 * section that is on the page today. The moment the admin publishes one review,
 * the CMS wins.
 */
export async function getReviews(
  locale: "uz" | "ru" | "en",
  store: StoreSlug = "family",
): Promise<ReviewCard[] | null> {
  try {
    const { data } = await apiClient.get<SuccessResponse<ApiReviewList>>(
      `/reviews/${store}`,
      { params: { limit: 50 } },
    );

    const items = data.data?.items ?? [];
    if (!items.length) return null;

    return items.map((review, index) => ({
      text: review.description[locale] ?? "",
      name: review.authorName ?? review.title[locale] ?? "",
      avatar: AVATARS[index % AVATARS.length],
      rating: review.rating ?? 5,
    }));
  } catch {
    return null;
  }
}
