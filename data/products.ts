export type ProductSlug = "detox" | "igneus" | "endomarine" | "vitamind3" | "omega369" | "collagen";

export interface Product {
  slug: ProductSlug;
  color: string;
  gradient: string;
  icon: string;
  badge?: "hit" | "worldHit" | "exclusive";
}

export const products: Product[] = [
  {
    slug: "detox",
    color: "#4CAF50",
    gradient: "from-emerald-400 to-teal-600",
    icon: "🌿",
    badge: "hit",
  },
  {
    slug: "igneus",
    color: "#FF5722",
    gradient: "from-orange-400 to-red-600",
    icon: "🔥",
    badge: "hit",
  },
  {
    slug: "endomarine",
    color: "#2196F3",
    gradient: "from-blue-400 to-cyan-600",
    icon: "🌊",
    badge: "exclusive",
  },
  {
    slug: "vitamind3",
    color: "#FFC107",
    gradient: "from-amber-300 to-yellow-500",
    icon: "☀️",
  },
  {
    slug: "omega369",
    color: "#E91E63",
    gradient: "from-rose-400 to-pink-600",
    icon: "❤️",
    badge: "worldHit",
  },
  {
    slug: "collagen",
    color: "#9C27B0",
    gradient: "from-purple-400 to-fuchsia-600",
    icon: "💎",
  },
];

export const getProduct = (slug: ProductSlug) =>
  products.find((p) => p.slug === slug);
