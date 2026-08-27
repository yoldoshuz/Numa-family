import Image from "next/image";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import type { Dictionary } from "@/lib/i18n/getDictionary";

type Step = Dictionary["mission"]["steps"][number];

export function Mission({ dict }: { dict: Dictionary }) {
  const t = dict.mission;

  return (
    <section className="relative overflow-hidden bg-white pb-14 sm:pb-16 lg:pb-20">
      {/* SVG skips the optimizer: it 400s without `dangerouslyAllowSVG`, which stays off. */}
      <Image
        src="/decor/network-soft.svg"
        alt=""
        width={520}
        height={620}
        aria-hidden
        unoptimized
        className="pointer-events-none absolute top-24 -left-28 hidden w-72 opacity-45 lg:block"
      />

      <div className="shell relative">
        <AnimatedSection>
          <h2 className="text-center text-[1.4rem] font-extrabold text-ink sm:text-[1.7rem] lg:text-[1.85rem]">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-[0.95rem] leading-[1.7] text-body sm:text-base">
            {t.description}
          </p>
        </AnimatedSection>

        <div className="relative mt-10 lg:mt-14">
          {/* Dashed spine the numbered nodes sit on. */}
          <span
            aria-hidden
            className="absolute inset-y-0 left-1/2 hidden w-0 -translate-x-1/2 border-l border-dashed border-brand-node/70 lg:block"
          />

          <ol className="space-y-6 lg:space-y-4">
            {t.steps.map((step, index) => {
              const onRight = index % 2 === 0;
              return (
                <li key={step.title} className="relative lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-24">
                  <span
                    aria-hidden
                    className="absolute top-1/2 left-1/2 z-20 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-node text-base font-bold text-white lg:flex"
                  >
                    {index + 1}
                  </span>
                  {/* Dashed stub joining the node to the card. */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-1/2 z-10 hidden h-0 w-8 border-t border-dashed border-brand-node/70 lg:block",
                      onRight ? "left-1/2 ml-5" : "right-1/2 mr-5"
                    )}
                  />

                  <AnimatedSection
                    animation={onRight ? "slideRight" : "slideLeft"}
                    className={onRight ? "lg:col-start-2" : "lg:col-start-1 lg:row-start-1"}
                  >
                    <MissionCard step={step} imageOnRight={onRight} />
                  </AnimatedSection>
                </li>
              );
            })}
          </ol>
        </div>

        <AnimatedSection delay={0.1}>
          <p className="mt-12 text-center text-[0.95rem] text-body sm:text-base lg:mt-16">
            <span className="font-bold text-ink">{t.quotePrefix}</span>
            {t.quoteRest}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

function MissionCard({ step, imageOnRight }: { step: Step; imageOnRight: boolean }) {
  return (
    <article className="relative min-h-[12.5rem] overflow-visible rounded-card-lg bg-white shadow-(--shadow-card)">
      {/* Speech-bubble tab pointing back at the numbered node. */}
      <span
        aria-hidden
        className={cn(
          "absolute top-8 hidden h-14 w-3.5 bg-white lg:block",
          imageOnRight ? "-left-3" : "-right-3"
        )}
        style={{
          clipPath: imageOnRight
            ? "polygon(100% 0%, 0% 50%, 100% 100%)"
            : "polygon(0% 0%, 100% 50%, 0% 100%)",
        }}
      />

      <div className="relative overflow-hidden rounded-card-lg">
        {/* Photo half, faded into the card with a gradient mask. */}
        <div
          className={cn(
            "absolute inset-y-0 w-[55%] sm:w-[48%]",
            imageOnRight ? "right-0" : "left-0"
          )}
          style={{
            maskImage: `linear-gradient(to ${imageOnRight ? "right" : "left"}, transparent 0%, #000 42%)`,
            WebkitMaskImage: `linear-gradient(to ${imageOnRight ? "right" : "left"}, transparent 0%, #000 42%)`,
          }}
        >
          <Image
            src={step.image}
            alt=""
            fill
            sizes="(max-width: 1024px) 50vw, 260px"
            className="object-cover"
          />
        </div>

        <div
          className={cn(
            "relative flex min-h-[12.5rem] flex-col justify-center gap-2.5 px-6 py-6 sm:px-7",
            imageOnRight ? "pr-[46%] sm:pr-[44%]" : "pl-[46%] text-right sm:pl-[44%]"
          )}
        >
          <h3 className="text-lg font-extrabold text-ink sm:text-xl">{step.title}</h3>
          <p className="text-[0.85rem] leading-[1.75] text-body sm:text-[0.9rem]">{step.text}</p>
        </div>
      </div>
    </article>
  );
}
