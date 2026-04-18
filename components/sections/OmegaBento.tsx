"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  dict: Dictionary;
  locale: Locale;
}

const bentoClasses = [
  "md:col-span-2 md:row-span-2", // 0 — big
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1", // 5 — wide
];

export function OmegaBento({ dict, locale }: Props) {
  const items = dict.omega.items;
  return (
    <section className="py-4 md:py-6 bg-white overflow-hidden">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden py-10 sm:py-16 md:py-20"
          style={{
            backgroundImage:
              "radial-gradient(120% 90% at 10% 0%, #2a9d8f 0%, #1a7a6d 40%, #0f4a42 100%)",
          }}
        >
          {/* Soft glow */}
          <div className="pointer-events-none absolute top-1/4 right-0 w-[480px] h-[480px] rounded-full bg-teal-200/15 blur-[140px]" />

          {/* Heading */}
          <div className="relative text-center max-w-3xl mx-auto px-3 sm:px-10">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white/85">
              {dict.omega.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.08] tracking-tight">
              {dict.omega.title}{" "}
              <span className="italic font-light text-teal-50">
                {dict.omega.highlight}
              </span>
            </h2>
            <p className="mt-4 text-white/85 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              {dict.omega.description}
            </p>
          </div>

          {/* Bento grid — almost flush with container sides */}
          <div className="relative mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-4 md:auto-rows-[220px] lg:auto-rows-[240px] gap-2 sm:gap-3 px-[2px] sm:px-2">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={`relative rounded-3xl overflow-hidden border border-white/15 group min-h-[240px] ${
                  bentoClasses[i] ?? "md:col-span-1 md:row-span-1"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title.replace("\n", " ")}
                  fill
                  sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 500px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Darkening bottom-to-top gradient so image stays visible top */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                {/* Top-left title */}
                <div className="absolute top-0 left-0 right-0 p-5 sm:p-6 z-10">
                  <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white leading-tight tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] whitespace-pre-line">
                    {item.title}
                  </p>
                </div>

                {/* Bottom-right blur CTA */}
                <Link
                  href={`/${locale}/products`}
                  className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-4 h-10 text-sm font-semibold text-white hover:bg-white/30 transition-colors"
                >
                  {dict.omega.cta}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
