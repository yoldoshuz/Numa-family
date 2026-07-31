import Image from "next/image";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { Dictionary } from "@/lib/i18n/getDictionary";

export function Achievements({ dict }: { dict: Dictionary }) {
  const t = dict.achievements;

  return (
    <section id="achievements" className="bg-white section-y">
      <div className="shell">
        <AnimatedSection>
          <h2 className="text-center text-[1.5rem] font-extrabold text-ink uppercase sm:text-[1.9rem] lg:text-[2.1rem]">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-[0.95rem] leading-[1.7] text-body sm:text-base">
            {t.description}
          </p>
        </AnimatedSection>

        <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {t.items.map((item, i) => (
            <AnimatedSection key={item.title} delay={(i % 3) * 0.08} className="h-full">
              <li className="flex h-full gap-4 rounded-card-lg border border-hairline bg-paper p-4 lift sm:gap-5 sm:p-5">
                <div className="flex flex-1 flex-col">
                  <h3 className="text-[0.95rem] leading-snug font-extrabold text-sea-accent uppercase sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.78rem] leading-[1.65] text-body">{item.text}</p>
                </div>
                <div className="relative w-[40%] shrink-0 self-stretch overflow-hidden rounded-xl">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 160px"
                    className="object-cover"
                  />
                </div>
              </li>
            </AnimatedSection>
          ))}
        </ul>
      </div>
    </section>
  );
}
