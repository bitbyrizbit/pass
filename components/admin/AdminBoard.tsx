"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, animate } from "framer-motion";
import { OrderWithItems, MenuItem } from "@/lib/supabase/types";
import { toggleAvailability } from "@/app/(admin)/admin/actions";
import { computeDemandSignals } from "@/lib/predict-demand";

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(display, value, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, display]);

  return <span>{prefix}{display}{suffix}</span>;
}

export function AdminBoard({ orders, menuItems }: { orders: OrderWithItems[], menuItems: MenuItem[] }) {
  const [isPending, startTransition] = useTransition();

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const currentlyFiring = orders.filter(o => o.status === "fired").length;

  const statusCounts = {
    fired: orders.filter(o => o.status === "fired").length,
    in_progress: orders.filter(o => o.status === "in_progress").length,
    bumped: orders.filter(o => o.status === "bumped").length,
    served: orders.filter(o => o.status === "served").length,
  };

  const demandSignals = computeDemandSignals(orders);
  const trendingItems = demandSignals.filter(s => s.trend === "going-fast");

  const handleToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      await toggleAvailability(id, !current);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
      {/* Summary Strip */}
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Orders", val: totalOrders },
          { label: "Revenue", val: totalRevenue, prefix: "₹" },
          { label: "On The Line", val: currentlyFiring },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-paper/10 pb-4"
          >
            <p className="font-mono text-xs text-paper/50 mb-2  tracking-widest">{stat.label}</p>
            <p className="font-heading italic text-5xl md:text-6xl text-paper">
              <AnimatedNumber value={stat.val} prefix={stat.prefix} />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Content: Left Column */}
      <div className="lg:col-span-8 flex flex-col gap-12">
        {/* Live Status Pipeline */}
        <section>
          <h2 className="font-mono text-sm tracking-widest  text-paper/50 mb-6">Pipeline</h2>
          <div className="flex gap-2 h-16 w-full rounded-sm overflow-hidden p-1 border border-paper/10">
            {Object.entries(statusCounts).map(([status, count], i) => {
              const percentage = totalOrders === 0 ? 25 : (count / totalOrders) * 100;
              const bg = status === "fired" ? "bg-rust" : status === "in_progress" ? "bg-paper/80" : status === "bumped" ? "bg-paper/40" : "bg-paper/20";
              const label = status.replace("_", " ");
              
              return (
                <motion.div
                  key={status}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className={`${bg} h-full relative group flex items-end p-2 min-w-[40px]`}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 left-2">
                    <span className="font-mono text-[10px] text-ink  mix-blend-difference">{label}: {count}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Recent Order Log */}
        <section>
          <h2 className="font-mono text-sm tracking-widest  text-paper/50 mb-6">Recent History</h2>
          <div className="flex flex-col gap-2">
            {orders.slice(0, 8).map((order, i) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="group flex justify-between items-center py-4 border-b border-paper/5 hover:border-rust/50 transition-colors cursor-default"
              >
                <div className="flex items-center gap-6">
                  <span className="font-mono text-sm text-paper/40">#{order.id.slice(0, 4)}</span>
                  <span className="font-heading italic text-xl text-paper">Table {order.table_number}</span>
                  <div className="flex gap-1 text-xs text-paper/60 opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 duration-300">
                    {order.order_items.map(i => `${i.quantity}x ${i.menu_items.name}`).join(', ')}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <span className="font-mono text-xs  tracking-widest text-paper/50">{order.status.replace("_", " ")}</span>
                  <span className="font-mono text-sm text-paper">₹{order.total}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Main Content: Right Column */}
      <div className="lg:col-span-4 flex flex-col gap-12">
        
        {/* Intelligence (AI Demand) */}
        {trendingItems.length > 0 && (
          <section>
            <h2 className="font-mono text-sm tracking-widest  text-rust mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rust animate-pulse" />
              Going Fast
            </h2>
            <div className="p-4 border border-rust/20 bg-rust/5 flex flex-col gap-3">
              {trendingItems.map((item, i) => (
                <motion.div 
                  key={item.menuItemId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex justify-between items-center"
                >
                  <span className="font-heading text-lg text-paper">{item.itemName}</span>
                  <span className="font-mono text-xs text-rust">{item.ordersInLastHour}x / hr</span>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Menu Controls */}
        <section>
          <h2 className="font-mono text-sm tracking-widest  text-paper/50 mb-6">The Menu</h2>
          <div className="flex flex-col gap-1">
            {menuItems.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex justify-between items-center py-3 group"
              >
                <div>
                  <span className={`font-heading text-xl transition-colors ${item.is_available ? 'text-paper' : 'text-paper/30 line-through'}`}>
                    {item.name}
                  </span>
                </div>
                <button
                  onClick={() => handleToggle(item.id, item.is_available)}
                  disabled={isPending}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rust focus:ring-offset-2 focus:ring-offset-ink ${item.is_available ? 'bg-paper/20' : 'bg-rust/50'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-paper transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] duration-500 ${item.is_available ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
