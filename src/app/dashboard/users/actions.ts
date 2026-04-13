"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  let password = "";
  const bytes = crypto.randomBytes(12);
  for (let i = 0; i < 12; i++) {
    password += chars[bytes[i] % chars.length];
  }
  return password;
}

type LocationAssignment = {
  level: string;
  cityId?: string;
  communityId?: string;
  subCommunityId?: string;
  buildingId?: string;
};

export async function createUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  team: string;
  role: "admin" | "advisor";
  locations: LocationAssignment[];
}) {
  // Verify caller is admin
  const supabase = await createClient();
  const { data: { user: caller } } = await supabase.auth.getUser();
  if (!caller) return { error: "Not authenticated" };

  const { data: callerProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", caller.id)
    .single();

  if (callerProfile?.role !== "admin") {
    return { error: "Only admins can create users" };
  }

  // Validate email domain
  const emailDomain = data.email.split("@")[1]?.toLowerCase();
  if (emailDomain !== "engelvoelkers.com") {
    return { error: "Only engelvoelkers.com email addresses are allowed" };
  }

  // Validate required fields
  if (!data.firstName?.trim() || !data.lastName?.trim()) {
    return { error: "First name and last name are required" };
  }
  if (!data.email?.trim()) {
    return { error: "Email is required" };
  }

  const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;
  const password = generatePassword();

  // Create user in Supabase Auth using admin client (service role)
  const adminClient = createAdminClient();

  const { data: authUser, error: authError } =
    await adminClient.auth.admin.createUser({
      email: data.email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { name: fullName },
    });

  if (authError) {
    if (authError.message.includes("already been registered")) {
      return { error: "A user with this email already exists" };
    }
    return { error: authError.message };
  }

  // Create profile in public.users
  const { error: profileError } = await adminClient.from("users").insert({
    id: authUser.user.id,
    name: fullName,
    email: data.email.trim().toLowerCase(),
    role: data.role,
    team: data.team?.trim() || null,
  });

  if (profileError) {
    // Rollback auth user if profile creation fails
    await adminClient.auth.admin.deleteUser(authUser.user.id);
    return { error: profileError.message };
  }

  // Assign locations
  if (data.locations.length > 0) {
    const locationRows = data.locations.map((loc) => ({
      user_id: authUser.user.id,
      city_id: loc.level === "city" ? loc.cityId! : null,
      community_id: loc.level === "community" ? loc.communityId! : null,
      sub_community_id:
        loc.level === "sub_community" ? loc.subCommunityId! : null,
      building_id: loc.level === "building" ? loc.buildingId! : null,
    }));

    const { error: locError } = await adminClient
      .from("user_locations")
      .insert(locationRows);

    if (locError) {
      // Non-fatal: user is created but locations failed
      console.error("Failed to assign locations:", locError);
    }
  }

  // Send welcome email
  try {
    await sendWelcomeEmail(data.email.trim().toLowerCase(), fullName, password);
  } catch (emailError) {
    console.error("Failed to send welcome email:", emailError);
    // User is created, return success with warning
    revalidatePath("/dashboard/users");
    return {
      success: true,
      warning: "User created but welcome email could not be sent. Password: " + password,
    };
  }

  revalidatePath("/dashboard/users");
  return { success: true };
}
