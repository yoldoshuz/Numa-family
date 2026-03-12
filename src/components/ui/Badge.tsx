import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  variant?: "primary" | "success" | "warning" | "glass";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "primary", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase",
        {
          "bg-primary/10 text-primary": variant === "primary",
          "bg-emerald-50 text-emerald-700": variant === "success",
          "bg-amber-50 text-amber-700": variant === "warning",
          "glass text-text-primary": variant === "glass",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
