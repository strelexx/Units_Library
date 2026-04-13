import { createClient } from "@/lib/supabase/server";

export default async function LocationsPage() {
  const supabase = await createClient();

  const [
    { data: cities },
    { data: communities },
    { data: subCommunities },
    { data: buildings },
  ] = await Promise.all([
    supabase.from("cities").select("*").order("sort_order"),
    supabase.from("communities").select("*, city:cities(name)").order("sort_order"),
    supabase.from("sub_communities").select("*, community:communities(name)").order("sort_order"),
    supabase.from("buildings").select("*, sub_community:sub_communities(name)").order("sort_order"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Locations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Cities ({cities?.length ?? 0})</h2>
          {cities && cities.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {cities.map((c) => (
                <li key={c.id} className="px-2 py-1 hover:bg-gray-50 rounded">{c.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No cities yet</p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Communities ({communities?.length ?? 0})</h2>
          {communities && communities.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {communities.map((c) => (
                <li key={c.id} className="px-2 py-1 hover:bg-gray-50 rounded">{c.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No communities yet</p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Sub-Communities ({subCommunities?.length ?? 0})</h2>
          {subCommunities && subCommunities.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {subCommunities.map((sc) => (
                <li key={sc.id} className="px-2 py-1 hover:bg-gray-50 rounded">{sc.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No sub-communities yet</p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Buildings ({buildings?.length ?? 0})</h2>
          {buildings && buildings.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {buildings.map((b) => (
                <li key={b.id} className="px-2 py-1 hover:bg-gray-50 rounded">{b.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No buildings yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
