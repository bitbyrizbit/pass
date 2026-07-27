import { createClient } from "@/lib/supabase/server";
import { MenuItem } from "@/lib/supabase/types";
import { MenuBoard } from "@/components/menu/MenuBoard";
import { OrderWithItems } from "@/lib/supabase/types";
import { computeDemandSignals } from "@/lib/predict-demand";

export const metadata = {
  title: "Menu — Pass",
  description: "Browse tonight's menu, fire your order to the kitchen.",
};

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
    <main className="min-h-screen px-6 md:px-10 selection:bg-rust selection:text-paper">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur-sm border-b border-rail-line/30 flex items-end justify-between py-5 -mx-6 md:-mx-10 px-6 md:px-10 mb-10">
        <div>
          <p className="font-mono text-[10px] text-ink-soft/50 tracking-[0.3em] mb-0.5">
            pass, tonight's board
          </p>
          <h1 className="font-heading italic text-3xl text-ink">
            What's on the pass
          </h1>
        </div>
        <a
          href="/"
          className="font-mono text-xs text-ink-soft hover:text-rust transition-colors"
        >
          ← back
        </a>
      </header>

      <MenuBoard items={items ?? []} demandSignals={demandSignals} />
    </main>
  );
}