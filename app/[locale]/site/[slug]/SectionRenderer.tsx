"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import type { SiteSection } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";

interface RendererProps {
  section: SiteSection;
  locale: Locale;
}

type AnyRecord = Record<string, unknown>;

function pickLang(value: unknown, locale: string): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const map = value as Record<string, string>;
    return map[locale] ?? map.en ?? map.ru ?? Object.values(map)[0] ?? "";
  }
  return String(value);
}

function styleFrom(section: SiteSection): CSSProperties {
  const s = section.style ?? {};
  return {
    backgroundColor: s.backgroundColor,
    color: s.textColor,
    paddingTop: s.paddingTop ? `${s.paddingTop}px` : undefined,
    paddingBottom: s.paddingBottom ? `${s.paddingBottom}px` : undefined,
    maxWidth: s.maxWidth,
  };
}

export function SectionRenderer({ section, locale }: RendererProps) {
  const c = section.content as AnyRecord;
  const inlineStyle = styleFrom(section);

  switch (section.type) {
    case "hero": {
      const heading = pickLang(c.heading, locale);
      const subheading = pickLang(c.subheading, locale);
      const bgImage = (c.bgImageUrl as string) || undefined;
      const overlay = Number(c.overlayOpacity ?? 0.4);
      const ctaText = pickLang(c.ctaText, locale);
      const ctaLink = (c.ctaLink as string) || "#";
      const secondaryCtaText = pickLang(c.secondaryCtaText, locale);
      const secondaryCtaLink = (c.secondaryCtaLink as string) || "#";

      return (
        <section
          className="relative overflow-hidden"
          style={{ minHeight: "60vh", ...inlineStyle }}
        >
          {bgImage && (
            <>
              <Image
                src={bgImage}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-black"
                style={{ opacity: overlay }}
              />
            </>
          )}
          <div className="relative">
            <Container size="lg" className="py-20 md:py-28 lg:py-36">
              <AnimatedSection className="max-w-3xl">
                {heading && (
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.05] text-white">
                    {heading}
                  </h1>
                )}
                {subheading && (
                  <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/80 max-w-xl">
                    {subheading}
                  </p>
                )}
                {(ctaText || secondaryCtaText) && (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {ctaText && (
                      <Button
                        asChild
                        className="rounded-full bg-teal-700 hover:bg-teal-800 text-white px-6 h-11"
                      >
                        <Link href={ctaLink}>{ctaText}</Link>
                      </Button>
                    )}
                    {secondaryCtaText && (
                      <Button
                        asChild
                        variant="outline"
                        className="rounded-full border-white/40 text-white hover:bg-white/10 px-6 h-11"
                      >
                        <Link href={secondaryCtaLink}>{secondaryCtaText}</Link>
                      </Button>
                    )}
                  </div>
                )}
              </AnimatedSection>
            </Container>
          </div>
        </section>
      );
    }

    case "text_block": {
      const heading = pickLang(c.heading, locale);
      const body = pickLang(c.body, locale);
      const align = (c.align as string) || "left";
      return (
        <section className="py-14 md:py-20" style={inlineStyle}>
          <Container size="md">
            <div className={align === "center" ? "text-center" : ""}>
              {heading && (
                <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-text-primary leading-tight mb-5">
                  {heading}
                </h2>
              )}
              {body && (
                <div
                  className="prose prose-lg max-w-none text-text-secondary leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              )}
            </div>
          </Container>
        </section>
      );
    }

    case "features": {
      const heading = pickLang(c.heading, locale);
      const columns = Number(c.columns ?? 3);
      const items = (c.items as AnyRecord[]) ?? [];
      const colsClass =
        columns === 2
          ? "sm:grid-cols-2"
          : columns === 4
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : "sm:grid-cols-2 lg:grid-cols-3";
      return (
        <section className="py-14 md:py-20 bg-white" style={inlineStyle}>
          <Container size="lg">
            {heading && (
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-text-primary leading-tight mb-10 text-center">
                {heading}
              </h2>
            )}
            <div className={`grid grid-cols-1 ${colsClass} gap-5`}>
              {items.map((item, idx) => (
                <AnimatedSection
                  key={idx}
                  delay={idx * 0.05}
                  className="rounded-3xl border border-border bg-surface-secondary/40 p-6"
                >
                  {typeof item.icon === "string" && item.icon ? (
                    <div className="mb-4 text-2xl">{item.icon}</div>
                  ) : null}
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {pickLang(item.title, locale)}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {pickLang(item.description, locale)}
                  </p>
                </AnimatedSection>
              ))}
            </div>
          </Container>
        </section>
      );
    }

    case "gallery": {
      const heading = pickLang(c.heading, locale);
      const images = (c.images as AnyRecord[]) ?? [];
      return (
        <section className="py-14 md:py-20" style={inlineStyle}>
          <Container size="lg">
            {heading && (
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-text-primary leading-tight mb-10 text-center">
                {heading}
              </h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {images.map((img, idx) => {
                const url = (img.url as string) || (img.src as string) || "";
                if (!url) return null;
                return (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-teal-50/40"
                  >
                    <Image
                      src={url}
                      alt={pickLang(img.alt, locale)}
                      fill
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      );
    }

    case "cta": {
      const heading = pickLang(c.heading, locale);
      const subheading = pickLang(c.subheading, locale);
      const ctaText = pickLang(c.ctaText, locale);
      const ctaLink = (c.ctaLink as string) || "#";
      const bgColor = (c.bgColor as string) || "#0f766e";
      const bgImage = (c.bgImageUrl as string) || undefined;
      return (
        <section
          className="relative overflow-hidden"
          style={{ backgroundColor: bgColor, ...inlineStyle }}
        >
          {bgImage && (
            <>
              <Image src={bgImage} alt="" fill sizes="100vw" className="object-cover opacity-40" />
            </>
          )}
          <Container size="md" className="relative py-16 md:py-24 text-center">
            {heading && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                {subheading}
              </p>
            )}
            {ctaText && (
              <div className="mt-8">
                <Button
                  asChild
                  className="rounded-full bg-white text-teal-800 hover:bg-white/90 px-7 h-12 text-sm font-semibold"
                >
                  <Link href={ctaLink}>{ctaText}</Link>
                </Button>
              </div>
            )}
          </Container>
        </section>
      );
    }

    case "faq": {
      const heading = pickLang(c.heading, locale);
      const items = (c.items as AnyRecord[]) ?? [];
      return (
        <section className="py-14 md:py-20 bg-white" style={inlineStyle}>
          <Container size="md">
            {heading && (
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-text-primary leading-tight mb-8">
                {heading}
              </h2>
            )}
            <div className="divide-y divide-border rounded-3xl border border-border bg-white">
              {items.map((item, idx) => (
                <details key={idx} className="group p-5 sm:p-6">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                    <span className="font-semibold text-text-primary">
                      {pickLang(item.question ?? item.q, locale)}
                    </span>
                    <span className="text-teal-700 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                    {pickLang(item.answer ?? item.a, locale)}
                  </p>
                </details>
              ))}
            </div>
          </Container>
        </section>
      );
    }

    case "stats": {
      const heading = pickLang(c.heading, locale);
      const items = (c.items as AnyRecord[]) ?? [];
      return (
        <section className="py-14 md:py-20 bg-surface-secondary" style={inlineStyle}>
          <Container size="lg">
            {heading && (
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-text-primary leading-tight mb-10 text-center">
                {heading}
              </h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
              {items.map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-teal-700 tracking-tight mb-1">
                    {pickLang(item.value, locale) || String(item.value ?? "")}
                  </div>
                  <div className="text-sm text-text-tertiary">
                    {pickLang(item.label, locale)}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      );
    }

    case "team": {
      const heading = pickLang(c.heading, locale);
      const members = (c.members as AnyRecord[]) ?? [];
      return (
        <section className="py-14 md:py-20 bg-white" style={inlineStyle}>
          <Container size="lg">
            {heading && (
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-text-primary leading-tight mb-10 text-center">
                {heading}
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {members.map((m, idx) => {
                const photo = (m.photo as string) || (m.imageUrl as string) || "";
                return (
                  <div key={idx} className="text-center">
                    {photo && (
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-teal-50/40 mb-4">
                        <Image
                          src={photo}
                          alt={pickLang(m.name, locale)}
                          fill
                          sizes="(max-width:640px) 100vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-text-primary">
                      {pickLang(m.name, locale)}
                    </h3>
                    <p className="text-sm text-text-tertiary">
                      {pickLang(m.role ?? m.position, locale)}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      );
    }

    case "reviews": {
      const heading = pickLang(c.heading, locale);
      const items = (c.items as AnyRecord[]) ?? [];
      return (
        <section className="py-14 md:py-20 bg-surface-secondary" style={inlineStyle}>
          <Container size="lg">
            {heading && (
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-text-primary leading-tight mb-10 text-center">
                {heading}
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-border bg-white p-6"
                >
                  <p className="text-sm text-text-secondary leading-relaxed">
                    “{pickLang(item.text ?? item.review, locale)}”
                  </p>
                  <div className="mt-4 text-sm font-semibold text-text-primary">
                    {pickLang(item.author ?? item.name, locale)}
                  </div>
                  {item.role ? (
                    <div className="text-xs text-text-tertiary">
                      {pickLang(item.role, locale)}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Container>
        </section>
      );
    }

    case "custom":
    default: {
      const html = pickLang(c.html ?? c.body, locale);
      if (!html) return null;
      return (
        <section className="py-14 md:py-20" style={inlineStyle}>
          <Container size="md">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </Container>
        </section>
      );
    }
  }
}
