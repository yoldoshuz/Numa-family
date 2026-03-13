// app/[locale]/products/page.tsx
// Replace the existing file with this version

import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/Container";
import { ProductShowcase } from "@/components/sections/ProductShowcase";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="pt-14 sm:pt-16">
      <section className="pt-14 pb-0 sm:pt-20 bg-[#f7f6f3]">
        <Container size="xl">
          <div className="pb-12 sm:pb-16">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1a5c55] mb-4">
              <span className="w-5 h-px bg-[#1a5c55]" />
              {dict.nav.products}
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-[#1a1a18] leading-[1.08]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {dict.products.title}
            </h1>
            <p className="mt-3 text-base text-[#6b6b65] max-w-lg">
              {dict.products.subtitle}
            </p>
          </div>
        </Container>
      </section>
      <ProductShowcase dict={dict} locale={locale as Locale} />
    </div>
  );
}
