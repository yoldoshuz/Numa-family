"use client";

import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export function Footer({ locale, dict }: FooterProps) {
  return (
    <footer className="bg-surface-secondary text-text-primary">
      {/* Tagline section */}
      <div className="container-wide py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
          {/* Left - Tagline */}
          <div className="lg:w-1/3 shrink-0">
            <div className="flex items-center gap-2 mb-6">
              <Image src="/logo.svg" alt="Numa Family" width={28} height={28} className="h-6 w-auto" />
            </div>
            <h3
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight whitespace-pre-line"
            >
              {dict.footer.tagline}
            </h3>
            <p className="mt-4 text-sm text-text-secondary max-w-sm leading-relaxed">
              {dict.footer.description}
            </p>
          </div>

          {/* Right - Link columns */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-6">
            {/* Learn more column */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-text-tertiary mb-4">
                {dict.footer.learnMore}
              </h4>
              <ul className="space-y-2.5">
                {Object.values(dict.footer.links).map((label, i) => (
                  <li key={i}>
                    <Link href={`/${locale}`} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatments column */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-text-tertiary mb-4">
                {dict.footer.treatments.title}
              </h4>
              <ul className="space-y-2.5">
                {Object.entries(dict.footer.treatments)
                  .filter(([k]) => k !== "title")
                  .map(([key, label]) => (
                    <li key={key}>
                      <Link href={`/${locale}`} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Resources column */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-text-tertiary mb-4">
                {dict.footer.resources.title}
              </h4>
              <ul className="space-y-2.5">
                {Object.entries(dict.footer.resources)
                  .filter(([k]) => k !== "title")
                  .map(([key, label]) => (
                    <li key={key}>
                      <Link href={`/${locale}`} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Support column */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-text-tertiary mb-4">
                {dict.footer.support.title}
              </h4>
              <ul className="space-y-2.5">
                {Object.entries(dict.footer.support)
                  .filter(([k]) => k !== "title")
                  .map(([key, label]) => (
                    <li key={key}>
                      <Link href={`/${locale}`} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Social icons */}
      <div className="container-wide">
        <div className="flex items-center justify-center gap-4 py-6">
          {["facebook", "twitter", "instagram", "youtube"].map((social) => (
            <a
              key={social}
              href="#"
              className="w-9 h-9 rounded-full bg-text-primary/10 flex items-center justify-center hover:bg-text-primary/20 transition-colors"
              aria-label={social}
            >
              <span className="text-xs font-bold text-text-secondary uppercase">
                {social[0]}
              </span>
            </a>
          ))}
        </div>
      </div>

      <Separator />

      {/* Legal */}
      <div className="container-wide py-6">
        <p className="text-[11px] text-text-tertiary text-center leading-relaxed max-w-3xl mx-auto">
          {dict.footer.legal}
        </p>
        <p className="mt-3 text-[11px] text-text-tertiary text-center">
          {dict.footer.copyright}
        </p>
      </div>

      {/* Big logo */}
      <div className="container-wide pb-12 sm:pb-16 lg:pb-20">
        <div className="flex flex-col items-center justify-center py-10 sm:py-14">
          <h2
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-text-primary"
          >
            NUMA<sup className="text-lg sm:text-xl align-super">®</sup>
          </h2>
          <span className="text-sm sm:text-base font-semibold tracking-[0.4em] uppercase text-text-secondary mt-1">
            FAMILY
          </span>
        </div>
      </div>
    </footer>
  );
}
