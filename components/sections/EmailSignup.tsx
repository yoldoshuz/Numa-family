"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface EmailSignupProps {
  dict: Dictionary;
}

export function EmailSignup({ dict }: EmailSignupProps) {
  return (
    <section className="py-12 md:py-20 lg:py-28 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2rem] overflow-hidden bg-teal-800/80"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center">
            {/* Left - Content */}
            <div className="w-full md:w-1/2 p-8 sm:p-10 md:p-14 lg:p-16">
              <h2 className="w-full max-w-md text-2xl sm:text-3xl md:text-4xl font-light text-white leading-[1.15] tracking-tight">
                {dict.emailSignup.title}
              </h2>
              <p className="mt-4 text-white/70 text-sm sm:text-base leading-relaxed max-w-md">
                {dict.emailSignup.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 max-w-md">
                <Input
                  type="email"
                  placeholder={dict.emailSignup.placeholder}
                  className="rounded-full h-12 px-4 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-base focus:bg-white/15 focus:border-white/40"
                />
                <Button className="rounded-full bg-teal-950 text-teal-50 hover:bg-teal-900/90 h-12 px-8 text-sm font-medium shrink-0 shadow-lg">
                  {dict.emailSignup.cta}
                </Button>
              </div>

              <p className="mt-4 text-xs text-white/50 leading-relaxed max-w-sm">
                {dict.emailSignup.disclaimer}
              </p>
            </div>

            {/* Right - Image */}
            <div className="relative w-full md:w-1/2 h-64 sm:h-72 md:h-[400px] flex items-center justify-center">
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
