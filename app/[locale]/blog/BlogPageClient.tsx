"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { useArticles } from "@/hooks/useArticles";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import type { BlogPost } from "@/lib/api/types";

interface Props {
  dict: Dictionary;
  locale: Locale;
}

export function BlogPageClient({ dict, locale }: Props) {
  const t = dict.blog;
  const { data, isLoading, isError } = useArticles("family", { limit: 48 });
  const posts = data ?? [];

  // "Popular" is the two most-read posts; everything else stays chronological.
  const popular = [...posts].sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0)).slice(0, 2);
  const popularIds = new Set(popular.map((p) => p.id));
  const latest = posts.filter((p) => !popularIds.has(p.id));

  return (
    <>
      <section className="relative overflow-hidden bg-haze">
        <div className="shell relative z-10 grid items-center lg:grid-cols-2">
          <AnimatedSection className="order-2 py-10 lg:order-1 lg:py-24 lg:pr-12">
            <h1 className="text-[2rem] leading-[1.2] font-extrabold text-ink sm:text-[2.5rem] lg:text-[2.9rem]">
              {t.heroTitle}
              <br />
              <span className="text-sea">{t.heroAccent}</span>
            </h1>
            <p className="mt-5 max-w-md text-[0.9rem] leading-[1.75] text-body sm:text-[0.95rem]">
              {t.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#latest"
                className="inline-flex h-12 items-center rounded-lg bg-sea px-6 text-[0.85rem] font-semibold text-white transition-colors hover:bg-sea-dark"
              >
                {t.tabLatest}
              </a>
              <a
                href="#popular"
                className="inline-flex h-12 items-center rounded-lg border border-brand/40 bg-white px-6 text-[0.85rem] font-semibold text-brand transition-colors hover:bg-mist"
              >
                {t.tabPopular}
              </a>
            </div>
          </AnimatedSection>

          <div className="relative order-1 -mx-5 h-56 sm:-mx-6 sm:h-72 lg:hidden">
            <Image
              src="/img/mission-science.png"
              alt={`${t.heroTitle} NUMA Family`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="absolute inset-y-0 right-0 hidden w-[54%] lg:block">
          <Image
            src="/img/mission-science.png"
            alt={`${t.heroTitle} NUMA Family`}
            fill
            priority
            sizes="54vw"
            className="object-cover"
          />
        </div>
      </section>

      {isLoading && (
        <section className="bg-white section-y">
          <div className="shell grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-card-lg bg-mist/70" />
            ))}
          </div>
        </section>
      )}

      {isError && <Notice text={t.error} />}
      {!isLoading && !isError && posts.length === 0 && <Notice text={t.empty} />}

      {popular.length > 0 && (
        <PostSection id="popular" title={t.popularTitle}>
          <ul className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            {popular.map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 0.08} className="h-full">
                <li className="h-full list-none">
                  <ArticleCard post={post} locale={locale} readMore={t.readMore} tagLabels={dict.blogTags} size="wide" />
                </li>
              </AnimatedSection>
            ))}
          </ul>
        </PostSection>
      )}

      {latest.length > 0 && (
        <PostSection id="latest" title={t.latestTitle} tight={popular.length > 0}>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {latest.map((post: BlogPost, i) => (
              <AnimatedSection key={post.id} delay={(i % 3) * 0.08} className="h-full">
                <li className="h-full list-none">
                  <ArticleCard post={post} locale={locale} readMore={t.readMore} tagLabels={dict.blogTags} />
                </li>
              </AnimatedSection>
            ))}
          </ul>
        </PostSection>
      )}
    </>
  );
}

function PostSection({
  id,
  title,
  tight,
  children,
}: {
  id: string;
  title: string;
  tight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden bg-white scroll-mt-24 ${tight ? "pb-14 sm:pb-16 lg:pb-20" : "section-y"}`}
    >
      {!tight && (
        <Image
          src="/decor/network-soft.svg"
          alt=""
          width={520}
          height={620}
          aria-hidden
          className="pointer-events-none absolute -top-10 -left-28 hidden w-64 opacity-40 lg:block"
        />
      )}
      <div className="shell relative">
        <AnimatedSection>
          <h2 className="text-[1.4rem] font-extrabold text-ink sm:text-[1.75rem] lg:text-[1.95rem]">
            {title}
          </h2>
        </AnimatedSection>
        <div className="mt-7 lg:mt-9">{children}</div>
      </div>
    </section>
  );
}

function Notice({ text }: { text: string }) {
  return (
    <section className="bg-white section-y">
      <div className="shell">
        <p className="rounded-card-lg border border-hairline bg-paper p-10 text-center text-body">
          {text}
        </p>
      </div>
    </section>
  );
}
