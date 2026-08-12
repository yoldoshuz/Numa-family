import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Montserrat } from "next/font/google";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CtaBand } from "@/components/layout/CtaBand";
import { ConsultationProvider } from "@/components/consultation/ConsultationProvider";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const font = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-sans",
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * How long a rendered page may be reused before it is built again, in seconds.
 *
 * Article bodies arrive in the browser through React Query, so what the reader
 * sees is already live. This is for the parts that are resolved on the server
 * and would otherwise be frozen at build time — chiefly an article's own
 * `<title>`, description and OG image, which `blog/[slug]` reads from the API
 * inside `generateMetadata`. Axios is invisible to Next's fetch cache, so
 * without this nothing ever marks those stale.
 *
 * Must stay a literal — Next evaluates this statically and rejects an import.
 */
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return {
    title: {
      default: dict.meta.title,
      template: `%s | NUMA Family`,
    },
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      siteName: "NUMA Family",
      locale: locale === "ru" ? "ru_RU" : locale === "uz" ? "uz_UZ" : "en_US",
      type: "website",
    },
    alternates: {
      languages: { ru: "/ru", en: "/en", uz: "/uz" },
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  return (
    <html lang={locale} className={`${font.variable} ${font.className}`}>
      <body className="antialiased">
        <ConsultationProvider locale={locale as Locale} dict={dict}>
          <Header locale={locale as Locale} dict={dict} />
          {/* Offset for the fixed header. */}
          <main className="pt-16 lg:pt-[86px]">{children}</main>
          <CtaBand dict={dict} />
          <Footer locale={locale as Locale} dict={dict} />
        </ConsultationProvider>
      </body>
    </html>
  );
}
