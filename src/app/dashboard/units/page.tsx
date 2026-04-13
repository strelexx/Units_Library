import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function UnitsPage() {
  const supabase = await createClient();

  const { data: units } = await supabase
    .from("units")
    .select(`
      *,
      building:buildings(name, community:communities(name)),
      developer:developers(name)
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Units</h1>
        <Link
          href="/dashboard/units/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          Add Unit
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Unit #</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Building</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Bedrooms</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {units && units.length > 0 ? (
              units.map((unit) => (
                <tr key={unit.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/units/${unit.id}`} className="text-blue-600 hover:underline">
                      {unit.unit_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{(unit.building as Record<string, unknown>)?.name as string ?? "-"}</td>
                  <td className="px-4 py-3 capitalize">{unit.type?.replace("_", " ")}</td>
                  <td className="px-4 py-3 capitalize">{unit.bedrooms ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      unit.status === "available" ? "bg-green-100 text-green-700" :
                      unit.status === "listed" ? "bg-blue-100 text-blue-700" :
                      unit.status === "private" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {unit.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {unit.value ? `AED ${Number(unit.value).toLocaleString()}` : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No units found. Add your first unit to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
