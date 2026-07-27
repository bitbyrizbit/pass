"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleAvailability(itemId: string, available: boolean) {
  const supabase = await createClient();
  await supabase.from("menu_items").update({ is_available: available }).eq("id", itemId);
  revalidatePath("/menu");
  revalidatePath("/admin");
}
