"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { Advantages } from "@/components/sections/Advantages";
import { Testimonials } from "@/components/sections/Testimonials";
import { Certificates } from "@/components/sections/Certificates";
import { Diseases } from "@/components/sections/Diseases";
import { ConsultationForm } from "@/components/sections/ConsultationForm";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

const Scene3D = dynamic(
  () => import("@/components/sections/Scene3D").then((m) => m.Scene3D),
  { ssr: false }
);

interface Props {
  dict: Dictionary;
  locale: Locale;
}

export function HomePageClient({ dict, locale }: Props) {
  return (
    <>
      <div className="relative">
        <Scene3D />
        <Hero dict={dict} locale={locale} />
      </div>
      <ProductShowcase dict={dict} locale={locale} />
      <Advantages dict={dict} />
      <Diseases dict={dict} />
      <Testimonials dict={dict} />
      <Certificates dict={dict} />
      <ConsultationForm dict={dict} />
    </>
  );
}
