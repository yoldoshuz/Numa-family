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
      <div
        ref={trackRef}
        onScroll={sync}
        className={cn("snap-row gap-5 pb-2 lg:mx-14", trackClassName)}
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
