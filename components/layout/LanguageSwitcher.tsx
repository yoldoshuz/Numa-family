"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { locales, type Locale } from "@/lib/i18n/config";

const SHORT: Record<Locale, string> = { ru: "Ru", en: "En", uz: "Uz" };

function Flag({ locale, className }: { locale: Locale; className?: string }) {
  if (locale === "ru") {
    return (
      <svg viewBox="0 0 24 16" className={className} aria-hidden="true">
        <rect width="24" height="16" rx="2.5" fill="#fff" />
        <path d="M0 5.33h24v5.34H0z" fill="#0039A6" />
        <path d="M0 10.67h24v2.83a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 0 13.5v-2.83Z" fill="#D52B1E" />
      </svg>
    );
  }
  if (locale === "uz") {
    return (
      <svg viewBox="0 0 24 16" className={className} aria-hidden="true">
        <rect width="24" height="16" rx="2.5" fill="#fff" />
        <path d="M2.5 0h19A2.5 2.5 0 0 1 24 2.5V5H0V2.5A2.5 2.5 0 0 1 2.5 0Z" fill="#0099B5" />
        <path d="M0 11h24v2.5a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 0 13.5V11Z" fill="#1EB53A" />
        <path d="M0 5h24v.7H0zM0 10.3h24v.7H0z" fill="#CE1126" />
        <circle cx="5" cy="2.6" r="1.4" fill="#fff" />
        <circle cx="5.7" cy="2.4" r="1.3" fill="#0099B5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true">
      <rect width="24" height="16" rx="2.5" fill="#012169" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#fff" strokeWidth="3" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.6" />
      <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5" />
      <path d="M12 0v16M0 8h24" stroke="#C8102E" strokeWidth="3" />
    </svg>
  );
}

interface Props {
  currentLocale: Locale;
  variant?: "light" | "plain";
  className?: string;
}

export function LanguageSwitcher({ currentLocale, variant = "light", className }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const go = (locale: Locale) => {
    setOpen(false);
    if (locale === currentLocale) return;
    const segments = (pathname || "/").split("/");
    segments[1] = locale;
    router.push(segments.join("/") || "/");
  };

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors",
          variant === "light"
            ? "border border-hairline bg-white text-ink hover:border-brand/40"
            : "text-white hover:bg-white/10"
        )}
      >
        <Flag locale={currentLocale} className="h-4 w-6 rounded-[3px]" />
        {SHORT[currentLocale]}
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 opacity-70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-xl border border-hairline bg-white py-1 shadow-(--shadow-card-hover)"
        >
          {locales.map((locale) => (
            <li key={locale}>
              <button
                type="button"
                role="option"
                aria-selected={locale === currentLocale}
                onClick={() => go(locale)}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-ink transition-colors hover:bg-mist",
                  locale === currentLocale && "font-semibold text-brand"
                )}
              >
                <Flag locale={locale} className="h-4 w-6 rounded-[3px]" />
                {SHORT[locale]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
