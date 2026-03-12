"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import { products } from "@/data/products";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export function Footer({ locale, dict }: FooterProps) {
  const navLinks = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.nav.about, href: `/${locale}/about` },
    { label: dict.nav.products, href: `/${locale}/products` },
    { label: dict.nav.blog, href: `/${locale}/blog` },
    { label: dict.nav.contact, href: `/${locale}/contact` },
  ];

  const productLinks = products.map((p) => ({
    label: dict.products.items[p.slug].name,
    href: `/${locale}/products/${p.slug}`,
  }));

  return (
    <footer className="bg-text-primary text-white">
      <Container size="lg" className="py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 group mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-sm">
                N
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Numa<span className="text-primary-light">.</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              {dict.footer.description}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              {dict.footer.navigation}
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-primary-light transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              {dict.footer.ourProducts}
            </h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-primary-light transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              {dict.footer.contacts}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${dict.contact.phone.replace(/\s/g, "")}`}
                  className="text-sm text-white/60 hover:text-primary-light transition-colors duration-200"
                >
                  {dict.contact.phone}
                </a>
              </li>
              <li>
                <span className="text-sm text-white/60">
                  {dict.contact.address}
                </span>
              </li>
              <li>
                <a
                  href={`mailto:${dict.contact.email}`}
                  className="text-sm text-white/60 hover:text-primary-light transition-colors duration-200"
                >
                  {dict.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Numa Nutrition. {dict.footer.rights}
          </p>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="text-sm text-white/40 hover:text-primary-light transition-colors duration-200 cursor-pointer"
          >
            {dict.footer.backToTop} &uarr;
          </button>
        </div>
      </Container>
    </footer>
  );
}
