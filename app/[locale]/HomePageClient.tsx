"use client";

import { Hero } from "@/components/sections/Hero";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { HealthJourney } from "@/components/sections/HealthJourney";
import { TestingCards } from "@/components/sections/TestingCards";
import { BestCare } from "@/components/sections/BestCare";
import { EmailSignup } from "@/components/sections/EmailSignup";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  dict: Dictionary;
  locale: Locale;
}

export function HomePageClient({ dict, locale }: Props) {
  return (
    <>
      <Hero dict={dict} locale={locale} />
      <PromoBanner dict={dict} />
      <ProductShowcase dict={dict} locale={locale} />
      <HealthJourney dict={dict} />
      <TestingCards dict={dict} />
      <BestCare dict={dict} />
      <EmailSignup dict={dict} />
    </>
  );
}
