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
import type { Locale } from "@/lib/i18n/config";

interface Props {
  dict: Dictionary;
  locale: Locale;
}

export function HomePageClient({ dict, locale }: Props) {
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
      <Reviews dict={dict} />
      <Faq dict={dict} />
    </>
  );
}
