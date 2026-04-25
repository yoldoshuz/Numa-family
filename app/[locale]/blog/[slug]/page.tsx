import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { BlogPostClient } from "./BlogPostClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return { title: dict.blog.title };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);

  return <BlogPostClient dict={dict} locale={locale as Locale} slug={slug} />;
}
