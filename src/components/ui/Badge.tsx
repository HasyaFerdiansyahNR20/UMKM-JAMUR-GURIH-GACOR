import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "gold";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}) => {
  const variants = {
    success: "bg-emerald-100 text-emerald-800 border-emerald-300",
    warning: "bg-amber-100 text-amber-800 border-amber-300",
    danger: "bg-rose-100 text-rose-800 border-rose-300",
    info: "bg-sky-100 text-sky-800 border-sky-300",
    neutral: "bg-stone-100 text-stone-700 border-stone-300",
    gold: "bg-amber-400 text-stone-900 border-amber-500 font-bold",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs font-semibold rounded-md",
    md: "px-2.5 py-1 text-xs font-bold rounded-lg border",
  };

  return (
    <span className={cn("inline-flex items-center gap-1 font-medium", variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
