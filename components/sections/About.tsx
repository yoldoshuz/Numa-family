import Image from "next/image";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { LeafIcon, FamilyIcon, SproutIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/getDictionary";

const STAT_ICONS = {
  leaf: LeafIcon,
  users: FamilyIcon,
  handshake: SproutIcon,
} as const;

export function About({ dict }: { dict: Dictionary }) {
  const t = dict.about;

  return (
    <section id="about" className="relative overflow-hidden bg-white section-y">
      {/* Faint molecular mesh bleeding in from both gutters. */}
      <Image
        src="/decor/network-soft.svg"
        alt=""
        width={520}
        height={620}
        aria-hidden
        className="pointer-events-none absolute top-10 -left-24 hidden w-72 opacity-45 lg:block"
      />
      <Image
        src="/decor/network-soft.svg"
        alt=""
        width={520}
        height={620}
        aria-hidden
        className="pointer-events-none absolute -top-6 -right-20 hidden w-64 opacity-45 lg:block"
      />

      <div className="shell relative">
        <AnimatedSection>
          <h2 className="text-center text-[1.5rem] font-extrabold text-ink sm:text-[1.85rem] lg:text-[2rem]">
            {t.title} <span className="text-sea">{t.titleAccent}</span>
          </h2>
        </AnimatedSection>

        <div className="mt-9 grid items-center gap-8 lg:mt-12 lg:grid-cols-2 lg:gap-16">
          <AnimatedSection animation="slideLeft" className="space-y-5 lg:pl-6">
            {t.paragraphs.map((p) => (
              <p key={p} className="text-[0.95rem] leading-[1.8] text-body sm:text-base">
                {p}
              </p>
            ))}
          </AnimatedSection>

          <AnimatedSection animation="slideRight">
            <div className="relative aspect-[16/10] overflow-hidden rounded-card-lg shadow-(--shadow-card)">
              <Image
                src="/img/factory-aerial.png"
                alt={t.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.1}>
          <ul className="mx-auto mt-10 grid max-w-4xl gap-6 rounded-card-lg border border-hairline bg-white px-6 py-6 shadow-(--shadow-card) sm:grid-cols-3 sm:gap-0 lg:mt-14">
            {t.stats.map((stat, i) => {
              const Icon = STAT_ICONS[stat.icon as keyof typeof STAT_ICONS] ?? LeafIcon;
              return (
                <li
                  key={stat.value}
                  className={`flex items-center gap-4 sm:px-5 ${
                    i > 0 ? "sm:border-l sm:border-hairline" : ""
                  }`}
                >
                  <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-brand-deep text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-[0.95rem] font-bold text-ink">{stat.value}</span>
                    <span className="block text-sm whitespace-pre-line text-body">{stat.label}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </AnimatedSection>
      </div>
    </section>
  );
}
