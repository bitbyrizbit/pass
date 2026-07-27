"use client";

import { useState } from "react";
import { MenuItem } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
import { fireOrder } from "@/app/(customer)/menu/actions";
import { TicketWriter } from "./TicketWriter";
import { DemandSignal } from "@/lib/predict-demand";
import { motion } from "framer-motion";

interface MenuBoardProps {
  items: MenuItem[];
  demandSignals: DemandSignal[];
}

export function MenuBoard({ items, demandSignals }: MenuBoardProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [firing, setFiring] = useState(false);
  const [fired, setFired] = useState(false);

  const categories = Array.from(new Set(items.map((i) => i.category)));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleFire() {
  const chosen = items.filter((i) => selected.has(i.id));
  if (chosen.length === 0) return;

  setFiring(true);
  const result = await fireOrder(
    chosen.map((i) => ({ id: i.id, quantity: 1 })),
    12
  );

  if (result.error) {
    setFiring(false);
    alert(`Order failed: ${result.error}`);
    return;
  }

  if (result.success) {
    setFired(true);
    setSelected(new Set());
  }
}

  const ticketLines = items
    .filter((i) => selected.has(i.id))
    .map((i) => `1x  ${i.name}`);

  return (
    <div className="flex flex-col gap-10">
      {categories.map((category) => (
        <section key={category}>
          <h2 className="font-mono text-xs text-rust mb-4 border-b border-rail-line pb-2">
            {category}
          </h2>

          <div className="flex flex-col divide-y divide-rail-line/40">
            {items
              .filter((i) => i.category === category)
              .map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between py-4 gap-4 ${
                    !item.is_available ? "opacity-40" : ""
                  }`}
                >
                  <div>
                    <p className="font-heading italic text-xl">{item.name}</p>
                    {item.description && (
                      <p className="font-body text-sm text-ink-soft mt-0.5">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 mt-1.5">
                      {!item.is_available ? (
                        <p className="font-mono text-[10px] uppercase tracking-widest text-brick">
                          86'd for tonight
                        </p>
                      ) : demandSignals.find(s => s.menuItemId === item.id)?.trend === "going-fast" ? (
                        <p className="font-mono text-[10px] uppercase tracking-widest text-rust flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-rust rounded-full animate-pulse"></span>
                          Moving fast tonight
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-sm">
                      ₹{item.price.toFixed(0)}
                    </span>
                    <Button
                      variant={selected.has(item.id) ? "bump" : "hold"}
                      disabled={!item.is_available}
                      onClick={() => toggle(item.id)}
                      className="text-xs px-4 py-2"
                    >
                      {selected.has(item.id) ? "added" : "add"}
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}

      {selected.size > 0 && !firing && (
        <motion.button
          onClick={handleFire}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="fixed bottom-6 right-6 bg-rust text-paper px-6 py-4 font-mono text-sm tracking-widest uppercase hover:bg-[#a64032] transition-colors z-40"
          style={{ boxShadow: "4px 4px 0px 0px rgba(32,28,24,0.3)" }}
        >
          fire {selected.size} {selected.size === 1 ? "item" : "items"}
        </motion.button>
      )}

      {firing && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50">
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
