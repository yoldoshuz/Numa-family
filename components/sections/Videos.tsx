"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CarouselRow } from "@/components/ui/CarouselRow";
import { PlayIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/getDictionary";

export function Videos({ dict }: { dict: Dictionary }) {
  const t = dict.videos;

  return (
    <section id="videos" className="bg-white pb-14 sm:pb-16 lg:pb-20">
      <div className="shell">
        <AnimatedSection>
          <h2 className="text-center text-[1.4rem] font-extrabold text-ink sm:text-[1.7rem] lg:text-[1.95rem]">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-4xl text-center text-[0.95rem] leading-[1.7] text-body sm:text-base">
            {t.description}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.05} className="mt-8 lg:mt-11">
          <CarouselRow prevLabel={t.prev} nextLabel={t.next}>
            {t.items.map((item) => {
              const card = (
                <>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 62vw, (max-width: 1024px) 40vw, 24vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  {/*
                    No play badge without somewhere to play. The cards carried
                    one whatever the item held, so a visitor clicked a poster
                    with no `url` behind it and nothing happened — the card has
                    to look like the still image it currently is until the
                    videos are uploaded and the links filled in.
                  */}
                  {item.url ? (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-brand shadow-(--shadow-float) transition-transform duration-300 group-hover:scale-110">
                        <PlayIcon className="ml-0.5 h-6 w-6" />
                      </span>
                    </span>
                  ) : null}
                  <span className="sr-only">{item.title}</span>
                </>
              );

              const classes =
                "group relative aspect-[5/9] w-[62vw] max-w-[17rem] shrink-0 overflow-hidden rounded-card-lg bg-mist sm:w-[40vw] lg:w-[calc((100%-3.75rem)/4)]";

              return item.url ? (
                <a
                  key={item.title}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={classes}
                >
                  {card}
                </a>
              ) : (
                <div key={item.title} className={classes}>
                  {card}
                </div>
              );
            })}
          </CarouselRow>
        </AnimatedSection>
      </div>
    </section>
  );
}
