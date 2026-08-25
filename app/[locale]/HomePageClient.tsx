import {
  Hero,
  About,
  Mission,
  Ecosystem,
  Achievements,
  Certificates,
  ArticlesPreview,
  Videos,
  Reviews,
  Faq,
} from "@/components/sections";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { ReviewCard } from "@/lib/api/reviews";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  dict: Dictionary;
  locale: Locale;
  reviews: ReviewCard[] | null;
}

export function HomePageClient({ dict, locale, reviews }: Props) {
  return (
    <>
      <Hero dict={dict} />
      <About dict={dict} />
      <Mission dict={dict} />
      <Ecosystem dict={dict} />
      <Achievements dict={dict} />
      <Certificates dict={dict} />
      <ArticlesPreview dict={dict} locale={locale} />
      <Videos dict={dict} />
      <Reviews dict={dict} cards={reviews} />
      <Faq dict={dict} />
    </>
  );
}
