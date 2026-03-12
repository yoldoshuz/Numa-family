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
    <div className="pt-24">
      <section className="py-16 md:py-24">
        <Container size="xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary text-center mb-4">
            {dict.products.title}
          </h1>
          <p className="text-lg text-text-secondary text-center max-w-2xl mx-auto">
            {dict.products.subtitle}
          </p>
        </Container>
      </section>
      <ProductShowcase dict={dict} locale={locale as Locale} />
    </div>
  );
}
