"use client";

import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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

export function ProductCard({ product, dict, locale, index }: ProductCardProps) {
  const productDict = dict.products.items[product.slug];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <GlassCard className="group relative overflow-hidden h-full flex flex-col">
        {product.badge && (
          <Badge
            variant={product.badge === "hit" ? "success" : product.badge === "worldHit" ? "warning" : "primary"}
            className="absolute top-4 right-4 z-10"
          >
            {product.badge === "hit"
              ? dict.products.hit
              : product.badge === "worldHit"
                ? dict.products.worldHit
                : dict.products.exclusive}
          </Badge>
        )}

        {/* Product visual */}
        <div className="relative h-48 flex items-center justify-center overflow-hidden rounded-xl mb-6">
          <div className={`absolute inset-0 bg-linear-to-br ${product.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
          <motion.div
            className="text-6xl"
            whileHover={{ scale: 1.2, rotateY: 180 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {product.icon}
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-text-primary mb-1">
            {productDict.name}
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            {productDict.shortDesc}
          </p>

          <ul className="space-y-2 mb-6 flex-1">
            {productDict.benefits.slice(0, 3).map((benefit, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="flex gap-2">
            <Link href={`/${locale}/products/${product.slug}`} className="flex-1">
              <Button variant="primary" size="sm" className="w-full">
                {dict.products.details}
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              {dict.products.buy}
            </Button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
