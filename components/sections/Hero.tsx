"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { ChevronRight } from "lucide-react";

interface HeroProps {
  dict: Dictionary;
  locale: Locale;
}

export function Hero({ dict, locale }: HeroProps) {
  return (
    <section className="relative flex flex-col overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-black/10 blur-[100px]" />
      </div>

      <div className="container-wide relative z-10 flex flex-col pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20">
        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl"
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05]"
          >
            <span className="text-teal-700">{dict.hero.title}</span>
            <br />
            {dict.hero.subtitle}
          </h1>
        </motion.div>

        {/* Category Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 sm:mt-12 flex items-center justify-start flex-1 flex-wrap text-white gap-1 overflow-x-auto hide-scrollbar pb-1"
        >
          {dict.categories.items.map((item: { title: string; subtitle: string; badge: string; image: string }, i: number) => (
            <Link
              key={i}
              href={`/${locale}/products`}
              className="w-full flex flex-col md:flex-row h-48 justify-between flex-1 rounded-2xl overflow-hidden bg-linear-to-tr from-teal-600 to-teal-700 border border-white/20 transition-all duration-300 group"
            >
              <div className="flex flex-col justify-between p-3 sm:p-4">
                <div>
                  <p className="text-xs font-medium">{item.title}</p>
                  <p className="text-sm sm:text-base font-bold mt-0.5">{item.subtitle}</p>
                </div>
                <div>
                  <span className="inline-block mt-2 text-xs sm:text-base font-bold bg-white/15 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                </div>
              </div>
              <div className="flex items-start md:items-end justify-end h-full px-8 overflow-hidden">
                <Image
                  src={`${i === 1 ? "/images/image 10.png" : "/images/endomarine.png"}`}
                  alt="endomarine"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Sub-category pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-1 flex flex-1 flex-wrap gap-1 overflow-x-auto text-teal-800 font-bold  hide-scrollbar pb-2"
        >
          {dict.subCategories.items.map((item: { name: string; description: string; icon: string }, i: number) => (
            <Link
              key={i}
              href={`/${locale}/products`}
              className="shrink-0 h-24 flex flex-1 items-center justify-between gap-2 bg-teal-100/70 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2 sm:px-5 sm:py-2.5 hover:bg-teal-100 transition-colors group"
            >
              <div className="flex flex-col">
                <span className="text-base whitespace-nowrap">{item.name}</span>
                <span className="text-sm whitespace-nowrap font-medium">{item.description}</span>
              </div>
              <ChevronRight />
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
