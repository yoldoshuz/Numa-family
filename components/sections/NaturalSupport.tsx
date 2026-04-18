"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DragScroll } from "@/components/ui/DragScroll";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

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

const badgeColors: Record<string, string> = {
  new: "bg-emerald-400/90 text-emerald-950",
  best: "bg-amber-300/95 text-amber-950",
  popular: "bg-sky-300/95 text-sky-950",
};

function formatPrice(template: string, price: string): string {
  return template.replace("{price}", price);
}

export function NaturalSupport({ dict, locale }: Props) {
  const heroBottle =
    dict.naturalSupport.products[0]?.model ?? "/3d/nutrition/Bonny.glb";

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

            {/* Centered slowly rotating 3D bottle, full height */}
            <div className="relative w-full max-w-lg h-80 sm:h-96 md:h-[28rem] my-10 sm:my-14">
              <BottleScene
                src={heroBottle}
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

          {/* ── Horizontal drag-scroll product cards ──────── */}
          <div className="relative z-10 mt-6 pb-14 md:pb-20">
            <DragScroll className="gap-3 sm:gap-4 px-2 sm:px-10 overflow-y-hidden">
              {dict.naturalSupport.products.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className="shrink-0 w-[250px] sm:w-[280px] md:w-[300px] snap-start rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/15 flex flex-col relative"
                >
                  {/* Top-left badge */}
                  <span
                    className={`absolute top-3 left-3 z-20 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      badgeColors[p.badge] ?? badgeColors.new
                    }`}
                  >
                    {dict.naturalSupport.badges[
                      p.badge as keyof typeof dict.naturalSupport.badges
                    ] ?? p.badge}
                  </span>

                  <div className="relative h-56 sm:h-60 md:h-64 z-10">
                    <BottleScene src={p.model} className="absolute inset-0" />
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col gap-1 z-10 bg-linear-to-t from-teal-950/60 to-transparent">
                    <p className="text-lg sm:text-xl font-semibold text-white leading-tight">
                      {p.name}{" "}
                      <span className="text-white/70 text-sm font-normal">
                        · {p.tagline}
                      </span>
                    </p>
                    <p className="text-xs sm:text-sm text-white/70 leading-snug">
                      {p.description}
                    </p>
                    <p className="mt-2 text-base sm:text-lg font-semibold text-teal-50">
                      {formatPrice(dict.naturalSupport.priceFrom, p.price)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </DragScroll>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
