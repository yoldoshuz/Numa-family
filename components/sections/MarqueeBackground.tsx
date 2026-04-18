"use client";

interface MarqueeBackgroundProps {
  items: string[];
  rows?: number;
  className?: string;
  textClassName?: string;
}

export function MarqueeBackground({
  items,
  rows = 6,
  className = "",
  textClassName = "text-white/60 text-xs font-semibold uppercase tracking-wider",
}: MarqueeBackgroundProps) {
  const loop = [...items, ...items, ...items];
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 flex flex-col justify-evenly py-2">
        {Array.from({ length: rows }).map((_, r) => {
          const reverse = r % 2 === 1;
          const duration = 24 + (r % 3) * 6;
          return (
            <div key={r} className="relative flex whitespace-nowrap">
              <div
                className="flex shrink-0 gap-6"
                style={{
                  animation: `marqueeX ${duration}s linear infinite`,
                  animationDirection: reverse ? "reverse" : "normal",
                }}
              >
                {loop.map((text, i) => (
                  <span key={`${r}-${i}`} className={textClassName}>
                    {text} <span className="opacity-60">•</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes marqueeX {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </div>
  );
}
