"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "fire" | "hold" | "bump";
}

const variantStyles: Record<string, string> = {
  fire: "bg-rust text-paper border-rust hover:bg-ink hover:border-ink",
  hold: "bg-transparent text-ink border-ink hover:bg-ink hover:text-paper",
  bump: "bg-chalkboard text-paper border-chalkboard hover:bg-ink hover:border-ink",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "fire", className = "", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.96, y: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className={`
          inline-flex items-center justify-center gap-2
          px-6 py-3 border-2
          font-mono text-sm uppercase tracking-wide
          transition-colors duration-150
          ${variantStyles[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";