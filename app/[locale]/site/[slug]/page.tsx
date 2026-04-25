import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { SitePageClient } from "./SitePageClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.replace(/-/g, " ") };
}

export default async function SitePage({ params }: Props) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);

  return <SitePageClient dict={dict} locale={locale as Locale} slug={slug} />;
}
