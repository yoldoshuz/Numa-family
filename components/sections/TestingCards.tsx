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
    <section className="py-16 md:py-24 lg:py-32 bg-surface-secondary overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {/* Biomarkers card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-[1.5rem] overflow-hidden bg-white h-full shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="p-6 sm:p-8">
                <div className="relative h-44 sm:h-56 mb-6 rounded-2xl overflow-hidden bg-teal-50">
                  <Image
                    src="/images/image 14.png"
                    alt="Biomarker testing"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary leading-tight tracking-tight">
                  {dict.testing.biomarkers.title}
                </h3>
                <p className="mt-3 text-text-secondary text-sm leading-relaxed">
                  {dict.testing.biomarkers.description}
                </p>
                <Button variant="outline" className="mt-6 rounded-full px-7 h-11 text-sm font-medium border-border-dark">
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
          >
            <div className="rounded-[1.5rem] overflow-hidden bg-white h-full shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="p-6 sm:p-8">
                <div className="relative h-44 sm:h-56 mb-6 rounded-2xl overflow-hidden bg-teal-50">
                  <Image
                    src="/images/image 15.png"
                    alt="Cancer screening"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary leading-tight tracking-tight">
                  {dict.testing.cancer.title}
                </h3>
                <p className="mt-3 text-text-secondary text-sm leading-relaxed">
                  {dict.testing.cancer.description}
                </p>
                <Button variant="outline" className="mt-6 rounded-full px-7 h-11 text-sm font-medium border-border-dark">
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
          className="mt-8 text-center text-xs text-text-tertiary max-w-2xl mx-auto leading-relaxed"
        >
          {dict.testing.disclaimer}
        </motion.p>
      </div>
    </section>
  );
}
