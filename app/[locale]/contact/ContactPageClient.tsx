"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ConsultationForm } from "@/components/sections/ConsultationForm";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  dict: Dictionary;
  locale: Locale;
}

export function ContactPageClient({ dict, locale }: Props) {
  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: dict.consultation.phone,
      value: dict.contact.phone,
      href: `tel:${dict.contact.phone.replace(/\s/g, "")}`,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: "Email",
      value: dict.contact.email,
      href: `mailto:${dict.contact.email}`,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: locale === "ru" ? "Адрес" : locale === "uz" ? "Manzil" : "Address",
      value: dict.contact.address,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: locale === "ru" ? "Время работы" : locale === "uz" ? "Ish vaqti" : "Working Hours",
      value: dict.contact.workingHours,
    },
  ];

  return (
    <div className="pt-24">
      <section className="section-padding">
        <Container size="lg">
          <SectionHeading title={dict.contact.title} subtitle={dict.contact.subtitle} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <AnimatedSection key={index} delay={index * 0.1} animation="fadeUp">
                <GlassCard className="text-center h-full">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl gradient-primary flex items-center justify-center text-white">
                    {info.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                    {info.label}
                  </h3>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="text-text-primary font-medium hover:text-primary transition-colors duration-200"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-text-primary font-medium text-sm">{info.value}</p>
                  )}
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>

          {/* Contact form */}
          <AnimatedSection animation="fadeUp">
            <GlassCard padding="lg" className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">
                {dict.contact.sendMessage}
              </h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={dict.contact.name}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 backdrop-blur-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 backdrop-blur-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
                  />
                </div>
                <textarea
                  rows={4}
                  placeholder={dict.contact.message}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 backdrop-blur-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 resize-none"
                />
                <Button type="submit" size="lg" className="w-full">
                  {dict.contact.sendMessage}
                </Button>
              </form>
            </GlassCard>
          </AnimatedSection>
        </Container>
      </section>

      <ConsultationForm dict={dict} />
    </div>
  );
}
