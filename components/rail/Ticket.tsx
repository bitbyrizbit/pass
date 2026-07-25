"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TicketProps {
  children: ReactNode;
  status?: "fired" | "held" | "bumped" | "default";
  rotate?: number;
  className?: string;
}

const statusBorder: Record<string, string> = {
  fired: "border-rust",
  held: "border-rail-line",
  bumped: "border-chalkboard",
  default: "border-ink/20",
};

export function Ticket({
  children,
  status = "default",
  rotate = 0,
  className = "",
}: TicketProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, rotate: rotate - 2 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className={`
        ticket-edge
        bg-paper-dim border-2 ${statusBorder[status]}
        px-5 pt-6 pb-4
        font-mono text-ink
        shadow-[3px_4px_0_0_rgba(32,28,24,0.15)]
        ${className}
      `}
      style={{ transformOrigin: "top center" }}
    >
      {children}
    </motion.div>
  );
}