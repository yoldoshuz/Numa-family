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
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2rem] overflow-hidden bg-linear-to-br from-teal-900 via-teal-800 to-teal-700 min-h-[400px] md:min-h-[480px] lg:min-h-[520px]"
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-white/5 blur-[80px]" />
            <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-teal-light/10 blur-[60px]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center h-full">
            {/* Image side */}
            <div className="relative w-full md:w-1/2 h-64 sm:h-72 md:h-[520px] flex items-center justify-center">
              <Image
                src="/images/image 5.png"
                alt="Natural wellness"
                fill
                className="object-contain p-8 md:p-12 drop-shadow-2xl"
              />
            </div>

            {/* Content side */}
            <div className="w-full md:w-1/2 p-8 sm:p-10 md:p-14 lg:p-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight">
                {dict.promoBanner.title}{" "}
                <span className="text-teal-300">{dict.promoBanner.highlight}</span>
              </h2>
              <p className="mt-5 md:mt-6 text-white/70 text-base sm:text-lg max-w-md leading-relaxed">
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
