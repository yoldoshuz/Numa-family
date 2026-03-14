"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { locales, type Locale, localeNames } from "@/lib/i18n/config";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const handleChange = (locale: Locale) => {
    router.push(redirectedPathname(locale));
  };

  return (
    <Select defaultValue={currentLocale} onValueChange={(v) => handleChange(v as Locale)}>
      <SelectTrigger className="w-auto h-8 text-xs uppercase bg-transparent border-none">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            <div className="flex items-center gap-2">
              <span>
                {locale === "ru" ? "🇷🇺" : locale === "en" ? "🇺🇸" : "🇺🇿"}
              </span>
              {localeNames[locale]}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}