"use client";

import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
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
    <section id="products" className="section-padding bg-white relative overflow-hidden">
      <Container size="xl">
        <AnimatedSection className="mb-12 sm:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-[#1a1a18]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {dict.products.title}
              </h2>
              <p className="mt-2 text-base text-[#6b6b65] max-w-md">
                {dict.products.subtitle}
              </p>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
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