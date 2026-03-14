import { cn } from "@/lib/utils/cn";
import { AnimatedSection } from "./AnimatedSection";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <AnimatedSection
      className={cn(
        "mb-12 sm:mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      <h2
        className={cn(
          "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-[#1a1a18]",
          align === "center" && "mx-auto"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-3 text-base sm:text-lg text-[#6b6b65] leading-relaxed",
            align === "center" ? "max-w-xl mx-auto" : "max-w-lg"
          )}
        >
          {subtitle}
        </p>
      )}
    </AnimatedSection>
  );
}
