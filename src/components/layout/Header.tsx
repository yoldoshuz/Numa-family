"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils/cn";
import { type Locale } from "@/lib/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export function Header({ locale, dict }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navItems = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.nav.about, href: `/${locale}/about` },
    { label: dict.nav.products, href: `/${locale}/products` },
    { label: dict.nav.blog, href: `/${locale}/blog` },
    { label: dict.nav.contact, href: `/${locale}/contact` },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.08)]"
            : "bg-white/90 backdrop-blur-md"
        )}
      >
        <div className="container-wide flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 group shrink-0"
          >
            <span
              className="text-xl font-bold tracking-tighter text-text-primary"
              style={{ fontFamily: "Georgia, serif" }}
            >
              numa
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 rounded-lg hover:bg-black/4"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex">
              <LanguageSwitcher currentLocale={locale} />
            </div>
            <Link href="#consultation" className="hidden sm:inline-flex">
              <button className="btn-pill bg-text-primary text-white text-sm hover:bg-[#2d2d2a] transition-colors duration-200 px-5 py-2.5">
                {dict.nav.consultation}
              </button>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-black/6 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <span
                  className="text-xl font-bold tracking-tighter"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  numa
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/6 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-4 py-3 text-base font-medium text-text-primary hover:bg-surface-secondary rounded-xl transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="p-5 border-t border-border space-y-3">
                <Link href="#consultation" onClick={() => setMobileOpen(false)}>
                  <button className="w-full btn-pill bg-text-primary text-white text-sm hover:bg-[#2d2d2a] transition-colors py-3">
                    {dict.nav.consultation}
                  </button>
                </Link>
                <LanguageSwitcher currentLocale={locale} />
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}