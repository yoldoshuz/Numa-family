"use client";

import {
  Hero,
  NaturalSupport,
  BiomarkersSection,
  OmegaBento,
  EmailSignup,
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
      <Hero dict={dict} locale={locale} />
      <NaturalSupport dict={dict} locale={locale} />
      <BiomarkersSection dict={dict} />
      <OmegaBento dict={dict} locale={locale} />
      <EmailSignup dict={dict} />
    </>
  );
}
