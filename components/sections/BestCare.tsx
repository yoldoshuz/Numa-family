"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface BestCareProps {
  dict: Dictionary;
}

export function BestCare({ dict }: BestCareProps) {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-text-primary leading-[1.1] tracking-tight">
            {dict.bestCare.title}
            <br />
            <span className="text-teal">{dict.bestCare.subtitle}</span>
          </h2>
          <p className="mt-5 sm:mt-7 text-text-secondary text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {dict.bestCare.description}
          </p>
        </motion.div>

        {/* Doctors grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {[16, 17, 18, 20].map((num) => (
            <div
              key={num}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-teal-50 group"
            >
              <Image
                src={`/images/image ${num}.png`}
                alt="Medical specialist"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
