"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface ConsultationFormProps {
  dict: Dictionary;
}

export function ConsultationForm({ dict }: ConsultationFormProps) {
  const [phone, setPhone] = useState("+998 ");
  const [region, setRegion] = useState("");
  const [agreed, setAgreed] = useState(false);

  return (
    <section id="consultation" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-[0.03]" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Container size="md" className="relative z-10">
        <AnimatedSection animation="fadeUp">
          <div className="glass-card p-8 md:p-12 lg:p-16">
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center"
              >
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </motion.div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-4">
                {dict.consultation.title}
              </h2>
              <p className="text-text-secondary max-w-lg mx-auto leading-relaxed">
                {dict.consultation.subtitle}
              </p>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-6 max-w-md mx-auto"
            >
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {dict.consultation.phone}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 backdrop-blur-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
                  placeholder="+998 XX XXX-XX-XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {dict.consultation.region}
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 backdrop-blur-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 cursor-pointer"
                >
                  <option value="">{dict.consultation.region}</option>
                  {dict.consultation.regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
                />
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors duration-200">
                  {dict.consultation.agree}
                </span>
              </label>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!agreed}
              >
                {dict.consultation.submit}
              </Button>
            </form>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
