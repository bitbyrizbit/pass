"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function fireOrder(items: { id: string; quantity: number }[], tableNumber: number) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "not signed in" };

  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("id, price")
    .in("id", items.map((i) => i.id));

  const total = (menuItems ?? []).reduce((sum, mi) => {
    const qty = items.find((i) => i.id === mi.id)?.quantity ?? 1;
    return sum + mi.price * qty;
  }, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ customer_id: user.id, table_number: tableNumber, total, status: "fired" })
    .select()
    .single();

  if (orderError || !order) return { error: orderError?.message ?? "could not fire order" };

  const orderItems = items.map((i) => ({
    order_id: order.id,
    menu_item_id: i.id,
    quantity: i.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) return { error: itemsError.message };

  revalidatePath("/menu");
  return { success: true, orderId: order.id };
}