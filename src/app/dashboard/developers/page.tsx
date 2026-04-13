import { createClient } from "@/lib/supabase/server";

export default async function DevelopersPage() {
  const supabase = await createClient();

  const { data: developers } = await supabase
    .from("developers")
    .select("*")
    .order("name");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Developers</h1>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Website</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {developers && developers.length > 0 ? (
              developers.map((dev) => (
                <tr key={dev.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{dev.name}</td>
                  <td className="px-4 py-3">{dev.website ?? "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                  No developers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
