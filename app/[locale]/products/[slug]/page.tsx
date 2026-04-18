import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/Container";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

const PRODUCTS = [
  { slug: "detox", name: "Detox Hepar Energy", desc: "Natural liver detox and restoration", color: "#4CAF50", image: "/images/image 10.png" },
  { slug: "igneus", name: "Igneus", desc: "Immunity and vitality booster", color: "#FF5722", image: "/images/image 11.png" },
  { slug: "endomarine", name: "Endo Marine", desc: "Thyroid and metabolism support", color: "#2196F3", image: "/images/endomarine.png" },
  { slug: "lotus", name: "Lotus Black Seed", desc: "Traditional wellness remedy", color: "#1a7a6d", image: "/images/image 9.png" },
];

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return {};
  return { title: `${product.name} | Numa Family`, description: product.desc };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);

  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <div className="pt-14 sm:pt-16">
      <section className="section-padding bg-surface-secondary">
        <Container size="lg">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {dict.naturalSupport.viewAll}
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-teal-50 to-white">
              <Image src={product.image} alt={product.name} fill className="object-contain p-8" />
            </div>

            <div>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tighter leading-snug"
              >
                {product.name}
              </h1>
              <p className="mt-3 text-text-secondary text-base">{product.desc}</p>

              <div className="flex gap-3 mt-8">
                <Link href={`/${locale}/contact`}>
                  <button className="btn-pill bg-teal text-white text-sm font-medium py-3.5 px-8 hover:bg-teal-dark transition-colors">
                    {dict.naturalSupport.cta}
                  </button>
                </Link>
                <button className="btn-pill border border-teal text-teal text-sm font-medium py-3.5 px-8 hover:bg-teal hover:text-white transition-all">
                  {dict.naturalSupport.ctaSecondary}
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
