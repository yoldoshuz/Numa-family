"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { type Locale } from "@/lib/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import { Menu, Leaf, Baby, Stethoscope, UtensilsCrossed, Salad } from "lucide-react";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

const productFamilies = [
  { name: "Numa Nutrition", icon: Leaf, href: "/products" },
  { name: "Numa Kids", icon: Baby, href: "/products" },
  { name: "Naboviy Tabobat", icon: Stethoscope, href: "/products" },
  { name: "Bettery Restaurant", icon: UtensilsCrossed, href: "/products" },
  { name: "Bettery Ration", icon: Salad, href: "/products" },
];

export function Header({ locale, dict }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.nav.about, href: `/${locale}/about` },
    { label: dict.nav.blog, href: `/${locale}/blog` },
    { label: dict.nav.contact, href: `/${locale}/contact` },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
          : "bg-white/90 backdrop-blur-md"
      )}
    >
      <div className="container-wide flex items-center justify-between h-14 sm:h-16">
        <HoverCard openDelay={100} closeDelay={200}>
          <HoverCardTrigger asChild>
            <Link
              href={`/${locale}`}
              className="flex items-center gap-1.5 shrink-0"
            >
              <Image
                src="/logo.svg"
                alt="Numa Family"
                width={32}
                height={32}
                className="h-7 w-auto sm:h-8"
              />
            </Link>
          </HoverCardTrigger>
          <HoverCardContent
            align="start"
            sideOffset={10}
            className="w-72 p-2 rounded-2xl border border-teal-700/30 bg-linear-to-br from-teal-600 via-teal-700 to-teal-800 shadow-2xl shadow-teal-900/30 text-white"
          >
            <div className="px-3 pt-2 pb-1.5">
              <p className="text-[11px] font-semibold text-teal-100/80 uppercase tracking-widest">
                Numa Family
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              {productFamilies.map((family) => (
                <Link
                  key={family.name}
                  href={`/${locale}${family.href}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/15 transition-colors group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                    <family.icon className="w-4 h-4 text-teal-50" />
                  </div>
                  <span className="text-sm font-medium text-white">
                    {family.name}
                  </span>
                </Link>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
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
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <Button
              asChild
              className="rounded-full bg-teal-700 text-white hover:bg-teal-800 px-5 h-10 text-sm font-semibold shadow-lg shadow-teal-700/25"
            >
              <Link href={`/${locale}/contact`}>{dict.nav.consultation}</Link>
            </Button>
          </div>

          {/* Mobile consultation */}
          <Button
            asChild
            className="lg:hidden rounded-full bg-teal-700 text-white hover:bg-teal-800 px-4 h-9 text-xs font-semibold"
          >
            <Link href={`/${locale}/contact`}>{dict.nav.consultation}</Link>
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Menu"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetHeader className="p-5 pb-0">
                <SheetTitle className="text-left">
                  <Link
                    href={`/${locale}`}
                    className="flex items-center gap-1.5 shrink-0"
                  >
                    <Image
                      src="/logo.svg"
                      alt="Numa Family"
                      width={32}
                      height={32}
                      className="h-7 w-auto sm:h-8"
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <Separator className="my-3" />
              <nav className="flex flex-col px-3 gap-0.5">
                {navItems.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-xl transition-colors"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <Separator className="my-3" />
              <div className="px-5 pb-2">
                <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                  Numa Family
                </p>
              </div>
              <div className="flex flex-col px-3 gap-0.5">
                {productFamilies.map((family) => (
                  <SheetClose key={family.name} asChild>
                    <Link
                      href={`/${locale}${family.href}`}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-teal-50 transition-colors"
                    >
                      <family.icon className="w-4 h-4 text-teal-700" />
                      <span className="text-sm font-medium text-text-primary">
                        {family.name}
                      </span>
                    </Link>
                  </SheetClose>
                ))}
              </div>
              <div className="mt-auto p-5 border-t space-y-3">
                <LanguageSwitcher currentLocale={locale} />
                <SheetClose asChild>
                  <Button
                    asChild
                    className="w-full rounded-full bg-teal-700 text-white hover:bg-teal-800 h-11 text-sm font-semibold"
                  >
                    <Link href={`/${locale}/contact`}>
                      {dict.nav.consultation}
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
