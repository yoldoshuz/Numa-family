// app/[locale]/products/[slug]/page.tsx

import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { products, type ProductSlug } from "@/data/products";
import { Container } from "@/components/ui/Container";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);
  const productDict = dict.products.items[slug as ProductSlug];
  if (!productDict) return {};
  return { title: productDict.name, description: productDict.shortDesc };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);

  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const productDict = dict.products.items[product.slug];

  const badgeLabel = product.badge === "hit"
    ? dict.products.hit
    : product.badge === "worldHit"
      ? dict.products.worldHit
      : product.badge === "exclusive"
        ? dict.products.exclusive
        : null;

  return (
    <div className="pt-14 sm:pt-16">
      <section className="section-padding bg-[#f7f6f3]">
        <Container size="lg">
          {/* Breadcrumb */}
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-1.5 text-sm text-[#6b6b65] hover:text-[#1a1a18] transition-colors duration-200 mb-10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {dict.products.title}
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Product image */}
            <div className="relative">
              <div
                className="aspect-square rounded-[2rem] flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${product.color}18, ${product.color}08)` }}
              >
                <span className="text-[9rem] leading-none select-none">{product.icon}</span>
              </div>
            </div>

            {/* Product info */}
            <div className="lg:pt-4">
              {badgeLabel && (
                <span
                  className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full mb-4"
                  style={{
                    backgroundColor: product.badge === "hit" ? "#dcfce7" : product.badge === "worldHit" ? "#fef9c3" : "#ede9fe",
                    color: product.badge === "hit" ? "#166534" : product.badge === "worldHit" ? "#854d0e" : "#5b21b6",
                  }}
                >
                  {badgeLabel}
                </span>
              )}

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a18] tracking-tighter mb-2 leading-snug"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {productDict.name}
              </h1>
              <p className="text-base text-[#6b6b65] mb-8">
                {productDict.shortDesc}
              </p>

              {/* Benefits */}
              <div className="space-y-3 mb-10">
                {productDict.benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-[#e8e6e1]"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${product.color}20` }}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7l3 3 5-6" stroke={product.color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-sm text-[#1a1a18] leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex gap-3 flex-wrap">
                <button className="btn-pill bg-[#1a1a18] text-white text-sm font-medium py-3.5 px-8 hover:bg-[#2d2d2a] transition-colors duration-200">
                  {dict.products.buy}
                </button>
                <Link href={`/${locale}/contact`}>
                  <button className="btn-pill border border-[#1a1a18] text-[#1a1a18] text-sm font-medium py-3.5 px-8 hover:bg-[#1a1a18] hover:text-white transition-all duration-200">
                    {dict.products.contact}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
