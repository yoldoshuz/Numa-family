"use client";

import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  dict: Dictionary;
  locale: Locale;
}

export function AboutPageClient({ dict }: Props) {
  const stats = [
    { value: "6+", label: "Products" },
    { value: "50K+", label: "Clients" },
    { value: "100%", label: "Natural" },
    { value: "14", label: "Regions" },
  ];

  return (
    <div className="pt-14 sm:pt-16">
      {/* Hero */}
      <section className="section-padding bg-[#f7f6f3]">
        <Container size="lg">
          <AnimatedSection>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1a5c55] mb-4">
                <span className="w-5 h-px bg-[#1a5c55]" />
                {dict.nav.about}
              </span>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-[#1a1a18] leading-[1.08] mb-5"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {dict.about.title}
              </h1>
              <p className="text-base sm:text-lg text-[#6b6b65] leading-relaxed max-w-2xl">
                {dict.about.description}
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-14 bg-white border-b border-[#e8e6e1]">
        <Container size="lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
            {stats.map((stat, i) => (
              <AnimatedSection key={i} delay={i * 0.08} animation="scaleUp">
                <div className="text-center">
                  <div
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a5c55] tracking-tighter mb-1"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#9b9b93]">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="section-padding bg-white">
        <Container size="lg">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <AnimatedSection animation="slideLeft">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-[#1a5c55]/8 flex items-center justify-center">
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="text-[8rem] leading-none select-none"
                >
                  🌿
                </motion.div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideRight">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1a5c55] mb-4">
                <span className="w-5 h-px bg-[#1a5c55]" />
                {dict.about.mission}
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#1a1a18] tracking-tighter mb-4 leading-snug"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {dict.about.mission}
              </h2>
              <p className="text-base text-[#6b6b65] leading-relaxed mb-8">
                {dict.about.missionText}
              </p>

              <h3 className="text-lg font-semibold text-[#1a1a18] mb-4">
                {dict.about.values}
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {dict.about.valuesItems.map((value, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#f7f6f3] border border-[#e8e6e1]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#1a5c55] flex-shrink-0" />
                    <span className="text-sm font-medium text-[#1a1a18]">{value}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="section-padding bg-[#1a5c55] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <Container size="md" className="relative z-10">
          <AnimatedSection className="text-center">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tighter mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {dict.about.story}
            </h2>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
              {dict.about.storyText}
            </p>
          </AnimatedSection>
        </Container>
      </section>
    </div>
  );
}
