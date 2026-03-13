"use client";

import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  dict: Dictionary;
  locale: Locale;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Health: { bg: "#dcfce7", text: "#166534" },
  Nutrition: { bg: "#fef9c3", text: "#854d0e" },
  Vitamins: { bg: "#dbeafe", text: "#1e40af" },
  Science: { bg: "#ede9fe", text: "#5b21b6" },
  "Сог'лиқ": { bg: "#dcfce7", text: "#166534" },
  "Озиқланиш": { bg: "#fef9c3", text: "#854d0e" },
  "Витаминлар": { bg: "#dbeafe", text: "#1e40af" },
  "Фан": { bg: "#ede9fe", text: "#5b21b6" },
  "Здоровье": { bg: "#dcfce7", text: "#166534" },
  "Питание": { bg: "#fef9c3", text: "#854d0e" },
  "Витамины": { bg: "#dbeafe", text: "#1e40af" },
  "Наука": { bg: "#ede9fe", text: "#5b21b6" },
};

const defaultStyle = { bg: "#f7f6f3", text: "#6b6b65" };

export function BlogPageClient({ dict }: Props) {
  return (
    <div className="pt-14 sm:pt-16">
      <section className="section-padding bg-white">
        <Container size="lg">
          <AnimatedSection className="mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1a5c55] mb-4">
              <span className="w-5 h-px bg-[#1a5c55]" />
              Blog
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-[#1a1a18] leading-[1.08]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {dict.blog.title}
            </h1>
            <p className="mt-3 text-base text-[#6b6b65] max-w-lg">
              {dict.blog.subtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {dict.blog.posts.map((post, index) => {
              const catStyle = CATEGORY_COLORS[post.category] || defaultStyle;
              return (
                <AnimatedSection key={index} delay={index * 0.08} animation="fadeUp">
                  <div className="group bg-white border border-[#e8e6e1] rounded-[1.5rem] overflow-hidden cursor-pointer h-full flex flex-col transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
                    {/* Image placeholder */}
                    <div className="relative h-44 sm:h-48 bg-[#f7f6f3] flex items-center justify-center overflow-hidden">
                      <div className="text-5xl opacity-25 group-hover:scale-110 transition-transform duration-500 select-none">
                        📖
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 p-5 sm:p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
                        >
                          {post.category}
                        </span>
                        <span className="text-xs text-[#9b9b93]">
                          {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#1a1a18] mb-2 leading-snug tracking-tight group-hover:text-[#1a5c55] transition-colors duration-200 flex-1">
                        {post.title}
                      </h3>

                      <p className="text-sm text-[#6b6b65] leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-1.5 text-sm font-medium text-[#1a5c55] mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {dict.blog.readMore}
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
