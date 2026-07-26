import { createClient } from "@/lib/supabase/server";
import { MenuItem } from "@/lib/supabase/types";
import { MenuBoard } from "@/components/menu/MenuBoard";

export default async function MenuPage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("menu_items")
    .select("*")
    .order("category")
    .returns<MenuItem[]>();

  return (
    <main className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      <header className="mb-10">
        <p className="font-mono text-xs text-ink-soft mb-2">pass, tonight's board</p>
        <h1 className="font-heading italic text-4xl">What's on the pass</h1>
      </header>

      <MenuBoard items={items ?? []} />
    </main>
  );
}