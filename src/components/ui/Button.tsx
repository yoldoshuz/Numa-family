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
          "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full cursor-pointer",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]":
              variant === "primary",
            "bg-cream text-text-primary hover:bg-cream-dark active:scale-[0.98]":
              variant === "secondary",
            "border-2 border-primary text-primary hover:bg-primary hover:text-white active:scale-[0.98]":
              variant === "outline",
            "text-text-secondary hover:text-primary hover:bg-primary-50":
              variant === "ghost",
            "glass text-text-primary hover:bg-white/70 active:scale-[0.98]":
              variant === "glass",
          },
          {
            "px-4 py-2 text-sm gap-1.5": size === "sm",
            "px-6 py-3 text-base gap-2": size === "md",
            "px-8 py-4 text-lg gap-2.5": size === "lg",
          },
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
