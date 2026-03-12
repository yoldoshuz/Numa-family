"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, type Locale, localeNames } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-sm font-medium text-text-primary hover:bg-white/70 transition-all duration-300 cursor-pointer"
      >
        {/* <span className="text-xs">{currentLocale === "ru" ? "🇷🇺" : currentLocale === "en" ? "🇺🇸" : "🇺🇿"}</span> */}
        <span className="uppercase">{currentLocale}</span>
        <svg
          className={cn("w-3 h-3 transition-transform duration-200", open && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 glass-card p-2 min-w-35">
            {locales.map((locale) => (
              <Link
                key={locale}
                href={redirectedPathname(locale)}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-primary/10",
                  locale === currentLocale ? "text-primary font-semibold" : "text-text-secondary"
                )}
              >
                <span className="text-xs">
                  {locale === "ru" ? "🇷🇺" : locale === "en" ? "🇺🇸" : "🇺🇿"}
                </span>
                {localeNames[locale]}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
