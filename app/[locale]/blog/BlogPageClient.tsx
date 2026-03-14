"use client";

import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { FileText, ArrowRight } from "lucide-react";

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
      <section className="py-16 md:py-24 lg:py-32 bg-white">
        <Container size="lg">
          <AnimatedSection className="mb-12 sm:mb-16">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-teal" />
              </div>
              <span className="text-sm font-semibold text-teal uppercase tracking-wider">
                {dict.blog.title}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-text-primary leading-[1.08]">
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
                  <Card className="overflow-hidden cursor-pointer h-full border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group rounded-2xl">
                    <div className="relative h-44 sm:h-48 bg-gradient-to-br from-teal-50 to-surface-secondary flex items-center justify-center overflow-hidden">
                      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/80 shadow-sm group-hover:scale-110 transition-transform duration-500">
                        <FileText className="w-7 h-7 text-teal/60" />
                      </div>
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
                      <div className="flex items-center gap-1.5 text-sm font-medium text-teal mt-auto opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                        {dict.blog.readMore}
                        <ArrowRight className="w-3.5 h-3.5" />
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
