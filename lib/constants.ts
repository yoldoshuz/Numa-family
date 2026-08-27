/**
 * The six NUMA properties, surfaced from the logo dropdown.
 *
 * Every site carries the whole list including itself, so the menu reads the
 * same everywhere and a visitor can always see where they currently are. The
 * logos live in each site's own `public/brands/` — copied rather than
 * hot-linked, so a neighbour being down never leaves a hole in this menu.
 *
 * These are the deploy URLs, not the brand domains: numafamily.uz,
 * numanutrition.uz and nabaviytabobat.uz do not resolve yet, and a dropdown of
 * dead links is worse than no dropdown. Swap them the day DNS is cut over.
 *
 * NUMA Diagnostics has no site at all, so its `href` is empty and the menu
 * renders it as an inert "coming soon" row: the group is six brands and the
 * menu should say so, but a row that navigates nowhere — or worse, to a
 * different brand — is the bug this shape avoids.
 *
 * `bettery.svg` and `diagnostics.svg` are stand-in marks, not the brands'
 * artwork. Replace both the day real logos arrive.
 */
export const SIBLING_SITES = [
  {
    id: "nutrition",
    label: "NUMA NUTRITION",
    href: "https://numa-nutritition.vercel.app",
    logo: "/brands/nutrition.png",
  },
  {
    id: "kids",
    label: "NUMA KIDS",
    href: "https://numa-kids-olive.vercel.app/ru",
    logo: "/brands/kids.png",
  },
  {
    id: "family",
    label: "NUMA FAMILY",
    href: "https://numa-family.vercel.app/ru",
    logo: "/brands/family.png",
  },
  {
    id: "tabobat",
    label: "NABAVIY TABOBAT",
    href: "https://nabaviy-tabobat.vercel.app",
    logo: "/brands/tabobat.png",
  },
  {
    id: "bettery",
    label: "BETTERY ORGANIC",
    href: "https://betteryorganic.uz",
    logo: "/brands/bettery.svg",
  },
  {
    id: "diagnostics",
    label: "NUMA DIAGNOSTICS",
    href: "",
    logo: "/brands/diagnostics.svg",
  },
] as const;


/**
 * The one certificate on the site we hold the actual document for, linked from
 * the footer.
 *
 * What the PDF says, so nobody has to open it to find out: certificate
 * № 24-E-1770 Rev. 0, ISO 22000:2018 Food Safety Management System, issued by
 * IGC (register: igcert.org) to **NUTRI MAKON FACTORY LLC** — the factory, not
 * the NUMA brand — for the production of dietary supplements.
 *
 * Issued 15.08.2024, **expires 14.08.2027**. After that date this link starts
 * advertising a lapsed document, so it wants replacing before then.
 *
 * The other four marks in the certificates row have no document at all; only
 * this one is linked anywhere.
 */
export const ISO_22000_CERTIFICATE = "/certificates/iso-22000-2018.pdf";


/**
 * The one place any contact detail is written down.
 *
 * There are two Telegram destinations and they are not interchangeable.
 * `telegram` is the public channel — that is what belongs anywhere the site is
 * simply listing where to find the brand: the footer, the contact card, the
 * structured data. `telegramAdmin` is a person, and it belongs only behind a
 * button that offers to carry on a conversation. Sending a visitor who clicked
 * a footer icon into a private chat with an administrator was the complaint
 * that split these apart.
 *
 * The handles below are the ones the brand supplied on 27.08.2026. Family and
 * Nutrition share a set — one Instagram account and one Telegram channel serve
 * both — while Kids and Nabaviy Tabobat each run their own.
 *
 * Two of them were opened and checked rather than pasted:
 *
 * - `t.me/numa_uz` — with the underscore — is a stranger's channel titled "E",
 *   220 subscribers. The brand's channel is `t.me/numauz`, titled "Numa.uz",
 *   3.7k subscribers, and it prints this same phone number in its bio. The
 *   supplied list has the underscore; it is a typo and we do not follow it.
 * - `numafamily.uz` does not resolve — the domain has never been cut over. The
 *   group's live site is `numa.uz`, so that is what the "our website" icon and
 *   the footer's site line point at until the brand domain exists.
 */
export const CONTACTS = {
  phone: "+998 55 513 33 33",
  phoneHref: "tel:+998555133333",
  email: "numafamilyuz@gmail.com",
  emailHref: "mailto:numafamilyuz@gmail.com",
  /** Shared with NUMA Nutrition — Family has no separate account. */
  instagram: "@numa.uz",
  instagramHref: "https://www.instagram.com/numa.uz",
  /** Public channel — footers, contact lists, `sameAs`. No underscore. */
  telegram: "@numauz",
  telegramHref: "https://t.me/numauz",
  /** A live administrator — only behind a "write to us" button. */
  telegramAdmin: "@Numa_uz_admin",
  telegramAdminHref: "https://t.me/Numa_uz_admin",
  facebookHref: "https://www.facebook.com/share/1EVPsKHEgL/",
  youtubeHref: "https://www.youtube.com/@NUMAUZ",
  site: "numa.uz",
  siteHref: "https://numa.uz",
} as const;
