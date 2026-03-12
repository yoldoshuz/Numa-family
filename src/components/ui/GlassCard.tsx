"use client";

import { cn } from "@/lib/utils/cn";
import { type HTMLAttributes, forwardRef } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, padding = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          hover ? "glass-card-hover" : "glass-card",
          {
            "p-4": padding === "sm",
            "p-6 md:p-8": padding === "md",
            "p-8 md:p-12": padding === "lg",
            "p-0": padding === "none",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
