import { OrderWithItems } from "./supabase/types";

export interface DemandSignal {
  menuItemId: string;
  itemName: string;
  ordersInLastHour: number;
  trend: "quiet" | "steady" | "going-fast";
}

export function computeDemandSignals(orders: OrderWithItems[]): DemandSignal[] {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const counts = new Map<string, { name: string; count: number }>();

  for (const order of orders) {
    if (new Date(order.fired_at).getTime() < oneHourAgo) continue;
    for (const item of order.order_items) {
      const existing = counts.get(item.menu_item_id) ?? { name: item.menu_items.name, count: 0 };
      existing.count += item.quantity;
      counts.set(item.menu_item_id, existing);
    }
  }

  return Array.from(counts.entries()).map(([menuItemId, { name, count }]) => ({
    menuItemId,
    itemName: name,
    ordersInLastHour: count,
    trend: count >= 5 ? "going-fast" : count >= 2 ? "steady" : "quiet",
  }));
}
