"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DragScroll } from "@/components/ui/DragScroll";
import { ProductCard } from "@/components/sections/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

// Single, lazily-loaded 3D bottle for the hero only. (Per-card 3D was removed —
// one <Canvas> per product card spawned a WebGL context each and froze the page.)
const BottleScene = dynamic(
  () => import("@/components/3d/BottleModel").then((m) => m.BottleScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-white/10 animate-pulse" />
      </div>
    ),
  }
);

interface Props {
  dict: Dictionary;
  locale: Locale;
}

const HERO_BOTTLE = "/3d/nutrition/Bonny.glb";

export function NaturalSupport({ dict, locale }: Props) {
  const { data: products, isLoading } = useProducts();
  const items = (products ?? []).slice(0, 10);

  return (
    <section className="py-4 md:py-6 bg-white overflow-hidden">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden bg-linear-to-br from-teal-700 via-teal-800 to-teal-950"
        >
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-teal-400/20 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-40 -right-32 w-[560px] h-[560px] rounded-full bg-teal-950/40 blur-[120px]" />

          {/* ── Intro: title + centered rotating 3D + discount + CTA ─── */}
          <div className="relative z-10 py-14 md:py-20 lg:py-24 px-5 sm:px-10 flex flex-col items-center text-center">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white/85">
              {dict.naturalSupport.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.05] tracking-tight max-w-4xl">
              {dict.naturalSupport.heading}{" "}
              <span className="text-teal-50 italic font-light">
                {dict.naturalSupport.headingAccent}
              </span>
            </h2>

            {/* Single slowly-rotating 3D bottle (the only WebGL canvas on the page) */}
            <div className="relative w-full max-w-lg h-80 sm:h-96 md:h-[28rem] my-10 sm:my-14">
              <BottleScene
                src={HERO_BOTTLE}
                className="absolute inset-0"
                rotate
              />
            </div>

            <p className="text-lg sm:text-xl md:text-2xl font-medium text-white max-w-xl leading-snug">
              {dict.naturalSupport.discount}
            </p>

            <Button
              asChild
              className="mt-6 rounded-full bg-white text-teal-900 hover:bg-white/95 px-8 h-12 text-sm sm:text-base font-semibold shadow-xl"
            >
              <Link href={`/${locale}/products`}>
                {dict.naturalSupport.startedCta}
              </Link>
            </Button>
          </div>

          {/* ── Products header row ───────────────────────── */}
          <div className="relative z-10 px-3 sm:px-10 flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6">
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-tight tracking-tight">
                {dict.naturalSupport.ourProducts}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-white/70 max-w-lg">
                {dict.naturalSupport.ourProductsDescription}
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="self-start sm:self-end rounded-full border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white hover:border-white/60 backdrop-blur-sm px-6 h-11 text-sm font-semibold"
            >
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center gap-1.5"
              >
                {dict.naturalSupport.allProducts}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* ── Horizontal drag-scroll product cards (backend-driven) ─ */}
          <div className="relative z-10 mt-6 pb-14 md:pb-20">
            <DragScroll className="gap-3 sm:gap-4 px-2 sm:px-10 overflow-y-hidden">
              {isLoading && items.length === 0
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="shrink-0 w-[250px] sm:w-[280px] md:w-[300px] snap-start h-80 rounded-3xl bg-white/10 border border-white/15 animate-pulse"
                    />
                  ))
                : items.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ delay: i * 0.05, duration: 0.35 }}
                      className="shrink-0 w-[250px] sm:w-[280px] md:w-[300px] snap-start"
                    >
                      <ProductCard
                        product={product}
                        locale={locale}
                        variant="dark"
                        className="h-full"
                      />
                    </motion.div>
                  ))}
            </DragScroll>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
