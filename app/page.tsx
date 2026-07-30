import { Hero } from "@/components/hero/Hero";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Pass — kitchen rail order management",
  description: "A real-time kitchen order management system built around the ticket rail metaphor. Customer menu, kitchen rail, and manager dashboard.",
};

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="bg-paper cursor-none">
      <Hero userEmail={user?.email} />
    </main>
  );
}