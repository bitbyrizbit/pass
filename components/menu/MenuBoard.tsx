"use client";

import { useState } from "react";
import { MenuItem } from "@/lib/supabase/types";
import { fireOrder } from "@/app/(customer)/menu/actions";
import { TicketWriter } from "./TicketWriter";
import { DemandSignal } from "@/lib/predict-demand";
import { motion, AnimatePresence } from "framer-motion";

interface MenuBoardProps {
  items: MenuItem[];
  demandSignals: DemandSignal[];
}

export function MenuBoard({ items, demandSignals }: MenuBoardProps) {
  const [selected, setSelected] = useState<Map<string, number>>(new Map());
  const [firing, setFiring] = useState(false);
  const [fired, setFired] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(items.map((i) => i.category)));

  function increment(id: string) {
    setSelected((prev) => {
      const next = new Map(prev);
      next.set(id, (next.get(id) ?? 0) + 1);
      return next;
    });
  }

  function decrement(id: string) {
    setSelected((prev) => {
      const next = new Map(prev);
      const current = next.get(id) ?? 0;
      if (current <= 1) next.delete(id);
      else next.set(id, current - 1);
      return next;
    });
  }

  const totalItems = Array.from(selected.values()).reduce((a, b) => a + b, 0);

  async function handleFire() {
    const chosen = Array.from(selected.entries()).map(([id, quantity]) => ({ id, quantity }));
    if (chosen.length === 0) return;

    setFiring(true);
    const result = await fireOrder(chosen, 12);

    if (result.error) {
      setFiring(false);
      alert(`Order failed: ${result.error}`);
      return;
    }

    if (result.success) {
      setFired(true);
      setSelected(new Map());
    }
  }

  const ticketLines = Array.from(selected.entries())
    .map(([id, qty]) => {
      const item = items.find((i) => i.id === id);
      return item ? `${qty}x  ${item.name}` : "";
    })
    .filter(Boolean);

  const displayedItems = activeCategory
    ? items.filter((i) => i.category === activeCategory)
    : items;

  return (
    <div className="pb-32">
      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-10 -mx-1">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-1.5 font-mono text-xs transition-all duration-200 ${
            activeCategory === null
              ? "bg-ink text-paper"
              : "text-ink-soft hover:text-ink border border-transparent hover:border-rail-line/40"
          }`}
        >
          everything
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            className={`px-4 py-1.5 font-mono text-xs transition-all duration-200 ${
              activeCategory === cat
                ? "bg-rust text-paper"
                : "text-ink-soft hover:text-ink border border-transparent hover:border-rail-line/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="flex flex-col">
        <AnimatePresence mode="popLayout">
          {displayedItems.map((item, i) => {
            const signal = demandSignals.find((s) => s.menuItemId === item.id);
            const qty = selected.get(item.id) ?? 0;
            const isSelected = qty > 0;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`group flex items-center justify-between py-5 border-b transition-all duration-200 ${
                  isSelected
                    ? "border-rust/40 bg-rust/3"
                    : "border-rail-line/30 hover:border-ink/20"
                } ${!item.is_available ? "opacity-40 pointer-events-none" : ""}`}
              >
                {/* Left: Item info */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading italic text-xl text-ink">
                      {item.name}
                    </span>
                    {signal?.trend === "going-fast" && item.is_available && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="font-mono text-[9px] text-rust flex items-center gap-1 shrink-0"
                      >
                        <span className="w-1 h-1 rounded-full bg-rust animate-pulse inline-block" />
                        moving fast
                      </motion.span>
                    )}
                  </div>
                  {item.description && (
                    <p className="font-body text-sm text-ink-soft mt-0.5 leading-snug max-w-md">
                      {item.description}
                    </p>
                  )}
                  {!item.is_available && (
                    <p className="font-mono text-[10px] text-brick mt-1">
                      86'd for tonight
                    </p>
                  )}
                </div>

                {/* Right: Price + quantity control */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-mono text-sm text-ink-soft w-16 text-right">
                    ₹{item.price.toFixed(0)}
                  </span>

                  <div className="flex items-center gap-2">
                    <AnimatePresence>
                      {qty > 0 && (
                        <motion.button
                          key="minus"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          onClick={() => decrement(item.id)}
                          className="w-7 h-7 flex items-center justify-center border border-rail-line/60 text-ink-soft hover:border-rust hover:text-rust font-mono text-sm transition-colors"
                        >
                          -
                        </motion.button>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {qty > 0 && (
                        <motion.span
                          key="qty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="font-mono text-sm text-rust w-4 text-center"
                        >
                          {qty}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => increment(item.id)}
                      className={`w-7 h-7 flex items-center justify-center font-mono text-sm transition-all duration-200 ${
                        qty > 0
                          ? "bg-rust text-paper hover:bg-ink"
                          : "border border-rail-line/60 text-ink-soft hover:border-rust hover:text-rust"
                      }`}
                    >
                      +
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Floating fire button */}
      <AnimatePresence>
        {totalItems > 0 && !firing && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
          >
            <motion.button
              onClick={handleFire}
              animate={{ scale: [1, 1.015, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-4 bg-ink text-paper px-8 py-4 font-mono text-sm hover:bg-rust transition-colors duration-300"
              style={{ boxShadow: "0 8px 30px rgba(32,28,24,0.3)" }}
            >
              <span>fire order</span>
              <span className="border border-paper/30 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {totalItems}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {firing && (
        <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm flex items-center justify-center z-50">
          <TicketWriter
            lines={["table 12", ...ticketLines, fired ? "-- fired --" : ""]}
            onComplete={() => {
              setTimeout(() => setFiring(false), 1400);
            }}
          />
        </div>
      )}
    </div>
  );
}
