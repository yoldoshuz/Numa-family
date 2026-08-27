"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CarouselRow } from "@/components/ui/CarouselRow";
import { StarIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { ReviewCard } from "@/lib/api/reviews";

/**
 * Customer reviews.
 *
 * `cards` is what the CMS published, already in the reader's language; when it
 * is absent the copy bundled in the dictionary renders instead.
 */
export function Reviews({ dict, cards }: { dict: Dictionary; cards?: ReviewCard[] | null }) {
  const t = dict.reviews;
  const items = cards ?? t.items;
  // The Figma lifts the middle card out of the row as the "featured" quote.
  const featured = Math.floor(items.length / 2);

  return (
    <section id="reviews" className="relative overflow-hidden bg-white pb-14 sm:pb-16 lg:pb-20">
      {/* SVG skips the optimizer: it 400s without `dangerouslyAllowSVG`, which stays off. */}
      <Image
        src="/decor/network-soft.svg"
        alt=""
        width={520}
        height={620}
        aria-hidden
        unoptimized
        className="pointer-events-none absolute -top-16 -right-24 hidden w-72 opacity-45 lg:block"
      />

      <div className="shell relative">
        <AnimatedSection>
          <h2 className="text-center text-[1.4rem] font-extrabold text-ink sm:text-[1.7rem] lg:text-[1.95rem]">
            {t.title}
          </h2>
          <p className="mt-4 text-center text-[0.95rem] text-body sm:text-base">{t.description}</p>
        </AnimatedSection>

        <AnimatedSection delay={0.05} className="mt-8 lg:mt-11">
          <CarouselRow prevLabel={t.prev} nextLabel={t.next} trackClassName="items-center py-3">
            {items.map((review, i) => {
              const isFeatured = i === featured;
              return (
                <figure
                  key={review.name}
                  className={cn(
                    "flex w-[82vw] max-w-[26rem] shrink-0 flex-col rounded-card-lg border border-hairline bg-white p-5 sm:w-[60vw] lg:w-[calc((100%-2.5rem)/3)]",
                    isFeatured
                      ? "shadow-(--shadow-card-hover) lg:-my-4 lg:py-8"
                      : "shadow-(--shadow-card)"
                  )}
                >
                  <blockquote
                    className={cn(
                      "leading-[1.7]",
                      isFeatured ? "text-[0.95rem] text-brand-soft sm:text-base" : "text-[0.85rem] text-ash"
                    )}
                  >
                    {review.text}
                  </blockquote>

                  <hr className="mt-6 border-t border-brand-node/60" />

                  <figcaption className="mt-4 flex items-center gap-3">
                    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-mist">
                      <Image
                        src={review.avatar}
                        alt=""
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </span>
                    <span>
                      <span className="block text-[0.9rem] font-bold text-ink">{review.name}</span>
                      <span className="mt-0.5 flex gap-0.5" aria-label={`${review.rating}/5`}>
                        {Array.from({ length: review.rating }).map((_, s) => (
                          <StarIcon key={s} className="h-3.5 w-3.5 text-star" />
                        ))}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </CarouselRow>
        </AnimatedSection>
      </div>
    </section>
  );
}
