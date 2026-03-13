"use client";

import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface AdvantagesProps {
  dict: Dictionary;
}

const icons = [
  <svg key="expert" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  <svg key="quality" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  <svg key="natural" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  <svg key="delivery" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>,
];

export function Advantages({ dict }: AdvantagesProps) {
  const items = [
    { ...dict.advantages.expert, icon: icons[0] },
    { ...dict.advantages.quality, icon: icons[1] },
    { ...dict.advantages.natural, icon: icons[2] },
    { ...dict.advantages.delivery, icon: icons[3] },
  ];

  return (
    <section className="section-padding bg-[#f7f6f3]">
      <Container size="xl">
        <AnimatedSection className="text-center mb-12 sm:mb-16">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-[#1a1a18]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {dict.advantages.title}
          </h2>
          {dict.advantages.subtitle && (
            <p className="mt-3 text-base sm:text-lg text-[#6b6b65] max-w-xl mx-auto">
              {dict.advantages.subtitle}
            </p>
          )}
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {items.map((item, index) => (
            <AnimatedSection key={index} delay={index * 0.08} animation="fadeUp">
              <div className="bg-white rounded-[1.5rem] p-6 sm:p-7 h-full border border-[#e8e6e1] transition-shadow duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
                <div className="w-11 h-11 mb-5 rounded-xl bg-[#1a5c55]/10 flex items-center justify-center text-[#1a5c55]">
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold text-[#1a1a18] mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-[#6b6b65] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}