"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { updateUser } from "../actions";
import { LocationCascadingSelect } from "@/components/locations/location-cascading-select";

type LocationAssignment = {
  id?: string;
  level: string;
  cityId?: string;
  communityId?: string;
  subCommunityId?: string;
  buildingId?: string;
  label?: string;
};

type InitialData = {
  firstName: string;
  lastName: string;
  email: string;
  team: string;
  role: "admin" | "advisor";
  isActive: boolean;
  locations: LocationAssignment[];
};

export function UserEditForm({
  userId,
  initialData,
}: {
  userId: string;
  initialData: InitialData;
}) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(initialData.firstName);
  const [lastName, setLastName] = useState(initialData.lastName);
  const [team, setTeam] = useState(initialData.team);
  const [role, setRole] = useState<"advisor" | "admin">(initialData.role);
  const [isActive, setIsActive] = useState(initialData.isActive);
  const [locations, setLocations] = useState<LocationAssignment[]>(initialData.locations);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationAssignment | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function addLocation() {
    if (!currentLocation) return;
    setLocations((prev) => [...prev, currentLocation]);
    setCurrentLocation(null);
    setShowLocationPicker(false);
  }

  function removeLocation(index: number) {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await updateUser(userId, {
      firstName,
      lastName,
      team,
      role,
      isActive,
      locations,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/dashboard/users");
      router.refresh();
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/users"
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-2"
        >
          <ArrowLeft size={16} />
          Back to Users
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={initialData.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
              <input
                type="text"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "advisor")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="advisor">Advisor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded"
              />
              Active (uncheck to disable user)
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Location Assignments</label>
              <button
                type="button"
                onClick={() => setShowLocationPicker(true)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus size={14} />
                Add Location
              </button>
            </div>

            {locations.length > 0 ? (
              <div className="space-y-2">
                {locations.map((loc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900"
                  >
                    <span>{loc.label}</span>
                    <button
                      type="button"
                      onClick={() => removeLocation(i)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No locations assigned. {role === "advisor" ? "Advisors need at least one location to access units." : "Admins have full access regardless of location assignments."}
              </p>
            )}
          </div>

          {showLocationPicker && (
            <div className="border border-blue-200 rounded-md p-4 bg-blue-50/50">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Select Location</h3>
              <LocationCascadingSelect
                onChange={(value) => {
                  if (value) {
                    setCurrentLocation({
                      ...value,
                      label: buildLocationLabel(),
                    });
                  } else {
                    setCurrentLocation(null);
                  }
                }}
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowLocationPicker(false);
                    setCurrentLocation(null);
                  }}
                  className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addLocation}
                  disabled={!currentLocation}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add This Location
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/dashboard/users"
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function buildLocationLabel(): string {
  const selects = document.querySelectorAll<HTMLSelectElement>(
    ".border-blue-200 select"
  );
  const parts: string[] = [];
  selects.forEach((select) => {
    if (select.value) {
      const option = select.options[select.selectedIndex];
      if (option && option.text !== select.options[0]?.text) {
        parts.push(option.text);
      }
    }
  });
  return parts.length > 0 ? parts.join(" > ") : "Selected location";
}
