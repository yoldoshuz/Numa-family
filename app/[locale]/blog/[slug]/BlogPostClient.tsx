"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useArticle } from "@/hooks/useArticles";
import { resolveMediaUrl } from "@/lib/api/products";
import { storeSiteUrl } from "@/lib/config/sites";
import { formatPrice } from "@/lib/utils/format";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import type { BlogProductCard, MultilingualText } from "@/lib/api/types";
import { ArrowLeft, Clock, Calendar, Leaf } from "lucide-react";

interface Props {
  dict: Dictionary;
  locale: Locale;
  slug: string;
}

function pickLang(field: MultilingualText | null | undefined, locale: string): string {
  if (!field) return "";
  const map = field as Record<string, string>;
  return map[locale] ?? map.en ?? map.ru ?? "";
}

function blogProductImage(card: BlogProductCard): string | null {
  const p = card.product;
  const fromMedia = p.media?.find((m) => m.type === "image")?.url;
  return resolveMediaUrl(p.imageUrl ?? fromMedia ?? null);
}

export function BlogPostClient({ dict, locale, slug }: Props) {
  const { data: post, isLoading, isError } = useArticle(slug, "family");

  return (
    <div className="pt-14 sm:pt-16">
      <section className="py-10 md:py-16 lg:py-20 bg-white">
        <Container size="md">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {dict.blog.title}
          </Link>

          {isLoading && (
            <div className="space-y-6">
              <div className="h-12 w-3/4 rounded-2xl bg-teal-50/60 animate-pulse" />
              <div className="h-72 rounded-3xl bg-teal-50/40 animate-pulse" />
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 rounded bg-teal-50/40 animate-pulse" />
                ))}
              </div>
            </div>
          )}

          {isError && (
            <div className="rounded-3xl border border-rose-100 bg-rose-50/60 p-8 text-center text-rose-700">
              {dict.blog.error}
            </div>
          )}

          {!isLoading && !isError && !post && (
            <div className="rounded-3xl border border-teal-100 bg-teal-50/60 p-10 text-center text-teal-800">
              {dict.blog.empty}
            </div>
          )}

          {!isLoading && !isError && post && (
            <article>
              <AnimatedSection>
                <div className="flex flex-wrap items-center gap-4 mb-5 text-xs text-text-tertiary">
                  {post.publishedAt && (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.publishedAt).toLocaleDateString(
                        locale === "ru"
                          ? "ru-RU"
                          : locale === "uz"
                          ? "uz-UZ"
                          : "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )}
                    </span>
                  )}
                  {post.readTimeMinutes && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTimeMinutes} {dict.blog.readTime}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-text-primary leading-[1.08]">
                  {pickLang(post.title, locale)}
                </h1>
                {post.excerpt && (
                  <p className="mt-5 text-base sm:text-lg text-text-secondary leading-relaxed">
                    {pickLang(post.excerpt, locale)}
                  </p>
                )}
                {post.tags?.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </AnimatedSection>

              {post.coverImageUrl && (
                <AnimatedSection delay={0.1} className="mt-10">
                  <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-teal-50/40">
                    <Image
                      src={post.coverImageUrl}
                      alt={pickLang(post.title, locale)}
                      fill
                      sizes="(max-width:1024px) 100vw, 800px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </AnimatedSection>
              )}

              <AnimatedSection delay={0.15} className="mt-10">
                <div
                  className="prose prose-lg max-w-none prose-headings:tracking-tight prose-headings:text-text-primary prose-p:text-text-secondary prose-p:leading-relaxed prose-a:text-teal-700"
                  dangerouslySetInnerHTML={{
                    __html: pickLang(post.content, locale),
                  }}
                />
              </AnimatedSection>

              {post.products?.length > 0 && (
                <AnimatedSection delay={0.2} className="mt-14">
                  <h2 className="text-xl sm:text-2xl font-semibold text-text-primary mb-5">
                    {dict.naturalSupport?.ourProducts ?? "Products"}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {post.products.map((card) => {
                      const img = blogProductImage(card);
                      const name = pickLang(card.product.name, locale);
                      const inner = (
                        <>
                          <div className="relative h-40 flex items-center justify-center overflow-hidden bg-linear-to-br from-teal-50 to-white">
                            {img ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={img}
                                alt={name}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100/70 text-teal-700">
                                <Leaf className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div className="p-4 sm:p-5">
                            <p className="text-xs uppercase tracking-wider text-teal-700 font-semibold mb-1.5">
                              {card.product.brand ?? card.product.store}
                            </p>
                            <h3 className="text-base font-semibold text-text-primary leading-snug">
                              {name}
                            </h3>
                            {card.note && (
                              <p className="mt-2 text-sm text-text-secondary">
                                {card.note}
                              </p>
                            )}
                            <div className="mt-3 flex items-baseline gap-2">
                              {card.product.discountPrice ? (
                                <>
                                  <span className="text-base font-semibold text-teal-800">
                                    {formatPrice(card.product.discountPrice, locale)}
                                  </span>
                                  <span className="text-xs text-text-tertiary line-through">
                                    {formatPrice(card.product.price, locale)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-base font-semibold text-teal-800">
                                  {formatPrice(card.product.price, locale)}
                                </span>
                              )}
                            </div>
                          </div>
                        </>
                      );

                      const cardClass =
                        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-white hover:border-teal-200 hover:shadow-lg transition-all duration-300";
                      const site = storeSiteUrl(card.store);

                      // Redirect to the marketplace that sells this product.
                      if (site) {
                        return (
                          <a
                            key={card.productId}
                            href={site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cardClass}
                          >
                            {inner}
                          </a>
                        );
                      }

                      return card.product.slug ? (
                        <Link
                          key={card.productId}
                          href={`/${locale}/products/${card.product.slug}`}
                          className={cardClass}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <div
                          key={card.productId}
                          className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white"
                        >
                          {inner}
                        </div>
                      );
                    })}
                  </div>
                </AnimatedSection>
              )}
            </article>
          )}
        </Container>
      </section>
    </div>
  );
}
