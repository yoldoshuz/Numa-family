"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/data/products";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface ProductCardProps {
  product: Product;
  dict: Dictionary;
  locale: Locale;
  index: number;
}

const BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  hit: { bg: "#dcfce7", text: "#166534" },
  worldHit: { bg: "#fef9c3", text: "#854d0e" },
  exclusive: { bg: "#ede9fe", text: "#5b21b6" },
};

export function ProductCard({ product, dict, locale, index }: ProductCardProps) {
  const productDict = dict.products.items[product.slug];
  const badgeStyle = product.badge ? BADGE_STYLES[product.badge] : null;
  const badgeLabel = product.badge === "hit"
    ? dict.products.hit
    : product.badge === "worldHit"
      ? dict.products.worldHit
      : product.badge === "exclusive"
        ? dict.products.exclusive
        : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="h-full"
    >
      <div className="group relative bg-white rounded-[1.5rem] border border-[#e8e6e1] overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] hover:-translate-y-0.5">
        {/* Badge */}
        {badgeLabel && badgeStyle && (
          <span
            className="absolute top-4 left-4 z-10 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }}
          >
            {badgeLabel}
          </span>
        )}

        {/* Visual */}
        <div
          className="relative h-44 sm:h-48 flex items-center justify-center overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${product.color}15, ${product.color}08)` }}
        >
          <motion.div
            className="text-6xl sm:text-7xl select-none"
            whileHover={{ scale: 1.15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {product.icon}
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-5 sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[#1a1a18] tracking-tight mb-1">
              {productDict.name}
            </h3>
            <p className="text-sm text-[#6b6b65]">
              {productDict.shortDesc}
            </p>
          </div>

          <ul className="space-y-2 mb-6 flex-1">
            {productDict.benefits.slice(0, 3).map((benefit, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[#4b4b47]">
                <div
                  className="mt-1 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${product.color}20` }}
                >
                  <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke={product.color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="flex gap-2.5 mt-auto">
            <Link href={`/${locale}/products/${product.slug}`} className="flex-1">
              <button
                className="w-full btn-pill text-sm font-medium transition-all duration-200 py-2.5"
                style={{ backgroundColor: "#1a1a18", color: "white" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2d2d2a")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1a1a18")}
              >
                {dict.products.details}
              </button>
            </Link>
            <button
              className="btn-pill text-sm font-medium border border-[#e8e6e1] text-[#1a1a18] hover:bg-[#f7f6f3] transition-colors duration-200 py-2.5 px-5"
            >
              {dict.products.buy}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}