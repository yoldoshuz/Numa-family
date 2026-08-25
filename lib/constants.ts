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
 */
export const CONTACTS = {
  phone: "+998 55 513 33 33",
  phoneHref: "tel:+998555133333",
  email: "numafamilyuz@gmail.com",
  emailHref: "mailto:numafamilyuz@gmail.com",
  instagram: "@numa.uz",
  instagramHref: "https://www.instagram.com/numa.uz",
  /** Public channel — footers, contact lists, `sameAs`. */
  telegram: "@numa_uz",
  telegramHref: "https://t.me/numa_uz",
  /** A live administrator — only behind a "write to us" button. */
  telegramAdmin: "@Numa_uz_admin",
  telegramAdminHref: "https://t.me/Numa_uz_admin",
  facebookHref: "https://www.facebook.com/share/1EVPsKHEgL/",
  site: "www.numafamily.uz",
  siteHref: "https://numafamily.uz",
} as const;
