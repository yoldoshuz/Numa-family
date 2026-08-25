import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { getReviews } from "@/lib/api/reviews";
import { HomePageClient } from "./HomePageClient";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const [dict, reviews] = await Promise.all([
    getDictionary(locale as Locale),
    getReviews(locale as "uz" | "ru" | "en"),
  ]);

  return <HomePageClient dict={dict} locale={locale as Locale} reviews={reviews} />;
}
