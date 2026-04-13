"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addDeveloper(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const website = (formData.get("website") as string) || null;

  if (!name?.trim()) {
    return { error: "Name is required" };
  }

  const { error } = await supabase.from("developers").insert({
    name: name.trim(),
    website: website?.trim() || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "A developer with this name already exists" };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard/developers");
  return { success: true };
}

export async function updateDeveloper(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const website = (formData.get("website") as string) || null;

  if (!name?.trim()) {
    return { error: "Name is required" };
  }

  const { error } = await supabase
    .from("developers")
    .update({
      name: name.trim(),
      website: website?.trim() || null,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "A developer with this name already exists" };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard/developers");
  return { success: true };
}

export async function deleteDeveloper(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("developers").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      return { error: "Cannot delete: developer is linked to units" };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard/developers");
  return { success: true };
}
