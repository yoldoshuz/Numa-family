"use client";

import { Container } from "@/components/ui/Container";
import { useSitePage } from "@/hooks/useSite";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { SectionRenderer } from "./SectionRenderer";

interface Props {
  dict: Dictionary;
  locale: Locale;
  slug: string;
}

export function SitePageClient({ dict, locale, slug }: Props) {
  const { data: page, isLoading, isError } = useSitePage(slug, "family");

  if (isLoading) {
    return (
      <div className="pt-14 sm:pt-16">
        <Container size="lg" className="py-16">
          <div className="space-y-6">
            <div className="h-12 w-2/3 rounded-2xl bg-teal-50/60 animate-pulse" />
            <div className="h-72 rounded-3xl bg-teal-50/40 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-44 rounded-2xl bg-teal-50/40 animate-pulse" />
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-14 sm:pt-16">
        <Container size="md" className="py-16">
          <div className="rounded-3xl border border-rose-100 bg-rose-50/60 p-10 text-center text-rose-700">
            {dict.blog.error}
          </div>
        </Container>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="pt-14 sm:pt-16">
        <Container size="md" className="py-16">
          <div className="rounded-3xl border border-teal-100 bg-teal-50/60 p-10 text-center text-teal-800">
            {dict.blog.empty}
          </div>
        </Container>
      </div>
    );
  }

  const sections = [...(page.sections ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  return (
    <div className="pt-14 sm:pt-16">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} locale={locale} />
      ))}
    </div>
  );
}
