"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  dark?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", id, dark = false, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const baseLabel = dark ? "text-paper/40" : "text-ink-soft";
    const baseInput = dark
      ? "border-paper/20 text-paper placeholder:text-paper/20 focus:border-rust bg-transparent"
      : "border-rail-line text-ink placeholder:text-ink-soft/40 focus:border-rust bg-transparent";

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className={`font-mono text-[10px] tracking-widest transition-colors duration-200 ${
              focused ? "text-rust" : baseLabel
            }`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full border-0 border-b-2
            px-0 py-2.5 font-mono text-sm
            focus:outline-none
            transition-all duration-300
            ${baseInput}
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";