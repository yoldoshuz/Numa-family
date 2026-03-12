"use client";

import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import dynamic from "next/dynamic";

interface HeroProps {
  dict: Dictionary;
  locale: Locale;
}

const Interactive3DScene = dynamic(() => import("@/components/3d/interactive-3d-scene"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full aspect-square bg-linear-to-br from-primary/10 to-primary/5 rounded-2xl animate-pulse" />
  ),
});


export function Hero({ dict, locale }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-150 h-150 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-125 h-125 rounded-full bg-primary/3 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full bg-cream opacity-60 blur-3xl" />
      </div>

      {/* Floating dots decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <Container size="xl" className="relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 py-2 rounded-full glass mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-text-secondary">
                {dict.hero.tagline}
              </span>
            </motion.div>

            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="text-text-primary">{dict.hero.title}</span>
              <br />
              <span className="text-gradient">{dict.hero.subtitle}</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-6 text-base sm:text=lg md:text-xl text-text-secondary max-w-lg leading-relaxed"
            >
              {dict.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-4 flex flex-row flex-wrap gap-2"
            >
              <Link href={`/${locale}/products`}>
                <Button size="md">{dict.hero.cta}</Button>
              </Link>
              <Link href="#consultation">
                <Button variant="outline" size="md">
                  {dict.hero.cta2}
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-8 flex items-center gap-6"
            >
              {[
                { value: "6+", label: locale === "ru" ? "Продуктов" : locale === "uz" ? "Mahsulotlar" : "Products" },
                { value: "100%", label: locale === "ru" ? "Натуральный" : locale === "uz" ? "Tabiiy" : "Natural" },
                { value: "50K+", label: locale === "ru" ? "Клиентов" : locale === "uz" ? "Mijozlar" : "Clients" },
              ].map((stat) => (
                <div key={stat.value} className="text-center">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-text-tertiary">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square">
              <Interactive3DScene />

              {/* Floating product badges */}
              {[
                { label: "Detox", pos: "top-4 right-8", delay: 0 },
                { label: "Omega 3", pos: "top-1/3 -right-4", delay: 0.5 },
                { label: "Collagen", pos: "bottom-1/4 -right-2", delay: 1 },
                { label: "Vitamin D3", pos: "bottom-8 right-12", delay: 1.5 },
                { label: "Igneus", pos: "bottom-1/3 -left-4", delay: 2 },
                { label: "Endo Marine", pos: "top-1/4 -left-2", delay: 2.5 },
              ].map((badge) => (
                <motion.div
                  key={badge.label}
                  className={`absolute ${badge.pos} glass px-3 py-1.5 rounded-full text-xs font-medium text-text-primary`}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: badge.delay,
                  }}
                >
                  {badge.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Marquee */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border overflow-hidden py-4 bg-white/50 backdrop-blur-sm">
        <div className="marquee flex whitespace-nowrap">
          {[...Array(14)].map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center mx-6 text-sm font-semibold text-text-tertiary tracking-widest uppercase"
            >
              NUMA NUTRITION
              <span className="mx-6 text-primary/30">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
