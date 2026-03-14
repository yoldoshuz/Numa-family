"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface TestingCardsProps {
  dict: Dictionary;
}

export function TestingCards({ dict }: TestingCardsProps) {
  return (
    <section className="py-12 md:py-20 lg:py-28 bg-surface-secondary overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Biomarkers card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="group"
          >
            <div className="rounded-[1.75rem] overflow-hidden bg-white h-full shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="p-5 sm:p-7">
                <div className="relative h-48 sm:h-60 mb-5 rounded-2xl overflow-hidden bg-teal-50">
                  <Image
                    src="/images/image 14.png"
                    alt="Biomarker testing"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary leading-tight tracking-tight">
                  {dict.testing.biomarkers.title}
                </h3>
                <p className="mt-3 text-text-secondary text-sm leading-relaxed">
                  {dict.testing.biomarkers.description}
                </p>
                <Button variant="outline" className="mt-5 rounded-full px-7 h-11 text-sm font-medium border-border-dark hover:bg-teal hover:text-white hover:border-teal transition-all duration-300">
                  {dict.testing.biomarkersCta}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Cancer screening card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="group"
          >
            <div className="rounded-[1.75rem] overflow-hidden bg-white h-full shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="p-5 sm:p-7">
                <div className="relative h-48 sm:h-60 mb-5 rounded-2xl overflow-hidden bg-teal-50">
                  <Image
                    src="/images/image 15.png"
                    alt="Cancer screening"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary leading-tight tracking-tight">
                  {dict.testing.cancer.title}
                </h3>
                <p className="mt-3 text-text-secondary text-sm leading-relaxed">
                  {dict.testing.cancer.description}
                </p>
                <Button variant="outline" className="mt-5 rounded-full px-7 h-11 text-sm font-medium border-border-dark hover:bg-teal hover:text-white hover:border-teal transition-all duration-300">
                  {dict.testing.cancerCta}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-xs text-text-tertiary max-w-2xl mx-auto leading-relaxed"
        >
          {dict.testing.disclaimer}
        </motion.p>
      </div>
    </section>
  );
}
