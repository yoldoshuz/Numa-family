"use client";

import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  dict: Dictionary;
  locale: Locale;
}

export function AboutPageClient({ dict }: Props) {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <Container size="md" className="relative z-10 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary mb-6">
              {dict.about.title}
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              {dict.about.description}
            </p>
          </AnimatedSection>
        </Container>
      </section>

      {/* Mission */}
      <section className="pb-24 md:pb-32">
        <Container size="lg">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="slideLeft">
              <div className="relative aspect-square rounded-3xl overflow-hidden">
                <div className="absolute inset-0 gradient-primary opacity-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="text-9xl"
                  >
                    🌿
                  </motion.div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideRight">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                {dict.about.mission}
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-8">
                {dict.about.missionText}
              </p>

              <h3 className="text-xl font-bold text-text-primary mb-4">
                {dict.about.values}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {dict.about.valuesItems.map((value, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-surface-secondary">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm font-medium text-text-primary">{value}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="section-padding bg-surface-secondary">
        <Container size="md">
          <AnimatedSection className="text-center">
            <GlassCard padding="lg">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                {dict.about.story}
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed">
                {dict.about.storyText}
              </p>
            </GlassCard>
          </AnimatedSection>
        </Container>
      </section>

      {/* Stats */}
      <section className="section-padding">
        <Container size="lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "6+", label: "Products" },
              { value: "50K+", label: "Clients" },
              { value: "100%", label: "Natural" },
              { value: "14", label: "Regions" },
            ].map((stat, i) => (
              <AnimatedSection key={i} delay={i * 0.1} animation="scaleUp">
                <GlassCard className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-text-secondary">{stat.label}</div>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
