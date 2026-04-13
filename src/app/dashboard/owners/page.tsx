import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function OwnersPage() {
  const supabase = await createClient();

  const { data: owners } = await supabase
    .from("owners")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Owners</h1>
        <Link
          href="/dashboard/owners/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          Add Owner
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm text-gray-900">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {owners && owners.length > 0 ? (
              owners.map((owner) => (
                <tr key={owner.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/owners/${owner.id}`} className="text-blue-600 hover:underline">
                      {owner.name} {owner.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{owner.phone_numbers?.[0] ?? "-"}</td>
                  <td className="px-4 py-3">{owner.emails?.[0] ?? "-"}</td>
                  <td className="px-4 py-3 capitalize">{owner.source?.replace("_", " ") ?? "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No owners found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
