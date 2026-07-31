import Image from "next/image";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import type { Dictionary } from "@/lib/i18n/getDictionary";

type Branch = Dictionary["ecosystem"]["left"][number];
type Side = "left" | "right";

export function Ecosystem({ dict }: { dict: Dictionary }) {
  const t = dict.ecosystem;

  return (
    <section className="relative overflow-hidden bg-white pb-14 sm:pb-16 lg:pb-20">
      <Image
        src="/decor/network-soft.svg"
        alt=""
        width={520}
        height={620}
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-28 hidden w-72 opacity-40 lg:block"
      />
      <Image
        src="/decor/network-soft.svg"
        alt=""
        width={520}
        height={620}
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 hidden w-72 opacity-40 lg:block"
      />

      <div className="shell relative">
        {/* Desktop: a proper two-sided mind map. */}
        <AnimatedSection className="hidden lg:block">
          <div className="flex items-stretch justify-center">
            <div className="flex flex-col justify-center gap-12">
              {t.left.map((branch) => (
                <BranchRow key={branch.name} branch={branch} side="left" />
              ))}
            </div>

            <Bracket side="left" className="w-10" />
            <Stub className="w-6" />

            <div className="flex items-center">
              <span className="rounded-full bg-brand px-8 py-4 text-lg font-extrabold whitespace-nowrap text-white">
                {t.core}
              </span>
            </div>

            <Stub className="w-6" />
            <Bracket side="right" className="w-10" />

            <div className="flex flex-col justify-center gap-12">
              {t.right.map((branch) => (
                <BranchRow key={branch.name} branch={branch} side="right" />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Mobile / tablet: the same tree, stacked. */}
        <div className="lg:hidden">
          <div className="flex justify-center">
            <span className="rounded-full bg-brand px-6 py-3 text-base font-extrabold text-white">
              {t.core}
            </span>
          </div>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {[...t.left, ...t.right].map((branch) => (
              <li key={branch.name} className="rounded-card border border-hairline bg-paper p-5">
                <p className="text-base font-bold text-brand">{branch.name}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {branch.leaves.map((leaf) => (
                    <li
                      key={leaf}
                      className="rounded-full bg-brand px-3.5 py-1.5 text-[0.8rem] text-white"
                    >
                      {leaf}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function BranchRow({ branch, side }: { branch: Branch; side: Side }) {
  const leaves = (
    <ul className={cn("flex flex-col gap-3", side === "left" ? "items-end" : "items-start")}>
      {branch.leaves.map((leaf) => (
        <li
          key={leaf}
          className="max-w-[13rem] rounded-full bg-brand px-4 py-2 text-center text-[0.82rem] leading-snug text-white"
        >
          {leaf}
        </li>
      ))}
    </ul>
  );

  const pill = (
    <span className="rounded-full bg-brand px-5 py-3 text-[0.95rem] font-bold whitespace-nowrap text-white">
      {branch.name}
    </span>
  );

  return (
    <div className="flex items-stretch">
      {side === "left" ? (
        <>
          {leaves}
          <Bracket side="left" className="w-8" />
          <Stub className="w-4" />
          <div className="flex items-center">{pill}</div>
        </>
      ) : (
        <>
          <div className="flex items-center">{pill}</div>
          <Stub className="w-4" />
          <Bracket side="right" className="w-8" />
          {leaves}
        </>
      )}
    </div>
  );
}

/**
 * The "}"-shaped connector: three stubs converge on a vertical bar whose
 * midpoint feeds the next node. Height is 2/3 of the row so the top and
 * bottom rails land on the first and last item's centre line.
 */
function Bracket({ side, className }: { side: Side; className?: string }) {
  return (
    <div className={cn("relative flex shrink-0 items-center", className)} aria-hidden>
      <div
        className={cn(
          "relative h-2/3 w-full border-t border-b border-brand",
          side === "left"
            ? "rounded-tr-2xl rounded-br-2xl border-r"
            : "rounded-tl-2xl rounded-bl-2xl border-l"
        )}
      >
        <span className="absolute inset-x-0 top-1/2 border-t border-brand" />
      </div>
    </div>
  );
}

function Stub({ className }: { className?: string }) {
  return (
    <div className={cn("flex shrink-0 items-center", className)} aria-hidden>
      <span className="w-full border-t border-brand" />
    </div>
  );
}
