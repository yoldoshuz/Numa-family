"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import type { Dictionary } from "@/lib/i18n/getDictionary";

export function Faq({ dict }: { dict: Dictionary }) {
  const t = dict.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white pb-14 sm:pb-16 lg:pb-20">
      <div className="shell">
        <AnimatedSection>
          <h2 className="text-center text-[1.4rem] font-extrabold text-ink sm:text-[1.7rem] lg:text-[1.95rem]">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[0.95rem] leading-[1.7] text-body sm:text-base">
            {t.description}
          </p>
        </AnimatedSection>

        <ul className="mx-auto mt-8 max-w-5xl space-y-3.5 lg:mt-11">
          {t.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <AnimatedSection key={item.q} delay={i * 0.05}>
                <li className="rounded-card-lg bg-mist">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span className="flex-1">
                      <span className="block text-[0.88rem] font-bold text-ink sm:text-[0.95rem]">
                        {item.q}
                      </span>
                      <span
                        className={cn(
                          "mt-2 block text-[0.8rem] leading-[1.7] text-body",
                          !isOpen && "line-clamp-2"
                        )}
                      >
                        {item.a}
                      </span>
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className={cn(
                        "mt-1 h-5 w-5 shrink-0 text-brand transition-transform duration-300",
                        isOpen && "rotate-90"
                      )}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9.5 5 7 7-7 7" />
                    </svg>
                  </button>
                </li>
              </AnimatedSection>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
