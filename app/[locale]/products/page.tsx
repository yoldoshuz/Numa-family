import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/Container";
import { ProductsPageClient } from "./ProductsPageClient";

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
          <div className="pb-10 sm:pb-14">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 uppercase tracking-widest mb-4">
              <span className="w-5 h-px bg-teal-700" />
              {dict.naturalSupport.eyebrow}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-text-primary leading-[1.05]">
              {dict.naturalSupport.title}{" "}
              <span className="text-teal-700 italic font-light">
                {dict.naturalSupport.highlight}
              </span>
            </h1>
          </div>
        </Container>
      </section>

      <section className="py-10 md:py-14 bg-white">
        <Container size="xl">
          <ProductsPageClient dict={dict} locale={locale as Locale} />
        </Container>
      </section>
    </div>
  );
}
