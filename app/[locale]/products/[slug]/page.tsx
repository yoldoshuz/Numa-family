import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import type { Metadata } from "next";
import { ProductDetailClient } from "./ProductDetailClient";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { title: `${title} | Numa Family` };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <ProductDetailClient dict={dict} locale={locale as Locale} slug={slug} />
  );
}
