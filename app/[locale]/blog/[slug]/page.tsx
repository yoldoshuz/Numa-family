import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { blogApi } from "@/lib/api/articles";
import { pickLang } from "@/lib/utils/format";
import { BlogPostClient } from "./BlogPostClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);

  try {
    const post = await blogApi.bySlug(slug, "family");
    if (post) {
      return {
        title: pickLang(post.seoTitle ?? post.title, locale),
        description: pickLang(post.seoDescription ?? post.excerpt, locale) || undefined,
        openGraph: post.coverImageUrl ? { images: [post.coverImageUrl] } : undefined,
      };
    }
  } catch {
    // Fall through to the generic blog title.
  }

  return { title: `${dict.blog.heroTitle} ${dict.blog.heroAccent}` };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);

  return <BlogPostClient dict={dict} locale={locale as Locale} slug={slug} />;
}
