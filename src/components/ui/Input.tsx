import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 placeholder-stone-400 text-sm",
            "transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
            error && "border-red-500 focus:ring-red-400 focus:border-red-400",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-stone-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
