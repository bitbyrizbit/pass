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

          if (data) setOrders((prev) => [...prev, data]);
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
    <div className="relative border-t-2 border-rail-line/40 pt-10">
      <div className="flex flex-wrap gap-6">
        <AnimatePresence>
          {orders.map((order, i) => (
            <RailTicket
              key={order.id}
              order={order}
              rotate={(i % 3) - 1}
              onBump={() => handleBump(order.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {orders.length === 0 && (
        <p className="font-mono text-sm text-paper/40">nothing on the line</p>
      )}
    </div>
  );
}

function RailTicket({
  order,
  rotate,
  onBump,
}: {
  order: OrderWithItems;
  rotate: number;
  onBump: () => void;
}) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 150], [1, 0]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -30, rotate: rotate - 4 }}
      animate={{ opacity: 1, y: 0, rotate }}
      exit={{ opacity: 0, x: 200, rotate: rotate + 15, transition: { duration: 0.3 } }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) onBump();
      }}
      style={{ x, opacity, transformOrigin: "top center" }}
      className="ticket-edge bg-paper-dim border-2 border-rust px-5 pt-6 pb-4 font-mono text-sm w-64 cursor-grab active:cursor-grabbing shadow-[3px_4px_0_0_rgba(196,76,27,0.3)]"
    >
      <p className="text-rust mb-2">table {order.table_number}</p>
      {order.order_items.map((item) => (
        <p key={item.id} className="text-ink">
          {item.quantity}x {item.menu_items.name}
        </p>
      ))}
      <p className="text-ink-soft mt-3 text-xs">drag right to bump</p>
    </motion.div>
  );
}