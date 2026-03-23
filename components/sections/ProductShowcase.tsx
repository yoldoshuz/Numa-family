"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface ProductShowcaseProps {
  dict: Dictionary;
  locale: Locale;
}

export function ProductShowcase({ dict, locale }: ProductShowcaseProps) {
  return (
    <section className="py-8 md:py-12 lg:py-16overflow-hidden">
      <div className="mx-auto max-w-350 px-5 sm:px-8 lg:px-12">
        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {dict.productShowcase.items.map((item: { name: string; image: string }, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link href={`/${locale}/products`} className="block group">
                <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-4/5 overflow-hidden bg-linear-to-br from-teal-50/80 to-white">
                    <Image
                      src={item.image}
                      alt={item.name.replace("\n", " ")}
                      fill
                      className="object-contain p-6 sm:p-8 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="text-sm sm:text-base font-semibold text-text-primary whitespace-pre-line leading-snug">
                      {item.name}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal underline underline-offset-4 hover:text-teal-dark transition-colors"
          >
            {dict.productShowcase.viewAll} →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
