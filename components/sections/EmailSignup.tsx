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
    <section className="py-16 sm:py-20 md:py-24 bg-teal-50 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-text-primary leading-[1.15] tracking-tight">
            {dict.emailSignup.title}
          </h2>
          <p className="mt-4 text-text-secondary text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
            {dict.emailSignup.description}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={dict.emailSignup.placeholder}
              className="rounded-full h-12 px-6 bg-white border-border text-base flex-1"
            />
            <Button className="rounded-full bg-teal text-white hover:bg-teal-dark h-12 px-8 text-sm font-medium shrink-0">
              {dict.emailSignup.cta}
            </Button>
          </div>

          <p className="mt-5 text-xs text-text-tertiary leading-relaxed">
            {dict.emailSignup.disclaimer}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
