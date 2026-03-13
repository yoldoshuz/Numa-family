"use client";

import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
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
    <div className="relative w-full aspect-square rounded-[1.5rem] bg-[#eaf5f4] animate-pulse" />
  ),
});

const FEATURED_CARDS = (locale: Locale, dict: Dictionary) => [
  {
    id: "weight",
    title: locale === "ru" ? "Снизьте вес" : locale === "uz" ? "Vazn yo'qoting" : "Lose weight",
    sub: locale === "ru" ? "вашим способом" : locale === "uz" ? "o'zingizcha" : "your way",
    badge: locale === "ru" ? "от 2999 сум/мес" : locale === "uz" ? "2999 so'mdan/oy" : "from $69/mo",
    bg: "#1a5c55",
    href: `/${locale}/products/detox`,
    emoji: "🌿",
  },
  {
    id: "omega",
    title: locale === "ru" ? "Узнайте сколько" : locale === "uz" ? "Qancha" : "See how much",
    sub: locale === "ru" ? "вы можете улучшить" : locale === "uz" ? "yaxshilaysiz" : "you can improve",
    badge: "Omega 3·6·9",
    bg: "#2d6a64",
    href: `/${locale}/products/omega369`,
    emoji: "❤️",
  },
];

const MINI_CARDS = (locale: Locale, dict: Dictionary) => [
  {
    id: "hair",
    label: locale === "ru" ? "Детокс печени" : locale === "uz" ? "Jigar detoksi" : "Liver detox",
    sub: "Detox",
    href: `/${locale}/products/detox`,
    emoji: "🌿",
    emojiColor: "#4CAF50",
  },
  {
    id: "meno",
    label: locale === "ru" ? "Эндо Марин" : locale === "uz" ? "Endo Marine" : "Endo Marine",
    sub: locale === "ru" ? "щитовидная" : locale === "uz" ? "qalqonsimon" : "thyroid",
    href: `/${locale}/products/endomarine`,
    emoji: "🌊",
    emojiColor: "#2196F3",
    accent: "#2196F3",
  },
  {
    id: "health",
    label: locale === "ru" ? "Проверь здоровье" : locale === "uz" ? "Sog'liqni tekshiring" : "Get a health check",
    sub: dict.nav.consultation,
    href: "#consultation",
    emoji: "🩺",
    emojiColor: "#1a5c55",
  },
  {
    id: "start",
    label: locale === "ru" ? "Не знаете с чего начать?" : locale === "uz" ? "Qayerdan boshlashni bilmaysizmi?" : "Unsure where to begin?",
    sub: locale === "ru" ? "Начните здесь" : locale === "uz" ? "Bu yerdan boshlang" : "Start here",
    href: `/${locale}/products`,
    bg: "#1a5c55",
    isLight: false,
  },
];

export function Hero({ dict, locale }: HeroProps) {
  const featCards = FEATURED_CARDS(locale, dict);
  const miniCards = MINI_CARDS(locale, dict);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-white">
      {/* 3D background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#1a5c55]/8 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-[#2d6a64]/6 blur-[80px]" />
      </div>

      <Container size="xl" className="relative z-10 flex flex-col justify-center min-h-screen pt-24 pb-16 sm:pt-28 sm:pb-20">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 sm:mb-10"
        >
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-[#1a1a18] leading-[1.08] max-w-2xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {dict.hero.title}
            <br />
            <span className="text-[#1a5c55]">{dict.hero.subtitle}</span>
          </h1>
        </motion.div>

        {/* Card grid — forhers layout */}
        <div className="flex flex-col gap-3 w-full max-w-5xl">
          {/* Top row: 2 big cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              >
                <Link href={card.href}>
                  <div
                    className="relative rounded-[1.5rem] overflow-hidden cursor-pointer group h-44 sm:h-48 flex flex-col justify-between p-5 sm:p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
                    style={{ backgroundColor: card.bg }}
                  >
                    <div>
                      <p className="text-white/70 text-sm font-medium">{card.title}</p>
                      <p className="text-white text-xl sm:text-2xl font-bold mt-0.5 tracking-tight">{card.sub}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                        {card.badge}
                      </span>
                      <svg className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    {/* Emoji decoration */}
                    <div className="absolute top-1/2 right-6 -translate-y-1/2 text-5xl sm:text-6xl opacity-70 group-hover:scale-110 transition-transform duration-300 select-none">
                      {card.emoji}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Bottom row: 4 mini cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {miniCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
              >
                <Link href={card.href}>
                  <div
                    className={`relative rounded-[1.25rem] overflow-hidden cursor-pointer group h-20 sm:h-24 flex items-center justify-between px-4 sm:px-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${card.bg ? "" : "bg-[#f7f6f3] border border-[#e8e6e1]"
                      }`}
                    style={card.bg ? { backgroundColor: card.bg } : {}}
                  >
                    <div className="pr-2">
                      <p className={`text-sm font-semibold leading-tight ${card.bg ? "text-white" : "text-[#1a1a18]"}`}>
                        {card.label}
                      </p>
                      {card.sub && (
                        <p className={`text-xs mt-0.5 ${card.bg ? "text-white/70" : "text-[#6b6b65]"}`}>
                          {card.sub}
                        </p>
                      )}
                    </div>
                    {card.emoji && (
                      <div
                        className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-lg"
                        style={{ backgroundColor: card.emojiColor ? `${card.emojiColor}20` : undefined }}
                      >
                        {card.emoji}
                      </div>
                    )}
                    {!card.emoji && (
                      <div className="w-7 h-7 flex-shrink-0 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-10 flex items-center gap-8 sm:gap-12"
        >
          {[
            { value: "6+", label: locale === "ru" ? "Продуктов" : locale === "uz" ? "Mahsulotlar" : "Products" },
            { value: "100%", label: locale === "ru" ? "Натуральный" : locale === "uz" ? "Tabiiy" : "Natural" },
            { value: "50K+", label: locale === "ru" ? "Клиентов" : locale === "uz" ? "Mijozlar" : "Clients" },
          ].map((stat) => (
            <div key={stat.value} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#1a5c55] tracking-tight">{stat.value}</div>
              <div className="text-xs sm:text-sm text-[#9b9b93] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </Container>

      {/* Marquee */}
      <div className="border-t border-[#e8e6e1] overflow-hidden py-3 bg-white">
        <div className="marquee flex whitespace-nowrap">
          {[...Array(16)].map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center mx-5 text-xs font-semibold text-[#9b9b93] tracking-[0.15em] uppercase"
            >
              NUMA NUTRITION
              <span className="mx-5 text-[#1a5c55]/30">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}