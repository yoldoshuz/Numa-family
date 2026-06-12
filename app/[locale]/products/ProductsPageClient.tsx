"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/sections/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  dict: Dictionary;
  locale: Locale;
}

export function ProductsPageClient({ dict, locale }: Props) {
  const { data, isLoading, isError } = useProducts();
  const products = data ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-80 rounded-3xl bg-teal-50/50 border border-teal-100/60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50/60 p-8 text-center text-rose-700">
        {dict.blog.error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-teal-100 bg-teal-50/60 p-10 text-center text-teal-800">
        {dict.blog.empty}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
          variant="light"
        />
      ))}
    </div>
  );
}
