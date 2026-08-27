import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CERTIFICATE_MARKS, DocumentIcon } from "@/components/ui/icons";
import { ISO_22000_CERTIFICATE } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n/getDictionary";

/** The only mark we hold the document for — see `ISO_22000_CERTIFICATE`. */
const DOCUMENTED_ID = "iso";

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
            /*
             * Only the mark we hold the PDF for is clickable. The card keeps
             * exactly the same height either way — the affordance is a 13px
             * glyph beside the name, not another line — so one card gaining a
             * link does not stretch the other four to match it.
             */
            const documented = cert.id === DOCUMENTED_ID;
            const Card = documented ? "a" : "div";
            return (
              // The `<li>` is the list item and the animation wrapper sits
              // inside it: `AnimatedSection` renders a `div`, and a `div`
              // between `ul` and `li` is not markup a list is allowed to have.
              <li key={cert.id} className="h-full">
                <AnimatedSection delay={i * 0.06} className="h-full">
                  <Card
                    {...(documented
                      ? {
                          href: ISO_22000_CERTIFICATE,
                          target: "_blank",
                          rel: "noreferrer noopener",
                        }
                      : {})}
                    className="flex h-full flex-col items-center rounded-card-lg border border-hairline bg-paper px-5 py-7 text-center lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {Mark && <Mark className="h-20 w-20" />}
                    <h3 className="mt-5 flex items-center gap-1.5 text-[0.95rem] font-extrabold tracking-wide text-ink">
                      {cert.name}
                      {documented && (
                        <>
                          <DocumentIcon className="h-3.5 w-3.5 shrink-0 text-brand" />
                          {/*
                            The footer names this document already; reusing its
                            label keeps one string for one PDF instead of two
                            translations that can drift apart.
                          */}
                          <span className="sr-only">{dict.footer.certificate}</span>
                        </>
                      )}
                    </h3>
                    <p className="mt-2 text-[0.82rem] leading-snug text-body">{cert.subtitle}</p>
                    <p className="mt-4 text-[0.72rem] leading-[1.7] text-ash">{cert.text}</p>
                  </Card>
                </AnimatedSection>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
