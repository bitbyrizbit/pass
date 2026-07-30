"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { OrderWithItems } from "@/lib/supabase/types";
import { bumpOrder } from "@/app/(kitchen)/rail/actions";

interface RailProps {
  initialOrders: OrderWithItems[];
}

export function Rail({ initialOrders }: RailProps) {
  const [orders, setOrders] = useState<OrderWithItems[]>(initialOrders);
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("rail-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        async (payload) => {
          const { data } = await supabase
            .from("orders")
            .select("*, order_items(*, menu_items(name))")
            .eq("id", payload.new.id)
            .single<OrderWithItems>();

          if (data) {
            setOrders((prev) => [...prev, data]);
            setNewOrderIds((prev) => new Set([...prev, data.id]));
            // Remove the glow after 3s
            setTimeout(() => {
              setNewOrderIds((prev) => {
                const next = new Set(prev);
                next.delete(data.id);
                return next;
              });
            }, 3000);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          if (payload.new.status === "bumped") {
            setOrders((prev) => prev.filter((o) => o.id !== payload.new.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleBump(orderId: string) {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    await bumpOrder(orderId);
  }

  return (
    <div>
      {/* Rail wire */}
      <div className="relative mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-paper/20 to-transparent" />
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-center">
          <span className="font-mono text-[9px] text-paper/20 bg-ink px-3">
            drag right to bump
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <AnimatePresence mode="popLayout">
          {orders.map((order, i) => (
            <RailTicket
              key={order.id}
              order={order}
              rotate={(i % 3) - 1}
              isNew={newOrderIds.has(order.id)}
              onBump={() => handleBump(order.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {orders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-24 text-center"
        >
          <p className="font-heading italic text-3xl text-paper/20">Nothing on the line.</p>
          <p className="font-mono text-xs text-paper/20 mt-2">Waiting for orders...</p>
        </motion.div>
      )}
    </div>
  );
}

function RailTicket({
  order,
  rotate,
  onBump,
  isNew,
}: {
  order: OrderWithItems;
  rotate: number;
  onBump: () => void;
  isNew: boolean;
}) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 150], [1, 0]);
  const borderOpacity = useTransform(x, [0, 120], [0.3, 0.9]);

  const [elapsed, setElapsed] = useState(() =>
    Math.round((Date.now() - new Date(order.fired_at).getTime()) / 60000)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.round((Date.now() - new Date(order.fired_at).getTime()) / 60000));
    }, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [order.fired_at]);

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: -40,
        rotate: rotate - 8,
        boxShadow: "0px 0px 40px 8px rgba(194,76,27,0.5)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate,
        boxShadow: isNew
          ? [
              "0px 0px 40px 8px rgba(194,76,27,0.6)",
              "4px 6px 0px 0px rgba(194,76,27,0.2)",
            ]
          : "4px 6px 0px 0px rgba(194,76,27,0.2)",
        transition: {
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1],
          boxShadow: { duration: 1.2, ease: "easeOut" },
        },
      }}
      exit={{
        opacity: 0,
        x: 220,
        rotate: rotate + 20,
        transition: { duration: 0.35, ease: [0.55, 0, 1, 0.45] },
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) onBump();
      }}
      style={{ x, opacity, transformOrigin: "top center" }}
      className="ticket-edge-both bg-paper relative w-60 px-5 pt-6 pb-5 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Perforated left edge indicator */}
      <div className="absolute left-4 top-0 bottom-0 flex items-center">
        <div className="w-px h-3/4 bg-rail-line/30 border-l border-dashed border-rail-line/30" />
      </div>

      <div className="pl-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading italic text-2xl text-rust">
            {order.table_number}
          </span>
          <span className="font-mono text-[9px] text-ink-soft/60">
            {elapsed}m ago
          </span>
        </div>

        <div className="w-full h-px bg-rail-line/40 mb-3" />

        {/* Items */}
        <div className="flex flex-col gap-1.5 mb-4">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-baseline gap-2">
              <span className="font-mono text-[10px] text-ink-soft w-4">{item.quantity}x</span>
              <span className="font-heading italic text-base text-ink leading-tight">{item.menu_items.name}</span>
            </div>
          ))}
        </div>

        <div className="w-full h-px bg-rail-line/40 mb-3" />

        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-rust rounded-full animate-pulse" />
            <span className="font-mono text-[9px] text-rust">fired</span>
          </div>
          <span className="font-mono text-[9px] text-ink-soft/40">→ bump</span>
        </div>
      </div>
    </motion.div>
  );
}