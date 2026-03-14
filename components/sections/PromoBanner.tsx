"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface PromoBannerProps {
  dict: Dictionary;
}

export function PromoBanner({ dict }: PromoBannerProps) {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2rem] overflow-hidden min-h-[420px] md:min-h-[520px] lg:min-h-[600px] flex items-center"
        >
          {/* Background image */}
          <Image
            src="/images/image 5.png"
            alt="Natural wellness"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 md:p-16 lg:p-20 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.1] tracking-tight">
              {dict.promoBanner.title}{" "}
              <span className="text-teal-300">{dict.promoBanner.highlight}</span>
            </h2>
            <p className="mt-5 md:mt-6 text-white/70 text-base sm:text-lg max-w-md leading-relaxed">
              {dict.promoBanner.description}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
