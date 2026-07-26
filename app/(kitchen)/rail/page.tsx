import { createClient } from "@/lib/supabase/server";
import { OrderWithItems } from "@/lib/supabase/types";
import { Rail } from "@/components/rail/Rail";

export default async function KitchenRailPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, menu_items(name))")
    .in("status", ["fired", "in_progress"])
    .order("fired_at", { ascending: true })
    .returns<OrderWithItems[]>();

  return (
    <main className="min-h-screen px-4 py-10 bg-ink">
      <header className="mb-8">
        <p className="font-mono text-xs text-paper/60 mb-2">pass, kitchen</p>
        <h1 className="font-heading italic text-4xl text-paper">The rail</h1>
      </header>

      <Rail initialOrders={orders ?? []} />
    </main>
  );
}