"use client";

import { useState } from "react";
import { MenuItem } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";

interface MenuBoardProps {
  items: MenuItem[];
}

export function MenuBoard({ items }: MenuBoardProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const categories = Array.from(new Set(items.map((i) => i.category)));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

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
                    {!item.is_available && (
                      <p className="font-mono text-xs text-brick mt-1">
                        86'd for tonight
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-sm">
                      &#8377;{item.price.toFixed(0)}
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
    </div>
  );
}