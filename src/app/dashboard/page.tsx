import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { count: unitCount },
    { count: buildingCount },
    { count: ownerCount },
  ] = await Promise.all([
    supabase.from("units").select("*", { count: "exact", head: true }),
    supabase.from("buildings").select("*", { count: "exact", head: true }),
    supabase.from("owners").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Total Units", value: unitCount ?? 0 },
    { label: "Buildings", value: buildingCount ?? 0 },
    { label: "Owners", value: ownerCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow p-6"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
