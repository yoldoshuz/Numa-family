/**
 * Uzbek first, and first in this list: the site speaks to Uzbekistan, and the
 * order here is the order the language switcher offers.
 */
export const locales = ["uz", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uz";

export const localeNames: Record<Locale, string> = {
  uz: "O'zbek",
  ru: "Русский",
  en: "English",
};
