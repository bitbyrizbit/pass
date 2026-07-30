import { createClient } from "@/lib/supabase/server";
import { OrderWithItems } from "@/lib/supabase/types";
import { Rail } from "@/components/rail/Rail";
import Link from "next/link";

export default async function KitchenRailPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, menu_items(name))")
    .in("status", ["fired", "in_progress"])
    .order("fired_at", { ascending: true })
    .returns<OrderWithItems[]>();

  const count = orders?.length ?? 0;

  return (
    <main className="min-h-screen bg-ink noise-overlay">
      <header className="px-6 md:px-10 pt-10 pb-8 border-b border-paper/10 flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] text-paper/40 tracking-[0.3em] mb-3">
            pass / kitchen rail
          </p>
          <div className="flex items-baseline gap-4">
            <h1 className="font-heading italic text-5xl md:text-6xl text-paper">
              On the line
            </h1>
            {count > 0 && (
              <span className="font-mono text-sm text-rust border border-rust/40 rounded-full px-3 py-1">
                {count} up
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6 mb-2">
          <Link
            href="/"
            className="font-mono text-xs text-paper/40 hover:text-paper transition-colors"
          >
            ← back
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rust animate-pulse" />
            <span className="font-mono text-[10px] text-paper/40">live</span>
          </div>
        </div>
      </header>

      <div className="px-6 md:px-10 py-10">
        <Rail initialOrders={orders ?? []} />
      </div>
    </main>
  );
}