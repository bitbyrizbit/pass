"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const TICKET_DATA = [
  { table: 4,  items: ["lamb cutlet", "burrata", "glass red"], status: "fired" },
  { table: 9,  items: ["risotto", "grilled bream", "tiramisu"], status: "in progress" },
  { table: 2,  items: ["caesar", "wagyu strip", "soufflé"], status: "bumped" },
  { table: 11, items: ["focaccia", "bone marrow", "negroni"], status: "fired" },
  { table: 6,  items: ["truffle pasta", "carpaccio"], status: "in progress" },
];

function StaticTicket({ table, items, status, delay, rotate }: {
  table: number;
  items: string[];
  status: string;
  delay: number;
  rotate: number;
}) {
  const isFired = status === "fired";
  const isBumped = status === "bumped";

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: rotate - 8 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="ticket-edge-both relative flex-shrink-0 w-52 bg-paper pt-6 pb-5 px-4 select-none"
      style={{
        boxShadow: isFired
          ? "4px 6px 0 0 rgba(194,76,27,0.25)"
          : "4px 6px 0 0 rgba(32,28,24,0.12)",
      }}
    >
      {/* Top line */}
      <div className="flex justify-between items-center mb-3">
        <span className="font-mono text-[10px] text-ink-soft">table {table}</span>
      </div>

      <div className="w-full h-px bg-rail-line/40 mb-3" />

      {/* Items */}
      <div className="flex flex-col gap-1 mb-4">
        {items.map((item, i) => (
          <span key={i} className={`font-heading italic text-base leading-tight ${isBumped ? "line-through text-ink/40" : "text-ink"}`}>
            {item}
          </span>
        ))}
      </div>

      <div className="w-full h-px bg-rail-line/40 mb-3" />

      {/* Status dot */}
      <div className="flex items-center gap-1.5">
        <span
          className={`w-1.5 h-1.5 rounded-full ${isFired ? "bg-rust animate-pulse" : isBumped ? "bg-rail-line" : "bg-chalkboard"}`}
        />
        <span className={`font-mono text-[10px] ${isFired ? "text-rust" : "text-ink-soft"}`}>
          {status}
        </span>
      </div>
    </motion.div>
  );
}

function RailWire() {
  return (
    <div className="absolute top-[44px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rail-line/60 to-transparent pointer-events-none" />
  );
}

function MarqueeText() {
  const text = "pass . the kitchen rail . order management for people who cook . ";
  return (
    <div className="overflow-hidden border-y border-rail-line/30 py-3">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
        className="flex whitespace-nowrap"
      >
        {[text, text].map((t, i) => (
          <span key={i} className="font-mono text-xs text-ink-soft/60 pr-0">
            {t.repeat(4)}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setShowCursor(true);
    };
    const onLeave = () => setShowCursor(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      {/* Custom cursor */}
      <AnimatePresence>
        {showCursor && (
          <motion.div
            className="fixed pointer-events-none z-50 mix-blend-difference"
            style={{ left: cursorPos.x, top: cursorPos.y, translateX: "-50%", translateY: "-50%" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="w-5 h-5 rounded-full bg-paper" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky nav */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-6 md:px-10 py-4 mix-blend-difference text-paper pointer-events-none"
      >
        <span className="font-heading italic text-xl">Pass</span>
        <div className="flex items-center gap-6 pointer-events-auto">
          <Link href="/menu" className="font-mono text-xs hover:text-rust transition-colors">
            Order
          </Link>
          <Link href="/login" className="font-mono text-xs hover:text-rust transition-colors">
            Login
          </Link>
          <Link href="/login?redirect=/admin" className="font-mono text-xs border border-paper/40 px-4 py-2 rounded-full hover:bg-paper hover:text-ink transition-colors">
            Admin
          </Link>
        </div>
      </motion.nav>

      {/* Hero section */}
      <section ref={containerRef} className="relative min-h-screen overflow-hidden flex flex-col">
        {/* Enormous headline */}
        <motion.div
          style={{ y, opacity }}
          className="relative z-10 flex flex-col justify-end pb-10 pt-32 px-6 md:px-10 flex-1"
        >
          <div className="overflow-hidden mb-2">
            <motion.p
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-[10px] md:text-xs text-ink-soft/60 tracking-[0.3em] mb-4"
            >
              order management, honest design
            </motion.p>
          </div>

          <div className="overflow-hidden pb-6 -mb-6">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading italic text-[clamp(3.5rem,12vw,9rem)] leading-[0.9] text-ink tracking-tight"
            >
              Every ticket<br />
              <span className="text-rust">tells a story.</span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-10"
          >
            <Link
              href="/menu"
              className="group relative inline-flex items-center gap-3 font-mono text-sm text-paper bg-ink px-8 py-4 overflow-hidden rounded-full"
            >
              <span className="relative z-10">browse the menu</span>
              <motion.span
                className="absolute inset-0 bg-rust"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
              <span className="relative z-10 font-mono text-lg">→</span>
            </Link>

            <p className="font-body text-sm text-ink-soft max-w-[26ch]">
              A real-time kitchen rail system for the modern service line.
            </p>
          </motion.div>
        </motion.div>

        <MarqueeText />

        {/* Rail with tickets */}
        <div className="relative px-6 md:px-10 py-16 overflow-x-auto overflow-y-visible">
          <RailWire />
          <div className="flex gap-5 items-start pt-2 pb-4" style={{ minWidth: "max-content" }}>
            {TICKET_DATA.map((t, i) => (
              <StaticTicket
                key={i}
                {...t}
                delay={0.4 + i * 0.12}
                rotate={((i % 3) - 1) * 1.5}
              />
            ))}
          </div>
        </div>

        {/* Bottom label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="px-6 md:px-10 pb-10 flex justify-end items-center"
        >
          <span className="font-mono text-[10px] text-ink-soft/40">
            bitbyrizbit / 2026
          </span>
        </motion.div>
      </section>

      {/* Feature section */}
      <section className="min-h-screen bg-ink noise-overlay relative px-6 md:px-10 py-24 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-mono text-xs text-paper/40 tracking-[0.3em] mb-6"
              >
                the concept
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading italic text-5xl md:text-6xl text-paper leading-tight mb-8"
              >
                The pass is where everything comes together.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="font-body text-paper/60 leading-relaxed text-lg max-w-lg"
              >
                In every kitchen, the pass is the final checkpoint before a plate reaches a table. 
                We borrowed that same idea for software. Your orders, your team, your line . 
                all visible, all real-time, all under control.
              </motion.p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { label: "customer menu", desc: "Live menu with availability and demand signals.", path: "/menu" },
                { label: "kitchen rail", desc: "Real-time order rail. Drag to bump, staff only.", path: "/login?redirect=/rail" },
                { label: "the board", desc: "Manager dashboard with analytics and controls.", path: "/login?redirect=/admin" },
              ].map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.path}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-center justify-between border border-paper/10 px-6 py-5 hover:border-rust/60 transition-all duration-300 hover:bg-rust/5 rounded-[2rem]"
                >
                  <div>
                    <p className="font-heading italic text-2xl text-paper group-hover:text-rust transition-colors">{item.label}</p>
                    <p className="font-mono text-xs text-paper/40 mt-1">{item.desc}</p>
                  </div>
                  <motion.span
                    className="font-mono text-paper/40 group-hover:text-rust group-hover:translate-x-1 transition-all duration-300"
                  >
                    →
                  </motion.span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
