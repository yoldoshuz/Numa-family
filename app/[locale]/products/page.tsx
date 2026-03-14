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
      <section className="pt-14 pb-0 sm:pt-20 bg-surface-secondary">
        <Container size="xl">
          <div className="pb-12 sm:pb-16">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-teal mb-4">
              <span className="w-5 h-px bg-teal" />
              {dict.productShowcase.sectionTitle}
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-text-primary leading-[1.08]"
            >
              {dict.productShowcase.title}
            </h1>
          </div>
        </Container>
      </section>
      <ProductShowcase dict={dict} locale={locale as Locale} />
    </div>
  );
}
