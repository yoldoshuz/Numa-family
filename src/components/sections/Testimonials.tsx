"use client";

import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface TestimonialsProps {
  dict: Dictionary;
}

export function Testimonials({ dict }: TestimonialsProps) {
  const categories = [
    {
      title: dict.testimonials.professors,
      icon: "🎓",
      gradient: "from-blue-400 to-indigo-600",
    },
    {
      title: dict.testimonials.clients,
      icon: "💬",
      gradient: "from-emerald-400 to-teal-600",
    },
    {
      title: dict.testimonials.celebrities,
      icon: "⭐",
      gradient: "from-amber-400 to-orange-600",
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      <Container size="xl" className="relative z-10">
        <SectionHeading title={dict.testimonials.title} subtitle={dict.testimonials.subtitle} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <AnimatedSection key={index} delay={index * 0.15} animation="fadeUp">
              <GlassCard className="text-center group cursor-pointer">
                <motion.div
                  className="text-5xl mb-6"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {category.icon}
                </motion.div>
                <h3 className="text-lg font-bold text-text-primary mb-4 group-hover:text-primary transition-colors duration-300">
                  {category.title}
                </h3>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r ${category.gradient} text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                >
                  <span>{dict.products.details}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
