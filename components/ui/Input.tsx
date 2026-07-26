"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="font-mono text-xs text-ink-soft">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`
            w-full bg-transparent border-0 border-b-2 border-rail-line
            px-1 py-2 text-ink font-body text-base
            focus:outline-none focus:border-rust
            transition-colors duration-150
            placeholder:text-ink-soft/50
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";