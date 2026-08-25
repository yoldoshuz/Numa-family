import Image from "next/image";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import type { Dictionary } from "@/lib/i18n/getDictionary";

type Branch = Dictionary["ecosystem"]["left"][number];
type Side = "left" | "right";

/** Row gaps, in pixels: the rail is stretched by these to stay continuous. */
const LEAF_GAP = 12;
const BRANCH_GAP = 48;

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
            <Fan
              side="left"
              gap={BRANCH_GAP}
              items={t.left.map((branch) => (
                <BranchRow key={branch.name} branch={branch} side="left" />
              ))}
            />

            <div className="flex items-center">
              <span className="rounded-full bg-brand px-8 py-4 text-lg font-extrabold whitespace-nowrap text-white">
                {t.core}
              </span>
            </div>

            <Fan
              side="right"
              gap={BRANCH_GAP}
              items={t.right.map((branch) => (
                <BranchRow key={branch.name} branch={branch} side="right" />
              ))}
            />
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

/**
 * One fan: a column of nodes joined to a single rail, and the rail joined to
 * whatever stands on the other side.
 *
 * The nodes and the connector share one grid, so the rail is positioned from
 * the rows themselves rather than from a guess about how tall they are. The
 * previous version drew a fixed `h-2/3` bracket and hoped its ends would land
 * on the first and last node's centre line; they did not, which is why the
 * rails stopped short of the cards they were supposed to reach — and the taller
 * a node wrapped, the further short they stopped.
 */
function Fan({
  side,
  items,
  gap = LEAF_GAP,
}: {
  side: Side;
  items: React.ReactNode[];
  gap?: number;
}) {
  const nodes = (
    <div
      className="grid"
      style={{
        rowGap: `${gap}px`,
        gridTemplateColumns: side === "left" ? "auto 2.5rem" : "2.5rem auto",
        /*
         * Equal rows. The rail runs from the first row's centre to the last
         * one's, so its midpoint only lines up with the lead going to the
         * parent — which is centred on the whole fan — when every row is the
         * same height. With `auto` rows a fan whose first branch wrapped to two
         * lines pushed that midpoint off by ten pixels or so, and the join to
         * the centre visibly missed.
         */
        gridAutoRows: "1fr",
      }}
    >
      {items.map((item, index) => {
        const rail = (
          <Rail
            key={`rail-${index}`}
            side={side}
            first={index === 0}
            last={index === items.length - 1}
            only={items.length === 1}
            gap={gap}
          />
        );
        const node = <div key={`node-${index}`}>{item}</div>;
        return side === "left" ? [node, rail] : [rail, node];
      })}
    </div>
  );

  return (
    <div className="flex items-stretch">
      {side === "left" ? (
        <>
          {nodes}
          <Stub className="w-6" />
        </>
      ) : (
        <>
          <Stub className="w-6" />
          {nodes}
        </>
      )}
    </div>
  );
}

/**
 * The connector cell for one row.
 *
 * Horizontal arm at the row's own centre line, so it meets the card whatever
 * height that card ended up. The vertical rail runs along the edge facing the
 * parent: it starts at the first row's centre, ends at the last row's centre,
 * and is stretched by the row gap in between so the segments join up into one
 * continuous line instead of a dashed ladder.
 */
function Rail({
  side,
  first,
  last,
  only,
  gap,
}: {
  side: Side;
  first: boolean;
  last: boolean;
  only: boolean;
  gap: number;
}) {
  return (
    <div className="relative" aria-hidden>
      <span
        className={cn(
          "absolute top-1/2 border-t border-brand",
          side === "left" ? "left-0 right-1/2" : "left-1/2 right-0",
        )}
      />
      {only ? null : (
        <span
          className={cn(
            "absolute border-l border-brand",
            side === "left" ? "right-1/2" : "left-1/2",
          )}
          style={{
            top: first ? "50%" : `-${gap}px`,
            bottom: last ? "50%" : `-${gap}px`,
          }}
        />
      )}
    </div>
  );
}

/**
 * The short lead from a fan's rail to the node beside it.
 *
 * Vertically centred on the whole fan, which is exactly where the rail's
 * midpoint is, so the two meet.
 */
function Stub({ className }: { className?: string }) {
  return (
    <div className={cn("flex shrink-0 items-center", className)} aria-hidden>
      <span className="w-full border-t border-brand" />
    </div>
  );
}

function BranchRow({ branch, side }: { branch: Branch; side: Side }) {
  const leaves = (
    <Fan
      side={side}
      items={branch.leaves.map((leaf) => (
        <span
          key={leaf}
          className="flex h-full w-52 items-center justify-center rounded-full bg-brand px-4 py-2 text-center text-[0.82rem] leading-snug text-white"
        >
          {leaf}
        </span>
      ))}
    />
  );

  const pill = (
    // Fixed width, so the branch pills stack in a column instead of each one
    // sitting at its own left edge and taking its rail with it.
    <span className="flex w-48 items-center justify-center rounded-full bg-brand px-5 py-3 text-center text-[0.95rem] font-bold text-white">
      {branch.name}
    </span>
  );

  return (
    <div className="flex items-stretch">
      {side === "left" ? (
        <>
          {leaves}
          <div className="flex items-center">{pill}</div>
        </>
      ) : (
        <>
          <div className="flex items-center">{pill}</div>
          {leaves}
        </>
      )}
    </div>
  );
}
