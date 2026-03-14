"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface HealthJourneyProps {
  dict: Dictionary;
}

export function HealthJourney({ dict }: HealthJourneyProps) {
  return (
    <section className="py-12 md:py-20 lg:py-28 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* Journey cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Find your baseline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="group"
          >
            <div className="rounded-[1.75rem] overflow-hidden bg-teal-50 h-full flex flex-col hover:shadow-xl transition-shadow duration-500">
              <div className="relative h-52 sm:h-64 md:h-72 overflow-hidden">
                <Image
                  src="/images/image 12.png"
                  alt="Find your baseline"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-teal-50 via-transparent to-transparent" />
              </div>
              <div className="p-7 sm:p-9 flex-1 flex flex-col">
                <h3 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold text-text-primary leading-[1.15] tracking-tight">
                  {dict.healthJourney.findBaseline.title}{" "}
                  <span className="text-teal">{dict.healthJourney.findBaseline.highlight}</span>
                </h3>
                <p className="mt-3 text-text-secondary text-sm sm:text-base leading-relaxed">
                  {dict.healthJourney.findBaseline.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Plan your breakthrough */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="group"
          >
            <div className="rounded-[1.75rem] overflow-hidden bg-teal-50 h-full flex flex-col hover:shadow-xl transition-shadow duration-500">
              <div className="relative h-52 sm:h-64 md:h-72 overflow-hidden">
                <Image
                  src="/images/image 13.png"
                  alt="Plan your breakthrough"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-teal-50 via-transparent to-transparent" />
              </div>
              <div className="p-7 sm:p-9 flex-1 flex flex-col">
                <h3 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold text-text-primary leading-[1.15] tracking-tight">
                  {dict.healthJourney.planBreakthrough.title}{" "}
                  <span className="text-teal">{dict.healthJourney.planBreakthrough.highlight}</span>
                </h3>
                <p className="mt-3 text-text-secondary text-sm sm:text-base leading-relaxed">
                  {dict.healthJourney.planBreakthrough.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <Button className="rounded-full bg-teal text-white hover:bg-teal-dark px-10 h-12 text-base font-medium shadow-lg shadow-teal/20">
            {dict.healthJourney.cta}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
