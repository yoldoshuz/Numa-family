"use client";

import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
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
    <section className="section-padding bg-white">
      <Container size="xl">
        <AnimatedSection className="mb-12 sm:mb-16">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-[#1a1a18] text-center"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {dict.certificates.title}
          </h2>
          {dict.certificates.subtitle && (
            <p className="mt-3 text-base text-[#6b6b65] text-center max-w-lg mx-auto">
              {dict.certificates.subtitle}
            </p>
          )}
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {certs.map((cert, index) => (
            <AnimatedSection key={index} delay={index * 0.1} animation="scaleUp">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-[#f7f6f3] border border-[#e8e6e1] rounded-[1.5rem] p-7 text-center cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow duration-300"
              >
                <div
                  className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#1a5c55]/10 flex items-center justify-center"
                >
                  <svg className="w-7 h-7 text-[#1a5c55]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#1a1a18] mb-1 tracking-tight">{cert.label}</h3>
                <p className="text-xs text-[#6b6b65]">{cert.desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}