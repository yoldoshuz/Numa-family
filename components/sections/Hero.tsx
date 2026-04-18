"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface HeroProps {
  dict: Dictionary;
  locale: Locale;
}

export function Hero({ dict, locale }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container-wide relative z-10 pt-24 pb-8 sm:pt-28 sm:pb-10 lg:pt-32 lg:pb-12">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.05] tracking-tight max-w-4xl"
        >
          <span className="text-teal-700">{dict.hero.title}</span>
          <br />
          <span className="text-text-primary">{dict.hero.subtitle}</span>
        </motion.h1>

        {/* Top row - 2 cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-8 sm:mt-10 grid grid-cols-2 gap-2 sm:gap-4"
        >
          {dict.hero.top.map((item, i: number) => (
            <Link
              key={i}
              href={`/${locale}/products`}
              className="relative flex items-stretch justify-between rounded-3xl overflow-hidden bg-linear-to-br from-teal-600 via-teal-700 to-teal-800 border border-white/10 text-white h-44 sm:h-48 md:h-56 group transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col justify-between p-4 sm:p-5 z-10 max-w-[55%]">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/80">
                    {item.name}
                  </p>
                  <p className="text-sm sm:text-lg md:text-xl font-semibold mt-1 leading-tight">
                    {item.tagline}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
              </div>
              <div className="relative w-[45%] md:w-[42%] h-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width:640px) 45vw, 200px"
                  className="object-contain object-right-bottom p-2 drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover:scale-110"
                  priority={i === 0}
                />
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Bottom row - 3 cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-2 sm:mt-4 grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4"
        >
          {dict.hero.bottom.map((item, i: number) => (
            <Link
              key={i}
              href={`/${locale}/products`}
              className={`relative flex items-stretch justify-between rounded-3xl overflow-hidden bg-linear-to-br from-teal-600 via-teal-700 to-teal-800 border border-white/10 text-white h-36 sm:h-40 md:h-44 group transition-transform duration-300 hover:-translate-y-1 ${
                i === 2 ? "col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="flex flex-col justify-between p-4 sm:p-5 z-10 max-w-[55%]">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white/80">
                    {item.name}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-semibold mt-1 leading-tight">
                    {item.tagline}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/70" />
              </div>
              <div className="relative w-[42%] md:w-[40%] h-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width:640px) 40vw, 160px"
                  className="object-contain object-right-bottom p-2 drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
