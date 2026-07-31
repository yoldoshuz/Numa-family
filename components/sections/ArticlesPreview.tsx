"use client";

import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ArrowRightIcon } from "@/components/ui/icons";
import { useArticles } from "@/hooks/useArticles";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

export function ArticlesPreview({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.articles;
  const { data, isLoading, isError } = useArticles("family", { limit: 3 });
  const posts = data ?? [];

  return (
    <section id="articles" className="bg-white pb-14 sm:pb-16 lg:pb-20">
      <div className="shell">
        <AnimatedSection>
          <h2 className="text-center text-[1.5rem] font-extrabold text-ink uppercase sm:text-[1.9rem] lg:text-[2.1rem]">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-[0.95rem] leading-[1.7] text-body sm:text-base">
            {t.description}
          </p>
        </AnimatedSection>

        <div className="mt-6 flex justify-end">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-brand px-5 text-[0.82rem] font-medium text-brand transition-colors hover:bg-mist"
          >
            {t.viewAll}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {isLoading && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-card-lg bg-mist/70" />
            ))}
          </div>
        )}

        {isError && (
          <p className="mt-6 rounded-card-lg border border-hairline bg-paper p-8 text-center text-body">
            {t.error}
          </p>
        )}

        {!isLoading && !isError && posts.length === 0 && (
          <p className="mt-6 rounded-card-lg border border-hairline bg-paper p-8 text-center text-body">
            {t.empty}
          </p>
        )}

        {posts.length > 0 && (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {posts.map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 0.08} className="h-full">
                <li className="h-full list-none">
                  <ArticleCard post={post} locale={locale} readMore={t.readMore} />
                </li>
              </AnimatedSection>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
