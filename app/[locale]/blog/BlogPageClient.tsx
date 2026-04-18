"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useArticles } from "@/hooks/useArticles";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { FileText, ArrowRight } from "lucide-react";

interface Props {
  dict: Dictionary;
  locale: Locale;
}

function pickLang<T extends Record<string, string | undefined | null>>(
  field: T | null | undefined,
  locale: string
): string {
  if (!field) return "";
  return (field[locale] ?? field.en ?? field.ru ?? "") as string;
}

export function BlogPageClient({ dict, locale }: Props) {
  const { data, isLoading, isError } = useArticles({ store: "family", limit: 24 });
  const articles = data?.articles ?? [];

  return (
    <div className="pt-14 sm:pt-16">
      <section className="py-14 md:py-20 lg:py-28 bg-white">
        <Container size="lg">
          <AnimatedSection className="mb-10 sm:mb-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-teal-700" />
              </div>
              <span className="text-sm font-semibold text-teal-700 uppercase tracking-wider">
                {dict.blog.title}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-text-primary leading-[1.05]">
              {dict.blog.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed">
              {dict.blog.subtitle}
            </p>
          </AnimatedSection>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-teal-50/40 border border-teal-100/60 h-80 animate-pulse"
                />
              ))}
            </div>
          )}

          {isError && (
            <div className="rounded-3xl border border-rose-100 bg-rose-50/60 p-8 text-center text-rose-700">
              {dict.blog.error}
            </div>
          )}

          {!isLoading && !isError && articles.length === 0 && (
            <div className="rounded-3xl border border-teal-100 bg-teal-50/60 p-10 text-center text-teal-800">
              {dict.blog.empty}
            </div>
          )}

          {!isLoading && !isError && articles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {articles.map((post, index) => (
                <AnimatedSection key={post.id} delay={index * 0.05} animation="fadeUp">
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="block h-full rounded-3xl overflow-hidden bg-white border border-border hover:border-teal-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="relative h-44 sm:h-52 bg-linear-to-br from-teal-50 to-surface-secondary overflow-hidden">
                      {post.coverImageUrl ? (
                        <Image
                          src={post.coverImageUrl}
                          alt={pickLang(post.title, locale)}
                          fill
                          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/80 shadow-sm">
                            <FileText className="w-7 h-7 text-teal-700/60" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-5 sm:p-6 flex flex-col">
                      <div className="flex items-center gap-3 mb-3 text-xs text-text-tertiary">
                        {post.publishedAt && (
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString(
                              locale === "ru" ? "ru-RU" : locale === "uz" ? "uz-UZ" : "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )}
                          </span>
                        )}
                        {post.readTimeMinutes && (
                          <span>· {post.readTimeMinutes} {dict.blog.readTime}</span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2 leading-snug tracking-tight group-hover:text-teal-700 transition-colors">
                        {pickLang(post.title, locale)}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
                          {pickLang(post.excerpt, locale)}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-sm font-medium text-teal-700 mt-auto transition-all duration-300 group-hover:translate-x-1">
                        {dict.blog.readMore}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
