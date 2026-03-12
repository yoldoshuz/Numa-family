import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { products, type ProductSlug } from "@/data/products";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
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

  return {
    title: productDict.name,
    description: productDict.shortDesc,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);

  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const productDict = dict.products.items[product.slug];

  return (
    <div className="pt-24">
      <section className="section-padding">
        <Container size="md">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors duration-200 mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {dict.products.title}
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative">
              <div className={`aspect-square rounded-3xl bg-gradient-to-br ${product.gradient} opacity-10 absolute inset-0`} />
              <div className="relative aspect-square rounded-3xl glass-card flex items-center justify-center">
                <span className="text-9xl">{product.icon}</span>
              </div>
            </div>

            <div>
              {product.badge && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
                  {product.badge === "hit" ? dict.products.hit : product.badge === "worldHit" ? dict.products.worldHit : dict.products.exclusive}
                </span>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-2">
                {productDict.name}
              </h1>
              <p className="text-lg text-text-secondary mb-8">
                {productDict.shortDesc}
              </p>

              <div className="space-y-4 mb-10">
                {productDict.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-surface-secondary">
                    <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-text-primary">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button size="lg">{dict.products.buy}</Button>
                <Button variant="outline" size="lg">{dict.products.contact}</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
