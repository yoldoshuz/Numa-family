import Image from "next/image";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import type { Dictionary } from "@/lib/i18n/getDictionary";

type Branch = Dictionary["ecosystem"]["left"][number];
type Side = "left" | "right";

/** Row gaps, in pixels: the rail is stretched by these to stay continuous. */
const LEAF_GAP = 12;
/*
 * The same gap between branches as between leaves, deliberately.
 *
 * A branch's three leaves were spaced 12px apart but the branches themselves
 * 48px, so the column of nine leaves ran 12-12-48-12-12-48-12-12 and the two
 * wide steps read as white bands cutting the column into three. One step for
 * all nine turns it back into a single evenly spaced list; the branch pills
 * stay centred on their own three, so the grouping is still legible from the
 * connectors rather than from holes in the layout.
 */
const BRANCH_GAP = LEAF_GAP;

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
              items={t.left.map((branch, i) => (
                <BranchRow
                  key={branch.name}
                  branch={branch}
                  side="left"
                  bridgeStart={i > 0 ? BRANCH_GAP / 2 : 0}
                  bridgeEnd={i < t.left.length - 1 ? BRANCH_GAP / 2 : 0}
                />
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
              items={t.right.map((branch, i) => (
                <BranchRow
                  key={branch.name}
                  branch={branch}
                  side="right"
                  bridgeStart={i > 0 ? BRANCH_GAP / 2 : 0}
                  bridgeEnd={i < t.right.length - 1 ? BRANCH_GAP / 2 : 0}
                />
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
  bridgeStart = 0,
  bridgeEnd = 0,
}: {
  side: Side;
  items: React.ReactNode[];
  gap?: number;
  /**
   * Pixels the rail runs past the first / last row's centre line, instead of
   * stopping on it.
   *
   * A branch's leaves get their own bracket, so with three branches stacked the
   * leaf column read as one vertical line broken twice by a 100px hole. Each
   * branch bridges half the gap to its neighbour — `BRANCH_GAP / 2` up and the
   * same down — and the two halves meet exactly in the middle, closing the
   * column into a single continuous line. The outermost ends stay capped on
   * the first and last leaf, so the line still starts and stops on a node.
   */
  bridgeStart?: number;
  bridgeEnd?: number;
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
            bridgeStart={bridgeStart}
            bridgeEnd={bridgeEnd}
          />
        );
        /*
         * `h-full`, and it is load-bearing. The grid stretches this wrapper to
         * the row height, but a plain block inside it keeps its own content
         * height and sits at the top — so every branch shorter than the
         * tallest one ended up with its pill ~27px above the arm that was
         * drawn at the row's centre line, and five of the six arms stopped in
         * mid-air beside the pill they were meant to touch.
         */
        const node = (
          <div key={`node-${index}`} className="flex h-full">
            {item}
          </div>
        );
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
  bridgeStart = 0,
  bridgeEnd = 0,
}: {
  side: Side;
  first: boolean;
  last: boolean;
  only: boolean;
  gap: number;
  bridgeStart?: number;
  bridgeEnd?: number;
}) {
  // A single-row fan needs no rail — unless it is bridging to a neighbour, in
  // which case the rail is the whole point.
  const hasRail = !only || bridgeStart > 0 || bridgeEnd > 0;

  return (
    <div className="relative" aria-hidden>
      <span
        className={cn(
          "absolute top-1/2 border-t border-brand",
          side === "left" ? "left-0 right-1/2" : "left-1/2 right-0",
        )}
      />
      {hasRail && (
        <span
          className={cn(
            "absolute border-l border-brand",
            side === "left" ? "right-1/2" : "left-1/2",
          )}
          style={{
            top: first ? (bridgeStart > 0 ? `-${bridgeStart}px` : "50%") : `-${gap}px`,
            bottom: last ? (bridgeEnd > 0 ? `-${bridgeEnd}px` : "50%") : `-${gap}px`,
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

function BranchRow({
  branch,
  side,
  bridgeStart = 0,
  bridgeEnd = 0,
}: {
  branch: Branch;
  side: Side;
  bridgeStart?: number;
  bridgeEnd?: number;
}) {
  const leaves = (
    <Fan
      side={side}
      bridgeStart={bridgeStart}
      bridgeEnd={bridgeEnd}
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
    <div className="flex h-full items-stretch">
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
