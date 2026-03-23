"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface PromoBannerProps {
  dict: Dictionary;
}

export function PromoBanner({ dict }: PromoBannerProps) {
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white overflow-hidden">
      <div className="mx-auto max-w-350 px-2 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative flex items-center rounded-3xl overflow-hidden bg-teal-800 min-h-125 md:min-h-150"
        >
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
            <div className="relative w-[60%] sm:w-[50%] md:w-[45%] h-full opacity-50 md:opacity-100">
              <Image
                src="/images/endomarine.png"
                alt="Natural wellness"
                fill
                className="object-contain object-bottom-right"
                priority
              />
            </div>
          </div>

          {/* Overlay Gradient for better text readability */}
          <div className="absolute inset-0 bg-linear-to-r from-teal-950 via-teal-900/60 to-transparent z-1" />
          {/* Content side */}
          <div className="relative w-full md:w-2/3 p-8 sm:p-10 md:p-14 lg:p-16 z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight">
              {dict.promoBanner.title}{" "}
              <span className="text-teal-300">{dict.promoBanner.highlight}</span>
            </h2>
            <p className="mt-5 md:mt-6 text-white/80 text-base sm:text-lg max-w-md leading-relaxed">
              {dict.promoBanner.description}
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button className="rounded-full bg-white text-teal-900 hover:bg-white/90 px-8 h-12 text-sm font-medium shadow-lg">
                {dict.productShowcase.cta}
              </Button>
              <Button variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10 px-8 h-12 text-sm font-medium">
                {dict.productShowcase.cta2}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
