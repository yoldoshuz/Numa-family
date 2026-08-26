/**
 * The four NUMA properties, surfaced from the logo dropdown.
 *
 * Every site carries the whole list including itself, so the menu reads the
 * same everywhere and a visitor can always see where they currently are. The
 * logos live in each site's own `public/brands/` — copied rather than
 * hot-linked, so a neighbour being down never leaves a hole in this menu.
 *
 * These are the deploy URLs, not the brand domains: numafamily.uz,
 * numanutrition.uz and nabaviytabobat.uz do not resolve yet, and a dropdown of
 * dead links is worse than no dropdown. Swap them the day DNS is cut over.
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
] as const;


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
 * Every handle below was opened and checked, because all three of the ones
 * that shipped went somewhere wrong:
 *
 * - `t.me/numa_uz` — with the underscore — is a stranger's channel titled "E".
 *   The brand's channel is `t.me/numauz`, titled "Numa.uz", and it is the one
 *   the company's own site links to.
 * - `instagram.com/numa.uz` is NUMA Nutrition's account. This is the Family
 *   site, so it links to Family's own account, `@numa_family`.
 * - `numafamily.uz` does not resolve — the domain has never been cut over. The
 *   group's live site is `numa.uz`, so that is what the "our website" icon and
 *   the footer's site line point at until the brand domain exists.
 */
export const CONTACTS = {
  phone: "+998 55 513 33 33",
  phoneHref: "tel:+998555133333",
  email: "numafamilyuz@gmail.com",
  emailHref: "mailto:numafamilyuz@gmail.com",
  /** NUMA FAMILY's own account — not `numa.uz`, which is Nutrition's. */
  instagram: "@numa_family",
  instagramHref: "https://www.instagram.com/numa_family",
  /** Public channel — footers, contact lists, `sameAs`. No underscore. */
  telegram: "@numauz",
  telegramHref: "https://t.me/numauz",
  /** A live administrator — only behind a "write to us" button. */
  telegramAdmin: "@Numa_uz_admin",
  telegramAdminHref: "https://t.me/Numa_uz_admin",
  facebookHref: "https://www.facebook.com/numauzb",
  youtubeHref: "https://www.youtube.com/@NUMAUZ",
  site: "numa.uz",
  siteHref: "https://numa.uz",
} as const;
