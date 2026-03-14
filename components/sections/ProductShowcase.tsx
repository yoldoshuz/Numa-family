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
    <section className="py-8 md:py-12 lg:py-16 bg-surface-secondary overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* Hero product card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2rem] overflow-hidden bg-teal-900 mb-5"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-teal-800/50 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center">
            {/* Product image */}
            <div className="relative w-full md:w-1/2 h-64 sm:h-80 md:h-[420px]">
              <Image
                src="/images/image 6.png"
                alt="Numa Organic Syrup"
                fill
                className="object-contain p-8 md:p-12"
              />
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2 p-8 sm:p-10 md:p-14">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.svg" alt="Numa" width={28} height={28} className="h-6 w-auto opacity-70 invert" />
              </div>
              <p className="text-white/50 text-xs font-medium tracking-[0.2em] uppercase mb-2">
                {dict.productShowcase.title}
              </p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
                {dict.productShowcase.sectionTitle}
              </h3>
              <div className="flex flex-wrap gap-3 mt-8">
                <Button className="rounded-full bg-white text-teal-900 hover:bg-white/90 px-7 h-11 text-sm font-medium">
                  {dict.productShowcase.cta}
                </Button>
                <Button variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10 px-7 h-11 text-sm font-medium">
                  {dict.productShowcase.cta2}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

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
