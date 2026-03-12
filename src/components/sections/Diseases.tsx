"use client";

import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-primary/3 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Container size="xl" className="relative z-10">
        <SectionHeading title={dict.diseases.title} subtitle={dict.diseases.subtitle} />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {dict.diseases.items.map((disease, index) => (
            <AnimatedSection key={index} delay={index * 0.05} animation="scaleUp">
              <motion.div
                whileHover={{ y: -6, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass-card p-4 text-center cursor-pointer group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {diseaseIcons[index] || "💊"}
                </div>
                <p className="text-xs font-medium text-text-secondary group-hover:text-primary transition-colors duration-300 leading-tight">
                  {disease}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
