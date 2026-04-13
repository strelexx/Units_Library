import { createClient } from "@/lib/supabase/server";
import { DevelopersTable } from "./developers-table";

export default async function DevelopersPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  const { data: developers } = await supabase
    .from("developers")
    .select("id, name, website")
    .order("name");

  return (
    <DevelopersTable
      developers={developers ?? []}
      isAdmin={isAdmin}
    />
  );
}
