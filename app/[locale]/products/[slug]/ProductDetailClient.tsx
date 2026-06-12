"use client";

import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProducts";
import { productImage } from "@/lib/api/products";
import { pickLang, formatPrice } from "@/lib/utils/format";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  dict: Dictionary;
  locale: Locale;
  slug: string;
}

export function ProductDetailClient({ dict, locale, slug }: Props) {
  const { data: product, isLoading, isError } = useProduct(slug);

  return (
    <div className="pt-14 sm:pt-16">
      <section className="section-padding bg-surface-secondary">
        <Container size="lg">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            {dict.naturalSupport.viewAll ?? dict.naturalSupport.allProducts}
          </Link>

          {isLoading && (
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="aspect-square rounded-3xl bg-teal-50/50 animate-pulse" />
              <div className="space-y-4">
                <div className="h-10 w-2/3 rounded-2xl bg-teal-50/60 animate-pulse" />
                <div className="h-4 w-full rounded bg-teal-50/40 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-teal-50/40 animate-pulse" />
              </div>
            </div>
          )}

          {!isLoading && (isError || !product) && (
            <div className="rounded-3xl border border-teal-100 bg-teal-50/60 p-10 text-center text-teal-800">
              {dict.blog.empty}
            </div>
          )}

          {!isLoading && !isError && product && (
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-teal-50 to-white flex items-center justify-center">
                {productImage(product) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={productImage(product) as string}
                    alt={pickLang(product.name, locale)}
                    className="h-full w-full object-contain p-8"
                  />
                ) : (
                  <Leaf className="w-20 h-20 text-teal-300" />
                )}
              </div>

              <div>
                {product.brand && (
                  <p className="text-xs uppercase tracking-wider text-teal-700 font-semibold mb-2">
                    {product.brand}
                  </p>
                )}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tighter leading-snug">
                  {pickLang(product.name, locale)}
                </h1>

                {product.description && (
                  <p className="mt-3 text-text-secondary text-base leading-relaxed">
                    {pickLang(product.description, locale)}
                  </p>
                )}

                <div className="mt-6 flex items-baseline gap-3">
                  {product.discountPrice ? (
                    <>
                      <span className="text-2xl font-bold text-teal-800">
                        {formatPrice(product.discountPrice, locale)}
                      </span>
                      <span className="text-base text-text-tertiary line-through">
                        {formatPrice(product.price, locale)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-teal-800">
                      {formatPrice(product.price, locale)}
                    </span>
                  )}
                </div>

                {product.attributes &&
                  Object.keys(product.attributes).length > 0 && (
                    <dl className="mt-6 grid grid-cols-2 gap-3 max-w-md">
                      {Object.entries(product.attributes).map(([key, value]) => (
                        <div
                          key={key}
                          className="rounded-2xl border border-border bg-white px-4 py-3"
                        >
                          <dt className="text-xs uppercase tracking-wide text-text-tertiary">
                            {key}
                          </dt>
                          <dd className="text-sm font-medium text-text-primary">
                            {String(value)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}

                <div className="flex gap-3 mt-8">
                  <Button
                    asChild
                    className="btn-pill bg-teal text-white text-sm font-medium py-3.5 px-8 hover:bg-teal-dark"
                  >
                    <Link href={`/${locale}/contact`}>
                      {dict.naturalSupport.ctaSecondary ?? dict.nav.contact}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
