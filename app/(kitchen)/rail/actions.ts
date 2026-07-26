"use server";

import { createClient } from "@/lib/supabase/server";

export async function bumpOrder(orderId: string) {
  const supabase = await createClient();

  await supabase
    .from("orders")
    .update({ status: "bumped", bumped_at: new Date().toISOString() })
    .eq("id", orderId);
}