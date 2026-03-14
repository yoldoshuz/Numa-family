"use client";

import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  dict: Dictionary;
  locale: Locale;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Health: { bg: "#dcfce7", text: "#166534" },
  Nutrition: { bg: "#fef9c3", text: "#854d0e" },
  Testing: { bg: "#dbeafe", text: "#1e40af" },
  Family: { bg: "#ede9fe", text: "#5b21b6" },
  Kids: { bg: "#fce7f3", text: "#9d174d" },
  "Здоровье": { bg: "#dcfce7", text: "#166534" },
  "Питание": { bg: "#fef9c3", text: "#854d0e" },
  "Тестирование": { bg: "#dbeafe", text: "#1e40af" },
  "Семья": { bg: "#ede9fe", text: "#5b21b6" },
  "Дети": { bg: "#fce7f3", text: "#9d174d" },
  "Sog'liq": { bg: "#dcfce7", text: "#166534" },
  "Ovqatlanish": { bg: "#fef9c3", text: "#854d0e" },
  "Testlar": { bg: "#dbeafe", text: "#1e40af" },
  "Oila": { bg: "#ede9fe", text: "#5b21b6" },
  "Bolalar": { bg: "#fce7f3", text: "#9d174d" },
};

const defaultStyle = { bg: "#f7f6f3", text: "#6b6b65" };

export function BlogPageClient({ dict }: Props) {
  return (
    <div className="pt-14 sm:pt-16">
      <section className="section-padding bg-white">
        <Container size="lg">
          <AnimatedSection className="mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-teal mb-4">
              <span className="w-5 h-px bg-teal" />
              Blog
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-text-primary leading-[1.08]"
            >
              {dict.blog.title}
            </h1>
            <p className="mt-3 text-base text-text-secondary max-w-lg">
              {dict.blog.subtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {dict.blog.posts.map((post: { title: string; excerpt: string; category: string; date: string }, index: number) => {
              const catStyle = CATEGORY_COLORS[post.category] || defaultStyle;
              return (
                <AnimatedSection key={index} delay={index * 0.08} animation="fadeUp">
                  <Card className="overflow-hidden cursor-pointer h-full border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                    <div className="relative h-44 sm:h-48 bg-surface-secondary flex items-center justify-center overflow-hidden">
                      <div className="text-5xl opacity-25 group-hover:scale-110 transition-transform duration-500 select-none">📖</div>
                    </div>
                    <CardContent className="p-5 sm:p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: catStyle.bg, color: catStyle.text }}>
                          {post.category}
                        </span>
                        <span className="text-xs text-text-tertiary">
                          {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-text-primary mb-2 leading-snug tracking-tight group-hover:text-teal transition-colors flex-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-teal mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        {dict.blog.readMore}
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
