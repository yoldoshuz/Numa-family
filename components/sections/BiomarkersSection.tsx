"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { MarqueeBackground } from "./MarqueeBackground";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface Props {
  dict: Dictionary;
}

export function BiomarkersSection({ dict }: Props) {
  return (
    <section className="py-4 md:py-6 bg-white overflow-hidden">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden bg-linear-to-br from-teal-800 via-teal-900 to-teal-950 px-5 py-14 sm:px-10 sm:py-20 md:py-24"
        >
          {/* Marquee in the background of this container */}
          <MarqueeBackground
            items={dict.naturalSupport.marquee}
            rows={8}
            textClassName="text-white/20 text-sm sm:text-base md:text-lg font-semibold uppercase tracking-wider"
          />

          {/* Decorative blurs */}
          <div className="pointer-events-none absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-teal-600/15 blur-[140px]" />
          <div className="pointer-events-none absolute -bottom-40 -right-32 w-[560px] h-[560px] rounded-full bg-teal-500/10 blur-[140px]" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.08] tracking-tight">
              {dict.healthPlan.title}{" "}
              <span className="italic font-light text-teal-100">
                {dict.healthPlan.highlight}
              </span>
            </h2>
            <p className="mt-4 text-white/80 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              {dict.healthPlan.description}
            </p>
          </div>

          <div className="relative z-10 mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/15 p-6 sm:p-8 flex flex-col gap-5 hover:bg-white/10 transition-colors duration-500"
            >
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-[1.1] tracking-tight whitespace-pre-line">
                {dict.healthPlan.biomarkers.title}
              </h3>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                {dict.healthPlan.biomarkers.description}
              </p>
              <div>
                <Button className="rounded-full bg-white text-teal-900 hover:bg-white/95 px-6 h-11 text-sm font-semibold">
                  {dict.healthPlan.biomarkers.cta}
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/15 p-6 sm:p-8 flex flex-col gap-5 hover:bg-white/10 transition-colors duration-500"
            >
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-[1.1] tracking-tight whitespace-pre-line">
                {dict.healthPlan.cancer.title}
              </h3>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed">
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
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
