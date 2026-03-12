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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "py-3 backdrop-blur-3xl shadow-sm"
            : "py-3"
        )}
      >
        <div className="container-wide flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-sm transition-transform duration-300 group-hover:scale-110">
              N
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-200 rounded-lg hover:bg-primary/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex">
              <LanguageSwitcher currentLocale={locale} />
            </div>
            <Button size="sm" className="hidden md:inline-flex">
              {dict.nav.consultation}
            </Button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
              aria-label="Toggle menu"
            >
              <span
                className={cn(
                  "w-5 h-0.5 bg-text-primary transition-all duration-300",
                  mobileOpen && "rotate-45 translate-y-2"
                )}
              />
              <span
                className={cn(
                  "w-5 h-0.5 bg-text-primary transition-all duration-300",
                  mobileOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "w-5 h-0.5 bg-text-primary transition-all duration-300",
                  mobileOpen && "-rotate-45 -translate-y-2"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-60 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-70 bg-white/95 backdrop-blur-2xl shadow-2xl p-8 pt-24"
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    // onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-base font-medium text-text-secondary hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-8">
                <Button className="w-full" size="md">
                  {dict.nav.consultation}
                </Button>
                <LanguageSwitcher currentLocale={locale} />

              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
