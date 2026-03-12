"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "./ProductCard";
import { products } from "@/data/products";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface ProductShowcaseProps {
  dict: Dictionary;
  locale: Locale;
}

export function ProductShowcase({ dict, locale }: ProductShowcaseProps) {
  return (
    <section id="products" className="section-padding bg-surface-secondary relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-100 h-100 rounded-full bg-primary/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-75 h-75 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Container size="xl" className="relative z-10">
        <SectionHeading title={dict.products.title} subtitle={dict.products.subtitle} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              dict={dict}
              locale={locale}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
