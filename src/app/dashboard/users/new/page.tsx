"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { createUser } from "../actions";
import { LocationCascadingSelect } from "@/components/locations/location-cascading-select";

type LocationAssignment = {
  level: string;
  cityId?: string;
  communityId?: string;
  subCommunityId?: string;
  buildingId?: string;
  label?: string;
};

export default function NewUserPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("");
  const [role, setRole] = useState<"advisor" | "admin">("advisor");
  const [locations, setLocations] = useState<LocationAssignment[]>([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationAssignment | null>(null);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleEmailChange(value: string) {
    setEmail(value);
    // Auto-fill domain hint
    if (value && !value.includes("@")) {
      // No auto-fill, let user type
    }
  }

  function addLocation() {
    if (!currentLocation) return;
    setLocations((prev) => [...prev, currentLocation]);
    setCurrentLocation(null);
    setShowLocationPicker(false);
  }

  function removeLocation(index: number) {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  }

  function getLocationLabel(loc: LocationAssignment): string {
    return loc.label || `${loc.level} assignment`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setWarning("");

    const result = await createUser({
      firstName,
      lastName,
      email,
      team,
      role,
      locations,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      if (result.warning) {
        setWarning(result.warning);
      }
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold mb-2">User Created Successfully</h2>
              <p className="text-gray-600 mb-1">
                <strong>{firstName} {lastName}</strong> ({email})
              </p>
              <p className="text-gray-600 mb-4">
                {warning ? (
                  <span className="text-amber-600">{warning}</span>
                ) : (
                  "Login credentials have been sent to their email."
                )}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSuccess(false);
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setTeam("");
                    setRole("advisor");
                    setLocations([]);
                    setWarning("");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Create Another User
                </button>
                <Link
                  href="/dashboard/users"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                >
                  Back to Users
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
        <h1 className="text-2xl font-bold">Create New User</h1>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email * <span className="text-gray-400 font-normal">(engelvoelkers.com only)</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="name@engelvoelkers.com"
              pattern=".+@engelvoelkers\.com$"
              title="Must be an engelvoelkers.com email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
                Team
              </label>
              <input
                id="team"
                type="text"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "advisor")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="advisor">Advisor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Location Assignments
              </label>
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
                    className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md text-sm"
                  >
                    <span>{getLocationLabel(loc)}</span>
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
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Select Location Level
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Select at least a city. You can assign at any level &mdash; the user will have access to all children below the selected level.
              </p>
              <LocationCascadingSelect
                onChange={(value) => {
                  if (value) {
                    setCurrentLocation({
                      ...value,
                      label: buildLocationLabel(value),
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
              {loading ? "Creating User..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function buildLocationLabel(loc: {
  level: string;
  cityId?: string;
  communityId?: string;
  subCommunityId?: string;
  buildingId?: string;
}): string {
  // We'll build a readable label from the select elements on the page
  // Since we don't have names here, we use the level as a fallback
  // The actual names are resolved from the DOM select elements
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
  return parts.length > 0 ? parts.join(" > ") : loc.level;
}
