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
 * The tester's round found dead handles on every site — an Instagram account
 * that was never registered and a Telegram username that resolves to nothing —
 * so these live in a single constant per site rather than being retyped into
 * each footer, contact card and share row. `@Numa_uz_admin` is the group's
 * shared admin: the same account answers for Family, Nutrition, Kids and
 * Nabaviy Tabobat, which is why it is identical in all four repos.
 */
export const CONTACTS = {
  phone: "+998 55 513 33 33",
  phoneHref: "tel:+998555133333",
  email: "numafamilyuz@gmail.com",
  emailHref: "mailto:numafamilyuz@gmail.com",
  instagram: "@numa.uz",
  instagramHref: "https://www.instagram.com/numa.uz",
  telegram: "@Numa_uz_admin",
  telegramHref: "https://t.me/Numa_uz_admin",
  site: "www.numafamily.uz",
  siteHref: "https://numafamily.uz",
} as const;
