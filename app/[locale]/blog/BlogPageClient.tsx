"use client";

import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  dict: Dictionary;
  locale: Locale;
}

export function BlogPageClient({ dict }: Props) {
  return (
    <div className="pt-24">
      <section className="section-padding">
        <Container size="lg">
          <SectionHeading title={dict.blog.title} subtitle={dict.blog.subtitle} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {dict.blog.posts.map((post, index) => (
              <AnimatedSection key={index} delay={index * 0.1} animation="fadeUp">
                <GlassCard className="group cursor-pointer h-full flex flex-col">
                  {/* Image placeholder */}
                  <div className="relative h-48 rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-primary/5 to-primary/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="text-5xl opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500"
                        whileHover={{ rotate: 10 }}
                      >
                        📖
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="primary">{post.category}</Badge>
                    <span className="text-xs text-text-tertiary">{post.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors duration-300 flex-1">
                    {post.title}
                  </h3>

                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {dict.blog.readMore}
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
    </div>
  );
}
