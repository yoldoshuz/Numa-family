"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";
import { productImage } from "@/lib/api/products";
import { storeSiteUrl } from "@/lib/config/sites";
import { pickLang, formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  product: Product;
  locale: Locale;
  /** "light" = on white surfaces (products page); "dark" = on the teal panel (home). */
  variant?: "light" | "dark";
  className?: string;
}

const badgeColors: Record<string, string> = {
  new: "bg-emerald-400/90 text-emerald-950",
  best: "bg-amber-300/95 text-amber-950",
  popular: "bg-sky-300/95 text-sky-950",
};

export function ProductCard({
  product,
  locale,
  variant = "light",
  className,
}: Props) {
  const img = productImage(product);
  const name = pickLang(product.name, locale);
  const tagline =
    product.brand ?? pickLang(product.category?.name, locale) ?? "";
  const dark = variant === "dark";

  // Redirect to the marketplace site that sells this product; fall back to the
  // internal detail page when that store's site isn't configured yet.
  const externalUrl = storeSiteUrl(product.store);
  const href = externalUrl ?? `/${locale}/products/${product.slug}`;
  const wrapperClassName = cn(
    "group flex flex-col overflow-hidden rounded-3xl border transition-all duration-300",
    dark
      ? "bg-white/10 backdrop-blur-md border-white/15 hover:bg-white/15"
      : "bg-linear-to-br from-teal-50 via-white to-teal-50 border-teal-100/60 hover:border-teal-200 hover:shadow-xl hover:-translate-y-1",
    className
  );

  const body = (
    <>
      <div
        className={cn(
          "relative h-52 sm:h-56 flex items-center justify-center overflow-hidden",
          dark ? "bg-white/5" : "bg-linear-to-b from-white/60 to-transparent"
        )}
      >
        {product.isFeatured && (
          <span
            className={cn(
              "absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider",
              badgeColors.best
            )}
          >
            {locale === "ru" ? "Хит" : locale === "uz" ? "Hit" : "Top"}
          </span>
        )}
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-2xl",
              dark ? "bg-white/10 text-white/60" : "bg-teal-100/70 text-teal-700"
            )}
          >
            <Leaf className="h-7 w-7" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4 sm:p-5">
        <p
          className={cn(
            "text-base sm:text-lg font-semibold leading-tight",
            dark ? "text-white" : "text-teal-900"
          )}
        >
          {name}
        </p>
        {tagline && (
          <p
            className={cn(
              "text-xs sm:text-sm leading-snug",
              dark ? "text-white/70" : "text-teal-700/80"
            )}
          >
            {tagline}
          </p>
        )}
        <div className="mt-2 flex items-baseline gap-2">
          {product.discountPrice ? (
            <>
              <span
                className={cn(
                  "text-base sm:text-lg font-semibold",
                  dark ? "text-teal-50" : "text-teal-900"
                )}
              >
                {formatPrice(product.discountPrice, locale)}
              </span>
              <span
                className={cn(
                  "text-xs line-through",
                  dark ? "text-white/50" : "text-text-tertiary"
                )}
              >
                {formatPrice(product.price, locale)}
              </span>
            </>
          ) : (
            <span
              className={cn(
                "text-base sm:text-lg font-semibold",
                dark ? "text-teal-50" : "text-teal-900"
              )}
            >
              {formatPrice(product.price, locale)}
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (externalUrl) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={wrapperClassName}
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className={wrapperClassName}>
      {body}
    </Link>
  );
}
