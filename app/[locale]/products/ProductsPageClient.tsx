"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

const BottleScene = dynamic(
  () => import("@/components/3d/BottleModel").then((m) => m.BottleScene),
  { ssr: false, loading: () => null }
);

interface Props {
  dict: Dictionary;
  locale: Locale;
}

export function ProductsPageClient({ dict, locale }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {dict.naturalSupport.products.map((item, i: number) => (
        <div
          key={i}
          className="rounded-3xl overflow-hidden bg-linear-to-br from-teal-50 via-white to-teal-50 border border-teal-100/60 flex flex-col"
        >
          <div className="relative h-56 sm:h-60 bg-linear-to-b from-white/5 to-transparent">
            <BottleScene src={item.model} className="absolute inset-0" />
          </div>
          <div className="p-5 flex flex-col gap-3">
            <div>
              <p className="text-lg font-semibold text-teal-900 leading-tight">
                {item.name}
              </p>
              <p className="mt-0.5 text-sm text-teal-700/80">{item.tagline}</p>
            </div>
            <Button
              asChild
              className="rounded-full bg-teal-700 text-white hover:bg-teal-800 h-10 text-sm font-semibold"
            >
              <Link href={`/${locale}/contact`}>
                {dict.naturalSupport.cta}
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
