"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { DeveloperForm } from "./developer-form";
import { deleteDeveloper } from "./actions";

type Developer = {
  id: string;
  name: string;
  website: string | null;
};

export function DevelopersTable({
  developers,
  isAdmin,
}: {
  developers: Developer[];
  isAdmin: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editDeveloper, setEditDeveloper] = useState<Developer | undefined>();
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = developers.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(dev: Developer) {
    if (!confirm(`Delete "${dev.name}"?`)) return;
    setDeleting(dev.id);
    const result = await deleteDeveloper(dev.id);
    if (result.error) {
      alert(result.error);
    }
    setDeleting(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Developers</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search developers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          {isAdmin && (
            <button
              onClick={() => {
                setEditDeveloper(undefined);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              <Plus size={16} />
              Add Developer
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm text-gray-900">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Website</th>
              {isAdmin && (
                <th className="text-right px-4 py-3 font-medium text-gray-600 w-24">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length > 0 ? (
              filtered.map((dev) => (
                <tr key={dev.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{dev.name}</td>
                  <td className="px-4 py-3">
                    {dev.website ? (
                      <span className="text-blue-600">{dev.website}</span>
                    ) : (
                      "-"
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditDeveloper(dev);
                            setShowForm(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(dev)}
                          disabled={deleting === dev.id}
                          className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 3 : 2} className="px-4 py-8 text-center text-gray-500">
                  {search ? "No developers match your search." : "No developers found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-sm text-gray-500">
        {filtered.length} of {developers.length} developers
      </div>

      {showForm && (
        <DeveloperForm
          developer={editDeveloper}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
