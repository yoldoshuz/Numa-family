"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface TestimonialsProps {
  dict: Dictionary;
}

const TESTIMONIALS = [
  {
    id: "professors",
    icon: "🎓",
    bg: "#1a5c55",
    textColor: "white",
  },
  {
    id: "clients",
    icon: "💬",
    bg: "#f7f6f3",
    textColor: "#1a1a18",
    border: "#e8e6e1",
  },
  {
    id: "celebrities",
    icon: "⭐",
    bg: "#1a1a18",
    textColor: "white",
  },
];

export function Testimonials({ dict }: TestimonialsProps) {
  const categories = [
    { ...TESTIMONIALS[0], title: dict.testimonials.professors },
    { ...TESTIMONIALS[1], title: dict.testimonials.clients },
    { ...TESTIMONIALS[2], title: dict.testimonials.celebrities },
  ];

  const [active, setActive] = useState(0);

  return (
    <section className="section-padding bg-white overflow-hidden">
      <Container size="xl">
        <AnimatedSection className="mb-12 sm:mb-16">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-[#1a1a18]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {dict.testimonials.title}
          </h2>
          <p className="mt-3 text-base text-[#6b6b65] max-w-lg">
            {dict.testimonials.subtitle}
          </p>
        </AnimatedSection>

        {/* Desktop: 3 columns */}
        <div className="hidden md:grid grid-cols-3 gap-4 lg:gap-5">
          {categories.map((cat, i) => (
            <AnimatedSection key={cat.id} delay={i * 0.1} animation="fadeUp">
              <div
                className="rounded-[1.5rem] p-7 lg:p-8 h-full flex flex-col gap-5 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
                style={{
                  backgroundColor: cat.bg,
                  border: cat.border ? `1px solid ${cat.border}` : "none",
                }}
              >
                <div className="text-4xl">{cat.icon}</div>
                <h3
                  className="text-lg font-semibold leading-snug"
                  style={{ color: cat.textColor }}
                >
                  {cat.title}
                </h3>

                {/* Stars */}
                <div className="flex gap-1 mt-auto">
                  {[...Array(5)].map((_, s) => (
                    <svg
                      key={s}
                      className="w-4 h-4"
                      fill={cat.textColor === "white" ? "rgba(255,255,255,0.8)" : "#f59e0b"}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Mobile: tabs */}
        <div className="md:hidden">
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => setActive(i)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${active === i
                    ? "bg-[#1a1a18] text-white"
                    : "bg-[#f7f6f3] text-[#6b6b65] hover:bg-[#eae8e3]"
                  }`}
              >
                {cat.icon} {cat.title}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="rounded-[1.5rem] p-6 flex flex-col gap-4"
              style={{
                backgroundColor: categories[active].bg,
                border: categories[active].border ? `1px solid ${categories[active].border}` : "none",
              }}
            >
              <div className="text-4xl">{categories[active].icon}</div>
              <h3
                className="text-lg font-semibold"
                style={{ color: categories[active].textColor }}
              >
                {categories[active].title}
              </h3>
              <div className="flex gap-1">
                {[...Array(5)].map((_, s) => (
                  <svg
                    key={s}
                    className="w-4 h-4"
                    fill={categories[active].textColor === "white" ? "rgba(255,255,255,0.8)" : "#f59e0b"}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}