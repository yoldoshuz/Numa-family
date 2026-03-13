"use client";

import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface DiseasesProps {
  dict: Dictionary;
}

const diseaseIcons = [
  "🫁", "🛡️", "💧", "🧠", "❤️", "⚖️",
  "🌿", "🩸", "🧬", "🫃", "🦴", "🔄",
];

export function Diseases({ dict }: DiseasesProps) {
  return (
    <section className="section-padding bg-[#f7f6f3]">
      <Container size="xl">
        <AnimatedSection className="mb-12 sm:mb-16">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-[#1a1a18]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {dict.diseases.title}
          </h2>
          <p className="mt-3 text-base text-[#6b6b65] max-w-lg">
            {dict.diseases.subtitle}
          </p>
        </AnimatedSection>

        <div className="flex flex-wrap gap-3">
          {dict.diseases.items.map((disease, index) => (
            <AnimatedSection key={index} delay={index * 0.03} animation="scaleUp">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex items-center gap-2.5 bg-white border border-[#e8e6e1] rounded-full px-4 py-2.5 text-sm font-medium text-[#1a1a18] hover:bg-[#1a5c55] hover:text-white hover:border-[#1a5c55] transition-colors duration-200 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
              >
                <span className="text-base leading-none">{diseaseIcons[index] || "💊"}</span>
                {disease}
              </motion.button>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
