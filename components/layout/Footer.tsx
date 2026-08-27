import Link from "next/link";
import Image from "next/image";
import { TelegramIcon, GlobeIcon, InstagramIcon, FacebookIcon, YouTubeIcon } from "@/components/ui/icons";
import { CONTACTS, ISO_22000_CERTIFICATE } from "@/lib/constants";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

// The channel, not the administrator: a footer icon is a "where to find us",
// not an invitation into somebody's private chat.
const SOCIALS = [
  { key: "telegram", href: CONTACTS.telegramHref, Icon: TelegramIcon, label: `Telegram ${CONTACTS.telegram}` },
  { key: "instagram", href: CONTACTS.instagramHref, Icon: InstagramIcon, label: `Instagram ${CONTACTS.instagram}` },
  { key: "youtube", href: CONTACTS.youtubeHref, Icon: YouTubeIcon, label: "YouTube NUMA UZ" },
  { key: "facebook", href: CONTACTS.facebookHref, Icon: FacebookIcon, label: "Facebook" },
  { key: "site", href: CONTACTS.siteHref, Icon: GlobeIcon, label: CONTACTS.site },
];

export function Footer({ locale, dict }: FooterProps) {
  const f = dict.footer;

  return (
    <footer className="bg-sea text-white">
      <div className="shell grid gap-10 py-12 sm:py-14 lg:grid-cols-[minmax(0,1.15fr)_repeat(3,minmax(0,1fr))] lg:gap-8 lg:py-16">
        {/* Brand column */}
        <div className="lg:pr-10">
          <Link href={`/${locale}`} aria-label="NUMA Family">
            <Image
              src="/logo-white.png"
              alt="NUMA Family"
              width={1489}
              height={423}
              className="h-14 w-auto lg:h-16"
            />
          </Link>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/85">{f.description}</p>

          <p className="mt-8 text-sm font-bold">{f.socialTitle}</p>
          <div className="mt-3 flex items-center gap-3">
            {SOCIALS.map(({ key, href, Icon, label }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sea transition-transform hover:-translate-y-0.5"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/*
          Directions. Each one links to that brand's live site; the two with no
          site of their own stay plain text rather than becoming links that go
          nowhere, which is what the whole column used to be.
        */}
        <FooterColumn title={f.directions.title}>
          {f.directions.items.map((item) => (
            <li key={item.label}>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[0.95rem] text-white/90 transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-[0.95rem] text-white/90">{item.label}</span>
              )}
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title={f.company.title}>
          {f.company.items.map((item) => (
            <li key={item.label}>
              <Link
                href={`/${locale}${item.href === "/" ? "" : item.href}`}
                className="text-[0.95rem] text-white/90 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
          {/*
            A plain `<a>`, not the locale-aware `Link`: this is a file in
            `public/`, and prefixing it with `/ru` would 404.
          */}
          <li>
            <a
              href={ISO_22000_CERTIFICATE}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[0.95rem] text-white/90 transition-colors hover:text-white"
            >
              {f.certificate}
            </a>
          </li>
        </FooterColumn>

        <FooterColumn title={f.contacts.title}>
          <li className="text-[0.95rem] text-white/90">{f.contacts.address}</li>
          <li>
            <a href={`tel:${f.contacts.phone.replace(/[^+\d]/g, "")}`} className="text-[0.95rem] text-white/90 transition-colors hover:text-white">
              {f.contacts.phone}
            </a>
          </li>
          <li>
            <a href={`mailto:${f.contacts.email}`} className="text-[0.95rem] text-white/90 transition-colors hover:text-white">
              {f.contacts.email}
            </a>
          </li>
          <li>
            <a href={`https://${f.contacts.site}`} target="_blank" rel="noreferrer noopener" className="text-[0.95rem] text-white/90 transition-colors hover:text-white">
              {f.contacts.site}
            </a>
          </li>
        </FooterColumn>
      </div>

      <div className="shell flex flex-col gap-4 pb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <p className="text-sm leading-relaxed text-white/90">
          {f.copyright}
          <br />
          {f.rights}
        </p>
        <div className="flex flex-wrap gap-x-10 gap-y-2 text-sm text-white/90">
          <Link href={`/${locale}/contact`} className="transition-colors hover:text-white">
            {f.privacy}
          </Link>
          <Link href={`/${locale}/contact`} className="transition-colors hover:text-white">
            {f.terms}
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="lg:border-l lg:border-white/25 lg:pl-8">
      <h3 className="text-sm font-bold tracking-wide text-white">{title}</h3>
      <ul className="mt-5 space-y-3.5">{children}</ul>
    </div>
  );
}
