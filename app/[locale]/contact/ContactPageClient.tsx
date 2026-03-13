"use client";

import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
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
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: dict.consultation.phone,
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
      <section className="section-padding bg-[#f7f6f3]">
        <Container size="lg">
          <AnimatedSection className="mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1a5c55] mb-4">
              <span className="w-5 h-px bg-[#1a5c55]" />
              {dict.nav.contact}
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-[#1a1a18] leading-[1.08]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {dict.contact.title}
            </h1>
            <p className="mt-3 text-base text-[#6b6b65] max-w-lg">
              {dict.contact.subtitle}
            </p>
          </AnimatedSection>

          {/* Contact info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {contactInfo.map((info, index) => (
              <AnimatedSection key={index} delay={index * 0.08} animation="fadeUp">
                <div className="bg-white border border-[#e8e6e1] rounded-[1.5rem] p-6 h-full transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)]">
                  <div className="w-10 h-10 mb-4 rounded-xl bg-[#1a5c55]/10 flex items-center justify-center text-[#1a5c55]">
                    {info.icon}
                  </div>
                  <h3 className="text-xs font-semibold text-[#9b9b93] uppercase tracking-wider mb-1.5">
                    {info.label}
                  </h3>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="text-sm font-medium text-[#1a1a18] hover:text-[#1a5c55] transition-colors duration-200 break-all"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-[#1a1a18] leading-relaxed">
                      {info.value}
                    </p>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Contact form */}
          <AnimatedSection animation="fadeUp">
            <div className="max-w-xl mx-auto bg-white border border-[#e8e6e1] rounded-[2rem] p-7 sm:p-10">
              <h3
                className="text-2xl sm:text-3xl font-bold text-[#1a1a18] tracking-tighter mb-6"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {dict.contact.sendMessage}
              </h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder={dict.contact.name}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8e6e1] bg-[#f7f6f3] text-[#1a1a18] placeholder:text-[#9b9b93] focus:outline-none focus:ring-2 focus:ring-[#1a5c55]/25 focus:border-[#1a5c55] transition-all duration-200 text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-xl border border-[#e8e6e1] bg-[#f7f6f3] text-[#1a1a18] placeholder:text-[#9b9b93] focus:outline-none focus:ring-2 focus:ring-[#1a5c55]/25 focus:border-[#1a5c55] transition-all duration-200 text-sm"
                  />
                </div>
                <textarea
                  rows={4}
                  placeholder={dict.contact.message}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e6e1] bg-[#f7f6f3] text-[#1a1a18] placeholder:text-[#9b9b93] focus:outline-none focus:ring-2 focus:ring-[#1a5c55]/25 focus:border-[#1a5c55] transition-all duration-200 resize-none text-sm"
                />
                <button
                  type="submit"
                  className="w-full btn-pill bg-[#1a1a18] text-white text-sm font-medium py-3.5 hover:bg-[#2d2d2a] transition-colors duration-200"
                >
                  {dict.contact.sendMessage}
                </button>
              </form>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <ConsultationForm dict={dict} />
    </div>
  );
}
