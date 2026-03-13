"use client";

import { cn } from "@/lib/utils/cn";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base — forhers pill style
          "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5c55]/50 focus-visible:ring-offset-2",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "active:scale-[0.97]",

          // Variants
          variant === "primary" && [
            "bg-[#1a1a18] text-white",
            "hover:bg-[#2d2d2a]",
          ],
          variant === "secondary" && [
            "bg-[#f7f6f3] text-[#1a1a18] border border-[#e8e6e1]",
            "hover:bg-[#eae8e3]",
          ],
          variant === "outline" && [
            "border-2 border-[#1a1a18] text-[#1a1a18] bg-transparent",
            "hover:bg-[#1a1a18] hover:text-white",
          ],
          variant === "ghost" && [
            "text-[#6b6b65] bg-transparent",
            "hover:text-[#1a1a18] hover:bg-black/[0.05]",
          ],
          variant === "glass" && [
            "bg-white/80 backdrop-blur-md text-[#1a1a18] border border-white/60",
            "hover:bg-white/95",
          ],

          // Sizes
          size === "sm" && "px-4 py-2 text-sm gap-1.5",
          size === "md" && "px-5 py-2.5 text-sm gap-2",
          size === "lg" && "px-7 py-3.5 text-base gap-2",

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
