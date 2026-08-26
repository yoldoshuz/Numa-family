"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CarouselRow } from "@/components/ui/CarouselRow";
import { CloseIcon, PlayIcon, YouTubeIcon } from "@/components/ui/icons";
import { CONTACTS } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n/getDictionary";

type VideoItem = Dictionary["videos"]["items"][number];

/**
 * Everything about a card is derived from the YouTube id.
 *
 * The section used to carry four hand-picked studio stills with an empty `url`
 * beside each one: the posters were of people who were not in any of the
 * clips, and clicking a card did nothing at all. Deriving the poster, the
 * player and the "watch on YouTube" link from one id means a card can never
 * again show one video and open another — and never again open nothing.
 *
 * Posters are copied into `public/video/<id>.jpg` rather than hot-linked to
 * `i.ytimg.com`, because `next.config.ts` only trusts the backend as a remote
 * image host and adding Google's CDN to that list for four thumbnails is not a
 * trade worth making.
 */
const poster = (id: string) => `/video/${id}.jpg`;
const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
const embedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

export function Videos({ dict }: { dict: Dictionary }) {
  const t = dict.videos;
  const [playing, setPlaying] = useState<VideoItem | null>(null);

  const close = useCallback(() => setPlaying(null), []);

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
            {t.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPlaying(item)}
                aria-label={`${t.play}: ${item.title}`}
                className="group w-[78vw] max-w-[22rem] shrink-0 cursor-pointer snap-start overflow-hidden rounded-card-lg border border-hairline bg-white text-left lift sm:w-[46vw] lg:w-[calc((100%-2.5rem)/3)]"
              >
                <span className="relative block aspect-video overflow-hidden bg-mist">
                  <Image
                    src={poster(item.id)}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 32vw"
                    quality={90}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-0 bg-ink/10 transition-colors duration-300 group-hover:bg-ink/25" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-brand shadow-(--shadow-float) transition-transform duration-300 group-hover:scale-110">
                      <PlayIcon className="ml-0.5 h-6 w-6" />
                    </span>
                  </span>
                </span>
                <span className="flex min-h-[4.75rem] items-start px-5 py-4">
                  <span className="line-clamp-2 text-[0.9rem] leading-snug font-semibold text-ink transition-colors group-hover:text-brand">
                    {item.title}
                  </span>
                </span>
              </button>
            ))}
          </CarouselRow>
        </AnimatedSection>

        <div className="mt-8 flex justify-center">
          <a
            href={CONTACTS.youtubeHref}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-brand px-6 text-[0.85rem] font-medium text-brand transition-colors hover:bg-mist"
          >
            <YouTubeIcon className="h-5 w-5" />
            {t.channel}
          </a>
        </div>
      </div>

      {playing && <Player item={playing} watchLabel={t.watchOnYouTube} closeLabel={t.close} onClose={close} />}
    </section>
  );
}

function Player({
  item,
  watchLabel,
  closeLabel,
  onClose,
}: {
  item: VideoItem;
  watchLabel: string;
  closeLabel: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl"
        // The backdrop closes the player; the player itself must not.
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-[0.95rem] leading-snug font-semibold text-white">{item.title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 aspect-video w-full overflow-hidden rounded-card-lg bg-black">
          <iframe
            src={embedUrl(item.id)}
            title={item.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        {/* A way out if the embed is blocked — an empty black box is a dead end. */}
        <a
          href={watchUrl(item.id)}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-3 inline-flex items-center gap-2 text-[0.82rem] font-medium text-white/85 transition-colors hover:text-white"
        >
          <YouTubeIcon className="h-4 w-4" />
          {watchLabel}
        </a>
      </div>
    </div>
  );
}
