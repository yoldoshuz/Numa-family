"use client";

import { useConsultation } from "@/components/consultation/ConsultationProvider";
import type { Dictionary } from "@/lib/i18n/getDictionary";

/**
 * Full-bleed teal mosaic band that closes every page, right above the footer.
 */
export function CtaBand({ dict }: { dict: Dictionary }) {
  const { open } = useConsultation();

  return (
    <section className="cta-mosaic">
      <div className="shell flex flex-col items-center justify-between gap-4 py-7 sm:flex-row sm:gap-8 sm:py-6">
        <p className="text-center text-base font-bold text-white sm:text-left sm:text-lg">
          {dict.ctaBand.title}
        </p>
        <button
          type="button"
          onClick={() => open("cta-band")}
          className="h-13 w-full max-w-sm rounded-full bg-white px-10 text-[0.95rem] font-bold text-ink shadow-[0_6px_20px_rgba(8,40,48,0.18)] transition-transform hover:-translate-y-0.5 sm:w-auto"
        >
          {dict.ctaBand.button}
        </button>
      </div>
    </section>
  );
}
