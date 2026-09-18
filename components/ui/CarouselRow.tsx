"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

interface Props {
  children: React.ReactNode;
  prevLabel: string;
  nextLabel: string;
  /** Extra classes for the scrolling track. */
  trackClassName?: string;
  className?: string;
}

/**
 * Horizontal snap scroller with the round outline arrows used by the video
 * and review rows. Arrows disable themselves at either end.
 */
export function CarouselRow({ children, prevLabel, nextLabel, trackClassName, className }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  const scrollBy = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      {/*
        `overflow-x: auto` is what makes this a scroller, and CSS will not let
        one axis scroll while the other stays visible — the moment one is not
        `visible`, the other computes to `auto` too. So the track clips its
        children vertically whether it wants to or not, and it was clipping the
        one thing that reaches past them: the review row's featured card, lifted
        out of the line by `-my-4`, lost its top edge and the card shadows were
        sliced off flush with the box.

        The room is bought with padding and handed straight back as negative
        margin, so the children sit exactly where they did before while the
        scrollport now extends past them. 40px is what the deepest shadow here
        needs: `--shadow-card-hover` sits 18px down with a 44px blur, so it
        reaches 40px below the card that casts it, and 22px to either side.
        Callers overriding `pb-*` have to keep the `-my-10` in mind — what they
        set is 40px more than the gap they actually want.

        `scroll-px-6` is what makes the horizontal half of that hold. A snap
        container aligns `snap-align: start` children to the snapport, and the
        snapport is the padding box unless scroll-padding says otherwise — so
        the moment the row had anything to scroll, it parked the first card
        flush against the padding edge, scrolled the 24px of shadow room out of
        sight and sliced the card's left shadow off. Insetting the snapport by
        the same 24px makes the resting position keep that room on screen.

        `lg:mx-8` rather than the `lg:mx-14` this used to carry: 32px of margin
        plus 24px of padding is the same 56px inset as before, and holding the
        padding constant across the breakpoint keeps the content box — which is
        what the cards' `calc((100% - 2.5rem) / 3)` divides — exactly the width
        it has always been.
      */}
      <div
        ref={trackRef}
        onScroll={sync}
        className={cn("snap-row gap-5 -mx-6 -my-10 px-6 py-10 scroll-px-6 lg:mx-8", trackClassName)}
      >
        {children}
      </div>

      <ArrowButton
        label={prevLabel}
        onClick={() => scrollBy(-1)}
        disabled={atStart}
        className="left-0"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </ArrowButton>
      <ArrowButton
        label={nextLabel}
        onClick={() => scrollBy(1)}
        disabled={atEnd}
        className="right-0"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </ArrowButton>
    </div>
  );
}

function ArrowButton({
  label,
  onClick,
  disabled,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "absolute top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand/50 bg-white text-brand transition-all hover:bg-mist disabled:opacity-30 lg:flex",
        className
      )}
    >
      {children}
    </button>
  );
}
