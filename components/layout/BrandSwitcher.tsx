"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { SIBLING_SITES } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";
import type { Locale } from "@/lib/i18n/config";

interface BrandSwitcherProps {
  locale: Locale;
  /** `dict.nav.otherBrands` — the trigger's accessible name. */
  label: string;
}

/**
 * The logo doubles as an entry point to the rest of the NUMA group.
 *
 * Ported from Numa Kids, where the pattern already shipped, and re-skinned in
 * this site's accent — the sea green rather than pink — so the group's sites
 * behave identically without any of them looking borrowed.
 */
export function BrandSwitcher({ locale, label }: BrandSwitcherProps) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // A short close delay keeps the menu open while the pointer crosses the gap
  // between the trigger and the panel.
  function schedule(next: boolean) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(next), next ? 0 : 150);
  }

  return (
    <div
      ref={wrapper}
      className="relative shrink-0"
      onMouseEnter={() => schedule(true)}
      onMouseLeave={() => schedule(false)}
    >
      <div className="flex items-center gap-1">
        <Link href={`/${locale}`} aria-label="NUMA Family">
          <Image
            src="/logo.png"
            alt="NUMA Family"
            width={1489}
            height={423}
            priority
            className="h-9 w-auto lg:h-12"
          />
        </Link>
        <button
          type="button"
          aria-label={label}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid size-7 place-items-center rounded-full text-body transition hover:bg-mist hover:text-sea focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea"
        >
          <Chevron className={cn("size-4 transition-transform", open && "rotate-90")} />
        </button>
      </div>

      {open && (
        <div
          className="absolute top-full left-0 z-50 mt-3 w-72 rounded-2xl bg-sea p-3 shadow-xl"
          role="menu"
        >
          {SIBLING_SITES.map((site) => (
            <a
              key={site.id}
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-white/20"
            >
              <span className="size-9 shrink-0 rounded-lg bg-gradient-to-br from-white/70 to-white/25 ring-1 ring-white/50" />
              <span className="flex-1 text-sm font-bold tracking-wide text-white">
                {site.label}
              </span>
              <Chevron className="size-4 text-white/80" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
