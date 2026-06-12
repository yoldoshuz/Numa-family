import type { MultilingualText } from "@/lib/api/types";

/** Pick the best available translation, falling back across locales. */
export function pickLang(
  field: MultilingualText | Record<string, string> | null | undefined,
  locale: string
): string {
  if (!field) return "";
  const map = field as Record<string, string>;
  return map[locale] ?? map.en ?? map.ru ?? map.uz ?? "";
}

const CURRENCY: Record<string, string> = {
  ru: "сум",
  uz: "so'm",
  en: "UZS",
};

/** Format a price (number or DECIMAL string from the API) with a localized currency. */
export function formatPrice(
  value: number | string | null | undefined,
  locale: string
): string {
  const n = typeof value === "string" ? Number(value) : value ?? 0;
  const amount = Number.isFinite(n) ? (n as number) : 0;
  return `${amount.toLocaleString("ru-RU")} ${CURRENCY[locale] ?? CURRENCY.en}`;
}
