/**
 * The rest of the NUMA group, surfaced from the logo dropdown. Every site in
 * the group carries the same list minus itself, so the header is one
 * consistent way in and out of the group.
 *
 * The labels are brand names, identical in every locale, so they live here
 * rather than in the dictionaries.
 */
export const SIBLING_SITES = [
  { id: "nutrition", label: "NUMA NUTRITION", href: "https://numanutrition.uz" },
  { id: "kids", label: "NUMA KIDS", href: "https://numakids.com" },
  { id: "tabobat", label: "NABAVIY TABOBAT", href: "https://nabaviytabobat.uz" },
  { id: "catering", label: "NUMA CATERING", href: "https://numacatering.com" },
] as const;
