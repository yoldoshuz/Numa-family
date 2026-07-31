"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { type Locale } from "@/lib/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useConsultation } from "@/components/consultation/ConsultationProvider";
import { CloseIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export function Header({ locale, dict }: HeaderProps) {
  const pathname = usePathname();
  const { open } = useConsultation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const navItems = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.nav.blog, href: `/${locale}/blog` },
    { label: dict.nav.contact, href: `/${locale}/contact` },
  ];

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300",
        scrolled && "shadow-[0_1px_0_0_rgba(16,18,17,0.07)]"
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-4 lg:h-[86px]">
        <Link href={`/${locale}`} className="shrink-0" aria-label="NUMA Family">
          <Image
            src="/logo.png"
            alt="NUMA Family"
            width={1489}
            height={423}
            priority
            className="h-9 w-auto lg:h-12"
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-10 lg:flex xl:gap-16">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[0.95rem] transition-colors hover:text-brand",
                isActive(item.href) ? "font-semibold text-brand" : "text-ink"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageSwitcher currentLocale={locale} className="hidden sm:block" />
          <button
            type="button"
            onClick={() => open("header")}
            className="hidden h-10 items-center rounded-lg bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-deep sm:inline-flex"
          >
            {dict.nav.consultation}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={dict.nav.menu}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-mist lg:hidden"
          >
            {menuOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-hairline bg-white lg:hidden">
          <nav className="shell flex flex-col py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b border-hairline py-3.5 text-[0.95rem] last:border-0",
                  isActive(item.href) ? "font-semibold text-brand" : "text-ink"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 py-4 sm:hidden">
              <LanguageSwitcher currentLocale={locale} />
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  open("mobile-menu");
                }}
                className="h-10 flex-1 rounded-lg bg-brand px-5 text-sm font-medium text-white"
              >
                {dict.nav.consultation}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
