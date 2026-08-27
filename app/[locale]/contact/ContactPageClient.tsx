"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { InstagramIcon, TelegramIcon, FacebookIcon } from "@/components/ui/icons";
import { CONTACTS } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  dict: Dictionary;
  locale: Locale;
}

/**
 * Yandex is the map the other Numa storefronts embed, and the one people here
 * actually navigate with. Keyless widget, resolved from the office address
 * rather than a literal pin: the previous coordinate pointed at the city
 * centre, several kilometres from Yashnabod.
 */
const MAP_EMBED =
  "https://yandex.uz/map-widget/v1/?text=%D0%A2%D0%B0%D1%88%D0%BA%D0%B5%D0%BD%D1%82%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%AD%D0%BB%D0%B1%D0%B5%D0%BA%2C%2031&z=17&lang=ru_RU";

export function ContactPageClient({ dict }: Props) {
  const t = dict.contact;
  const telHref = `tel:${t.phone.replace(/[^+\d]/g, "")}`;

  const rows = [
    { key: "phone", value: t.phone, href: telHref, icon: <PhoneGlyph /> },
    {
      key: "instagram",
      value: CONTACTS.instagram,
      href: CONTACTS.instagramHref,
      external: true,
      icon: <InstagramIcon className="h-5 w-5" />,
    },
    {
      key: "telegram",
      value: CONTACTS.telegram,
      href: CONTACTS.telegramHref,
      external: true,
      icon: <TelegramIcon className="h-5 w-5" />,
    },
    {
      key: "facebook",
      value: "Facebook",
      href: CONTACTS.facebookHref,
      external: true,
      icon: <FacebookIcon className="h-5 w-5" />,
    },
    { key: "hours", value: t.hours, icon: <ClockGlyph /> },
    { key: "address", value: t.address, icon: <PinGlyph /> },
    { key: "email", value: CONTACTS.email, href: CONTACTS.emailHref, icon: <MailGlyph /> },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        {/* SVG skips the optimizer: it 400s without `dangerouslyAllowSVG`, which stays off. */}
        <Image
          src="/decor/network-dense.svg"
          alt=""
          width={620}
          height={540}
          aria-hidden
          priority
          unoptimized
          className="pointer-events-none absolute -top-6 -right-10 w-72 opacity-70 sm:w-96 lg:right-0 lg:w-[34rem] lg:opacity-100"
        />

        <div className="shell relative">
          <AnimatedSection className="max-w-xl py-16 sm:py-20 lg:py-28">
            <h1 className="text-[1.9rem] leading-[1.2] font-extrabold text-ink sm:text-[2.4rem] lg:text-[2.9rem]">
              {t.heroTitle} <span className="text-sea">{t.heroAccent}</span>
            </h1>
            <p className="mt-5 max-w-md text-[0.9rem] leading-[1.75] text-body sm:text-[0.95rem]">
              {t.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <a
                href={telHref}
                className="inline-flex h-13 items-center rounded-lg bg-sea px-7 text-[0.9rem] font-semibold text-white transition-colors hover:bg-sea-dark"
              >
                {t.callNow}
              </a>
              {/* An offer to talk, so this one goes to the administrator. */}
              <a
                href={CONTACTS.telegramAdminHref}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[0.9rem] font-medium text-brand-soft transition-colors hover:text-brand"
              >
                {t.viaTelegram}
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white pb-14 sm:pb-16 lg:pb-20">
        <div className="shell">
          <AnimatedSection>
            <h2 className="text-[1.35rem] font-extrabold text-ink sm:text-[1.6rem] lg:text-[1.75rem]">
              {t.infoTitle}
            </h2>
          </AnimatedSection>

          <div className="mt-7 grid gap-6 lg:mt-9 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
            <AnimatedSection animation="slideLeft">
              <div className="h-full rounded-card-lg border border-hairline bg-white px-6 py-8 shadow-(--shadow-card) sm:px-8 sm:py-10">
                <h3 className="text-lg font-extrabold text-sea sm:text-xl">{t.cardTitle}</h3>
                <ul className="mt-7 space-y-5">
                  {rows.map((row) => {
                    const content = (
                      <>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-node/60 text-brand-node">
                          {row.icon}
                        </span>
                        <span className="text-[0.85rem] text-brand-soft sm:text-[0.9rem]">
                          {row.value}
                        </span>
                      </>
                    );
                    return (
                      <li key={row.key}>
                        {row.href ? (
                          <a
                            href={row.href}
                            {...(row.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                            className="flex items-center gap-4 transition-colors hover:text-brand"
                          >
                            {content}
                          </a>
                        ) : (
                          <span className="flex items-center gap-4">{content}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideRight">
              <div className="h-full overflow-hidden rounded-card-lg border border-hairline bg-mist">
                <iframe
                  src={MAP_EMBED}
                  title={t.mapTitle}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[20rem] w-full border-0 lg:min-h-[26rem]"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}

function PhoneGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path
        d="M6.4 3.5h2.1l1.6 4-2 1.3a11.5 11.5 0 0 0 5.1 5.1l1.3-2 4 1.6v2.1a2.4 2.4 0 0 1-2.6 2.4C10.4 17.4 6.6 13.6 4 7.1A2.4 2.4 0 0 1 6.4 3.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.2V12l3.2 2" strokeLinecap="round" />
    </svg>
  );
}

function PinGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M12 21s6.6-5.9 6.6-10.4A6.6 6.6 0 0 0 5.4 10.6C5.4 15.1 12 21 12 21Z" strokeLinejoin="round" />
      <circle cx="12" cy="10.4" r="2.4" />
    </svg>
  );
}

function MailGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="3" />
      <path d="m4.5 8 6.4 4.5a2 2 0 0 0 2.2 0L19.5 8" strokeLinecap="round" />
    </svg>
  );
}
