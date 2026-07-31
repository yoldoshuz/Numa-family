import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CERTIFICATE_MARKS } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/getDictionary";

export function Certificates({ dict }: { dict: Dictionary }) {
  const t = dict.certificates;

  return (
    <section id="certificates" className="bg-white pb-14 sm:pb-16 lg:pb-20">
      <div className="shell">
        <AnimatedSection>
          <h2 className="text-center text-[1.5rem] font-extrabold text-ink uppercase sm:text-[1.9rem] lg:text-[2.1rem]">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-[0.95rem] leading-[1.7] text-body sm:text-base">
            {t.description}
          </p>
        </AnimatedSection>

        <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-5 lg:gap-6">
          {t.items.map((cert, i) => {
            const Mark = CERTIFICATE_MARKS[cert.id];
            return (
              <AnimatedSection key={cert.id} delay={i * 0.06} className="h-full">
                <li className="flex h-full flex-col items-center rounded-card-lg border border-hairline bg-paper px-5 py-7 text-center lift">
                  {Mark && <Mark className="h-20 w-20" />}
                  <h3 className="mt-5 text-[0.95rem] font-extrabold tracking-wide text-ink">
                    {cert.name}
                  </h3>
                  <p className="mt-2 text-[0.82rem] leading-snug text-body">{cert.subtitle}</p>
                  <p className="mt-4 text-[0.72rem] leading-[1.7] text-ash">{cert.text}</p>
                </li>
              </AnimatedSection>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
