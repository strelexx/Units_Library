import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserEditForm } from "./user-edit-form";

type ExistingLocation = {
  id: string;
  level: "city" | "community" | "sub_community" | "building";
  cityId?: string;
  communityId?: string;
  subCommunityId?: string;
  buildingId?: string;
  label: string;
};

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user: caller } } = await supabase.auth.getUser();
  if (!caller) redirect("/login");

  const { data: callerProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", caller.id)
    .single();

  if (callerProfile?.role !== "admin") {
    redirect("/dashboard/users");
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (!user) notFound();

  const { data: rawLocations } = await supabase
    .from("user_locations")
    .select(`
      id,
      city_id,
      community_id,
      sub_community_id,
      building_id,
      city:cities(name),
      community:communities(name, city:cities(name)),
      sub_community:sub_communities(name, community:communities(name, city:cities(name))),
      building:buildings(name, sub_community:sub_communities(name, community:communities(name, city:cities(name))))
    `)
    .eq("user_id", id);

  const locations: ExistingLocation[] = (rawLocations ?? []).map((row) => {
    const r = row as unknown as {
      id: string;
      city_id: string | null;
      community_id: string | null;
      sub_community_id: string | null;
      building_id: string | null;
      city: { name: string } | null;
      community: { name: string; city: { name: string } } | null;
      sub_community: {
        name: string;
        community: { name: string; city: { name: string } };
      } | null;
      building: {
        name: string;
        sub_community: {
          name: string;
          community: { name: string; city: { name: string } };
        };
      } | null;
    };

    if (r.building_id && r.building) {
      return {
        id: r.id,
        level: "building",
        buildingId: r.building_id,
        label: `${r.building.sub_community.community.city.name} > ${r.building.sub_community.community.name} > ${r.building.sub_community.name} > ${r.building.name}`,
      };
    }
    if (r.sub_community_id && r.sub_community) {
      return {
        id: r.id,
        level: "sub_community",
        subCommunityId: r.sub_community_id,
        label: `${r.sub_community.community.city.name} > ${r.sub_community.community.name} > ${r.sub_community.name}`,
      };
    }
    if (r.community_id && r.community) {
      return {
        id: r.id,
        level: "community",
        communityId: r.community_id,
        label: `${r.community.city.name} > ${r.community.name}`,
      };
    }
    if (r.city_id && r.city) {
      return {
        id: r.id,
        level: "city",
        cityId: r.city_id,
        label: r.city.name,
      };
    }
    return { id: r.id, level: "city", label: "Unknown" };
  });

  const [firstName, ...rest] = user.name.split(" ");
  const lastName = rest.join(" ");

  return (
    <UserEditForm
      userId={user.id}
      initialData={{
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        email: user.email,
        team: user.team ?? "",
        role: user.role,
        isActive: user.is_active,
        locations,
      }}
    />
  );
}
