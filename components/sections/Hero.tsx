"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useConsultation } from "@/components/consultation/ConsultationProvider";
import type { Dictionary } from "@/lib/i18n/getDictionary";

/**
 * The photo's own wall tone, sampled off its left edge.
 *
 * The shot is a cool near-white office wall; the section was a flat
 * `--color-haze` (#fafbfa). Two tones that close read as one surface right up
 * until they touch, and then the vertical crop line is the only edge on the
 * screen. The section settles onto the photo's own tone before the image takes
 * over, so the join has nothing to announce itself with — no veil over the
 * photograph, just a background that already matches it.
 */
const HERO_WALL = "#e4ebe8";

/**
 * The photograph as it was taken.
 *
 * This replaces `numa-family-hero-photo.png`, which was the same frame run
 * through an upscaler and widened from 4:3 to 2.11:1 — the extra width was
 * invented, the greens came back oversaturated and both faces came back
 * smoothed. The shop's note was "rasmni tabiiylashtirish kerak", make the
 * picture natural, and the natural picture is this one: the original 1280×906
 * frame, untouched.
 *
 * The 4:3 shape is why the panel below is sized the way it is. Both men have
 * to stay in frame — one stands at the left third, the other at the right edge
 * — so the crop can only ever be vertical, never horizontal.
 */
const HERO_PHOTO = "/img/numa-family-hero-image.jpg";

export function Hero({ dict }: { dict: Dictionary }) {
  const t = dict.hero;
  const { open } = useConsultation();

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(90deg, #fafbfa 0%, #fafbfa 30%, #f1f6f5 42%, ${HERO_WALL} 50%, ${HERO_WALL} 100%)`,
      }}
    >
      <div className="shell relative z-10 grid items-center gap-0 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="order-2 py-10 lg:order-1 lg:py-24 lg:pr-16"
        >
          <h1 className="text-[1.85rem] leading-[1.35] font-extrabold text-ink sm:text-[2.25rem] lg:text-[2.55rem]">
            {t.titleLine1}
            <br />
            {t.titleLine2}
            <br />
            <span className="text-brand">{t.titleAccent}</span>
          </h1>

          <p className="mt-6 max-w-lg text-[0.9rem] leading-[1.75] text-body sm:text-[0.95rem]">
            {t.description}
          </p>

          <button
            type="button"
            onClick={() => open()}
            className="mt-8 inline-flex h-13 items-center rounded-lg bg-sea px-7 text-[0.95rem] font-medium text-white transition-colors hover:bg-sea-dark"
          >
            {t.cta}
          </button>
        </motion.div>

        {/*
          Mobile / tablet: the photo sits above the copy.

          Deeper than the 224px it used to be. The old file was 2.11:1, so a
          shallow band was close to its own shape; this frame is 4:3, and the
          same band cropped it to a strip across the men's chests.
        */}
        <div className="relative order-1 -mx-5 h-64 sm:-mx-6 sm:h-88 lg:hidden">
          <Image
            src={HERO_PHOTO}
            alt={t.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/*
        Desktop: the photo bleeds off the right edge of the viewport.
        `w-[52%]` rather than the old 54: the headline's longest line runs to
        roughly 46% of a 1440, and the copy column paints above this panel, so
        anything wider puts live text on top of a dark suit.

        That 52% against the height the copy column sets is very close to the
        photograph's own 4:3 — around 1.4:1 at desktop widths — so `cover`
        trims a few per cent off the top and bottom and nothing off the sides,
        which is the crop this frame can afford.
      */}
      <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block">
        <Image
          src={HERO_PHOTO}
          alt={t.imageAlt}
          fill
          priority
          sizes="52vw"
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}
