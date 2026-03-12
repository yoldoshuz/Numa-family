"use client";

import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface CertificatesProps {
  dict: Dictionary;
}

export function Certificates({ dict }: CertificatesProps) {
  const certs = [
    { label: "ISO 9001", desc: "Quality Management" },
    { label: "GMP", desc: "Good Manufacturing Practice" },
    { label: "HALAL", desc: "Halal Certified" },
    { label: "ISO 22000", desc: "Food Safety" },
  ];

  return (
    <section className="section-padding bg-surface-secondary relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <Container size="xl" className="relative z-10">
        <SectionHeading title={dict.certificates.title} subtitle={dict.certificates.subtitle} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {certs.map((cert, index) => (
            <AnimatedSection key={index} delay={index * 0.1} animation="scaleUp">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass-card p-8 text-center cursor-pointer"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-1">{cert.label}</h3>
                <p className="text-sm text-text-secondary">{cert.desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
