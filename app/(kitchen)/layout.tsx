import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/rail");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role === "customer") {
    redirect("/?error=not+authorized+for+kitchen+access");
  }

  return <>{children}</>;
}
