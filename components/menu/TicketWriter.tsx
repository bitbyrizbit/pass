"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TicketWriterProps {
  lines: string[];
  onComplete?: () => void;
}

export function TicketWriter({ lines, onComplete }: TicketWriterProps) {
  const [visibleText, setVisibleText] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    const result: string[] = lines.map(() => "");

    const interval = setInterval(() => {
      if (lineIndex >= lines.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
        return;
      }

      const currentLine = lines[lineIndex];
      result[lineIndex] = currentLine.slice(0, charIndex + 1);
      setVisibleText([...result]);

      charIndex++;
      if (charIndex >= currentLine.length) {
        lineIndex++;
        charIndex = 0;
      }
    }, 22);

    return () => clearInterval(interval);
  }, [lines, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, rotate: -6, y: -20 }}
        animate={
          done
            ? { opacity: 1, rotate: -2, y: 0 }
            : { opacity: 1, rotate: -2, y: 0 }
        }
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
        className="ticket-edge bg-paper-dim border-2 border-rust px-5 pt-6 pb-4 font-mono text-sm shadow-[3px_4px_0_0_rgba(32,28,24,0.15)]"
        style={{ transformOrigin: "top center" }}
      >
        {visibleText.map((line, i) => (
          <p key={i} className="whitespace-pre min-h-[1.4em]">
            {line}
            {i === visibleText.length - 1 && !done && (
              <span className="animate-pulse">_</span>
            )}
          </p>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}