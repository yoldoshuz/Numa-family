"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { TelegramIcon, GlobeIcon, InstagramIcon } from "@/components/ui/icons";
import { useArticle, useArticles } from "@/hooks/useArticles";
import { pickLang, formatDate } from "@/lib/utils/format";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  dict: Dictionary;
  locale: Locale;
  slug: string;
}

export function BlogPostClient({ dict, locale, slug }: Props) {
  const t = dict.blog;
  const { data: post, isLoading, isError } = useArticle(slug, "family");
  const { data: all } = useArticles("family", { limit: 12 });

  const related = (all ?? []).filter((p) => p.slug !== slug).slice(0, 3);
  const title = post ? pickLang(post.title, locale) : "";

  if (isLoading) {
    return (
      <div className="shell section-y">
        <div className="h-8 w-1/3 animate-pulse rounded-lg bg-mist" />
        <div className="mt-6 h-14 w-2/3 animate-pulse rounded-lg bg-mist" />
        <div className="mt-8 aspect-[16/8] max-w-4xl animate-pulse rounded-card-lg bg-mist" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="shell section-y">
        <p className="rounded-card-lg border border-hairline bg-paper p-10 text-center text-body">
          {isError ? t.error : t.notFound}
        </p>
        <div className="mt-6 text-center">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex h-11 items-center rounded-lg bg-sea px-6 text-sm font-semibold text-white"
          >
            {t.backToBlog}
          </Link>
        </div>
      </div>
    );
  }

  const tag = post.tags?.[0];

  return (
    <>
      <article className="bg-white pt-8 pb-12 sm:pt-10 lg:pt-12 lg:pb-16">
        <div className="shell">
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[0.78rem]">
            <Link href={`/${locale}`} className="text-body transition-colors hover:text-brand">
              {t.breadcrumbHome}
            </Link>
            <span className="text-faint">/</span>
            <Link href={`/${locale}/blog`} className="text-body transition-colors hover:text-brand">
              {t.breadcrumbBlog}
            </Link>
            <span className="text-faint">/</span>
            <span className="text-faint">{title}</span>
          </nav>

          <div className="max-w-4xl">
            {tag && (
              <span className="mt-6 inline-block rounded-full bg-brand-badge px-4 py-1.5 text-[0.7rem] font-bold tracking-wide text-white uppercase">
                {tag}
              </span>
            )}

            <h1 className="mt-5 text-[1.6rem] leading-[1.25] font-extrabold text-ink sm:text-[2rem] lg:text-[2.2rem]">
              {title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
              {post.publishedAt && (
                <MetaItem text={formatDate(post.publishedAt, locale)}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
                    <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5M8.5 14h5M8.5 17h3" />
                  </svg>
                </MetaItem>
              )}
              {post.readTimeMinutes && (
                <MetaItem text={`${post.readTimeMinutes} ${t.readTime}`}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M12 7.5V12l3 2" strokeLinecap="round" />
                  </svg>
                </MetaItem>
              )}
            </div>

            {post.coverImageUrl && (
              <AnimatedSection delay={0.05}>
                <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-card-lg bg-mist">
                  <Image
                    src={post.coverImageUrl}
                    alt={title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 900px"
                    quality={90}
                    className="object-cover object-[center_25%]"
                  />
                </div>
              </AnimatedSection>
            )}

            {post.excerpt && (
              <p className="mt-8 text-[0.95rem] leading-[1.8] text-body sm:text-base">
                {pickLang(post.excerpt, locale)}
              </p>
            )}

            <div
              className="article-body mt-6"
              dangerouslySetInnerHTML={{ __html: pickLang(post.content, locale) }}
            />

            <ShareRow label={t.share} title={title} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-white pb-14 sm:pb-16 lg:pb-20">
          <div className="shell">
            <h2 className="text-[1.4rem] font-extrabold text-ink sm:text-[1.75rem] lg:text-[1.95rem]">
              {t.related}
            </h2>
            <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {related.map((item, i) => (
                <AnimatedSection key={item.id} delay={i * 0.08} className="h-full">
                  <li className="h-full list-none">
                    <ArticleCard post={item} locale={locale} readMore={t.readMore} />
                  </li>
                </AnimatedSection>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

function MetaItem({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2.5 text-[0.8rem] text-body">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-node text-white">
        {children}
      </span>
      {text}
    </span>
  );
}

function ShareRow({ label, title }: { label: string; title: string }) {
  const share = (platform: "telegram" | "link" | "instagram") => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (platform === "telegram") {
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        "_blank",
        "noopener"
      );
      return;
    }
    if (platform === "instagram") {
      window.open("https://instagram.com/numa_family", "_blank", "noopener");
      return;
    }
    navigator.clipboard?.writeText(url);
  };

  const buttons = [
    { key: "telegram" as const, Icon: TelegramIcon, label: "Telegram" },
    { key: "link" as const, Icon: GlobeIcon, label: "Copy link" },
    { key: "instagram" as const, Icon: InstagramIcon, label: "Instagram" },
  ];

  return (
    <div className="mt-10 flex flex-wrap items-center gap-4">
      <span className="text-[0.95rem] font-bold text-brand">{label}</span>
      {buttons.map(({ key, Icon, label: aria }) => (
        <button
          key={key}
          type="button"
          onClick={() => share(key)}
          aria-label={aria}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white transition-transform hover:-translate-y-0.5"
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  );
}
