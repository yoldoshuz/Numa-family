"use client";

import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: locale === "ru" ? "Телефон" : locale === "uz" ? "Telefon" : "Phone",
      value: dict.contact.phone,
      href: `tel:${dict.contact.phone.replace(/\s/g, "")}`,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: "Email",
      value: dict.contact.email,
      href: `mailto:${dict.contact.email}`,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: locale === "ru" ? "Адрес" : locale === "uz" ? "Manzil" : "Address",
      value: dict.contact.address,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: locale === "ru" ? "Время работы" : locale === "uz" ? "Ish vaqti" : "Working Hours",
      value: dict.contact.workingHours,
    },
  ];

  return (
    <div className="pt-14 sm:pt-16">
      <section className="section-padding bg-surface-secondary">
        <Container size="lg">
          <AnimatedSection className="mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-teal mb-4">
              <span className="w-5 h-px bg-teal" />
              {dict.nav.contact}
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-text-primary leading-[1.08]"
            >
              {dict.contact.title}
            </h1>
            <p className="mt-3 text-base text-text-secondary max-w-lg">
              {dict.contact.subtitle}
            </p>
          </AnimatedSection>

          {/* Contact info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {contactInfo.map((info, index) => (
              <AnimatedSection key={index} delay={index * 0.08} animation="fadeUp">
                <div className="bg-white border border-border rounded-2xl p-6 h-full transition-shadow duration-300 hover:shadow-lg">
                  <div className="w-10 h-10 mb-4 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                    {info.icon}
                  </div>
                  <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                    {info.label}
                  </h3>
                  {info.href ? (
                    <a href={info.href} className="text-sm font-medium text-text-primary hover:text-teal transition-colors break-all">
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-text-primary leading-relaxed">{info.value}</p>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Contact form */}
          <AnimatedSection animation="fadeUp">
            <div className="max-w-xl mx-auto bg-white border border-border rounded-3xl p-7 sm:p-10">
              <h3
                className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tighter mb-6"
              >
                {dict.contact.sendMessage}
              </h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input type="text" placeholder={dict.contact.name} className="rounded-xl h-12" />
                  <Input type="email" placeholder="Email" className="rounded-xl h-12" />
                </div>
                <textarea
                  rows={4}
                  placeholder={dict.contact.message}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-teal/25 focus:border-teal transition-all resize-none text-sm"
                />
                <Button type="submit" className="w-full rounded-full h-12 bg-teal text-white hover:bg-teal-dark">
                  {dict.contact.sendMessage}
                </Button>
              </form>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </div>
  );
}
