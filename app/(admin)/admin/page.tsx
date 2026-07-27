import { createClient } from "@/lib/supabase/server";
import { OrderWithItems, MenuItem } from "@/lib/supabase/types";
import { AdminBoard } from "@/components/admin/AdminBoard";

export default async function AdminPage() {
  const supabase = await createClient();

  // Fetch recent orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, menu_items(name, price))")
    .order("fired_at", { ascending: false })
    .limit(100)
    .returns<OrderWithItems[]>();

  // Fetch menu items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .order("category");

  return (
    <main className="min-h-screen px-4 py-12 md:py-20 bg-ink selection:bg-rust selection:text-paper">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-rust animate-pulse" />
              <p className="font-mono text-xs tracking-widest uppercase text-paper/60">Pass / Command Center</p>
            </div>
            <h1 className="font-heading italic text-5xl md:text-7xl text-paper tracking-tight">The Board</h1>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-paper/40 uppercase tracking-widest">
              {new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </header>

        <AdminBoard orders={orders ?? []} menuItems={(menuItems ?? []) as MenuItem[]} />
      </div>
    </main>
  );
}
