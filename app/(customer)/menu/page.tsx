import { createClient } from "@/lib/supabase/server";
import { MenuItem } from "@/lib/supabase/types";
import { MenuBoard } from "@/components/menu/MenuBoard";
import { OrderWithItems } from "@/lib/supabase/types";
import { computeDemandSignals } from "@/lib/predict-demand";

export default async function MenuPage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("menu_items")
    .select("*")
    .order("category")
    .returns<MenuItem[]>();

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, order_items(*, menu_items(name, price))")
    .order("fired_at", { ascending: false })
    .limit(50)
    .returns<OrderWithItems[]>();

  const demandSignals = computeDemandSignals(recentOrders ?? []);

  return (
    <main className="min-h-screen px-4 py-12 max-w-4xl mx-auto selection:bg-rust selection:text-paper">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-ink-soft mb-2 uppercase tracking-widest">pass, tonight's board</p>
          <h1 className="font-heading italic text-4xl">What's on the pass</h1>
        </div>
      </header>

      <MenuBoard items={items ?? []} demandSignals={demandSignals} />
    </main>
  );
}