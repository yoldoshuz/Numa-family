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
          // Base card style — clean forhers aesthetic
          "bg-white border border-[#e8e6e1] rounded-[1.5rem]",
          "shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]",

          hover && [
            "transition-all duration-300",
            "hover:shadow-[0_4px_24px_rgba(0,0,0,0.09)]",
            "hover:-translate-y-0.5",
          ],

          padding === "sm" && "p-4",
          padding === "md" && "p-6 sm:p-7",
          padding === "lg" && "p-8 sm:p-10",
          padding === "none" && "p-0",

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
