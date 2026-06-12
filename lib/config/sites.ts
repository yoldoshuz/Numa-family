/**
 * External brand / marketplace sites.
 *
 * Numa Family is informational and cannot sell, so its product cards and the
 * products attached to articles redirect to the marketplace site that actually
 * sells them (keyed by the product's `store`). The home-page brand blocks
 * redirect by their display name.
 *
 * The external sites have no per-product routes yet (`/products/...` → 404), so
 * every redirect targets the site root.
 *
 * 👉 Fill in the remaining URLs as those sites go live — that's the only change
 *    needed to light them up.
 */

// Keyed by marketplace `store` slug (from the backend product payload).
export const STORE_SITES: Record<string, string | undefined> = {
  nutrition: "https://numa-nutrition-83c9.vercel.app",
  kids: "https://numa-kids.vercel.app",
  halal: undefined, // Nabaviy Tabobat — URL TBD
  family: "https://numa-family.vercel.app",
};

// Keyed by the home-page brand block name (stable across all locales).
export const BRAND_SITES: Record<string, string | undefined> = {
  "Numa Nutrition": "https://numa-nutrition-83c9.vercel.app",
  "Numa Kids": "https://numa-kids.vercel.app",
  "Nabaviy Tabobat": undefined, // URL TBD
  "Bettery Restaurant": undefined, // URL TBD
  "Bettery Ration": undefined, // URL TBD
};

export const storeSiteUrl = (store?: string | null): string | undefined =>
  store ? STORE_SITES[store] : undefined;

export const brandSiteUrl = (name?: string | null): string | undefined =>
  name ? BRAND_SITES[name] : undefined;
