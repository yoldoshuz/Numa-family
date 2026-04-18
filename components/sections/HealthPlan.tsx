"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface HealthPlanProps {
  dict: Dictionary;
}

export function HealthPlan({ dict }: HealthPlanProps) {
  return (
    <section className="py-10 md:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-linear-to-br from-teal-400 via-teal-500 to-teal-700 px-5 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-20"
        >
          {/* Decorative blurs */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-teal-200/20 blur-3xl" />

          <div className="relative text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.08] tracking-tight">
              {dict.healthPlan.title}{" "}
              <span className="italic font-light text-teal-50">
                {dict.healthPlan.highlight}
              </span>
            </h2>
            <p className="mt-4 text-white/85 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              {dict.healthPlan.description}
            </p>
          </div>

          <div className="relative mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Biomarkers */}
            <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 flex flex-col gap-6 hover:bg-white/15 transition-colors duration-500">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-[1.15] tracking-tight whitespace-pre-line">
                {dict.healthPlan.biomarkers.title}
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                {dict.healthPlan.biomarkers.description}
              </p>
              <div>
                <Button className="rounded-full bg-white text-teal-900 hover:bg-white/95 px-6 h-11 text-sm font-semibold">
                  {dict.healthPlan.biomarkers.cta}
                </Button>
              </div>
            </div>

            {/* Cancer screening */}
            <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 flex flex-col gap-6 hover:bg-white/15 transition-colors duration-500">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-[1.15] tracking-tight whitespace-pre-line">
                {dict.healthPlan.cancer.title}
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                {dict.healthPlan.cancer.description}
              </p>
              <div>
                <Button
                  variant="outline"
                  className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/15 hover:text-white hover:border-white/60 px-6 h-11 text-sm font-semibold"
                >
                  {dict.healthPlan.cancer.cta}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
