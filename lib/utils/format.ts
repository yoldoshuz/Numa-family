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

const DATE_LOCALES: Record<string, string> = {
  ru: "ru-RU",
  uz: "uz-UZ",
  en: "en-US",
};

/** "26 июня 2024" — the article meta format used on the blog. */
export function formatDate(value: string | null | undefined, locale: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(DATE_LOCALES[locale] ?? DATE_LOCALES.en, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
