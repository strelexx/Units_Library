"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type LocationOption = { id: string; name: string };

type LocationLevel = "city" | "community" | "sub_community" | "building";

type LocationValue = {
  level: LocationLevel;
  cityId?: string;
  communityId?: string;
  subCommunityId?: string;
  buildingId?: string;
};

export function LocationCascadingSelect({
  onChange,
  minLevel,
}: {
  onChange: (value: LocationValue | null) => void;
  minLevel?: LocationLevel;
}) {
  const supabase = createClient();

  const [cities, setCities] = useState<LocationOption[]>([]);
  const [communities, setCommunities] = useState<LocationOption[]>([]);
  const [subCommunities, setSubCommunities] = useState<LocationOption[]>([]);
  const [buildings, setBuildings] = useState<LocationOption[]>([]);

  const [cityId, setCityId] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [subCommunityId, setSubCommunityId] = useState("");
  const [buildingId, setBuildingId] = useState("");

  useEffect(() => {
    supabase
      .from("cities")
      .select("id, name")
      .eq("status", "active")
      .order("sort_order")
      .then(({ data }) => setCities(data ?? []));
  }, []);

  useEffect(() => {
    setCommunityId("");
    setSubCommunityId("");
    setBuildingId("");
    setCommunities([]);
    setSubCommunities([]);
    setBuildings([]);
    if (cityId) {
      supabase
        .from("communities")
        .select("id, name")
        .eq("city_id", cityId)
        .eq("status", "active")
        .order("sort_order")
        .then(({ data }) => setCommunities(data ?? []));
    }
  }, [cityId]);

  useEffect(() => {
    setSubCommunityId("");
    setBuildingId("");
    setSubCommunities([]);
    setBuildings([]);
    if (communityId) {
      supabase
        .from("sub_communities")
        .select("id, name")
        .eq("community_id", communityId)
        .eq("status", "active")
        .order("sort_order")
        .then(({ data }) => setSubCommunities(data ?? []));
    }
  }, [communityId]);

  useEffect(() => {
    setBuildingId("");
    setBuildings([]);
    if (subCommunityId) {
      supabase
        .from("buildings")
        .select("id, name")
        .eq("sub_community_id", subCommunityId)
        .eq("status", "active")
        .order("sort_order")
        .then(({ data }) => setBuildings(data ?? []));
    }
  }, [subCommunityId]);

  const emitChange = useCallback(
    (cId: string, comId: string, scId: string, bId: string) => {
      if (bId) {
        onChange({ level: "building", cityId: cId, communityId: comId, subCommunityId: scId, buildingId: bId });
      } else if (scId && (!minLevel || minLevel !== "building")) {
        onChange({ level: "sub_community", cityId: cId, communityId: comId, subCommunityId: scId });
      } else if (comId && (!minLevel || !["building", "sub_community"].includes(minLevel))) {
        onChange({ level: "community", cityId: cId, communityId: comId });
      } else if (cId && (!minLevel || minLevel === "city")) {
        onChange({ level: "city", cityId: cId });
      } else {
        onChange(null);
      }
    },
    [onChange, minLevel]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
        <select
          value={cityId}
          onChange={(e) => {
            setCityId(e.target.value);
            emitChange(e.target.value, "", "", "");
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select city...</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Community</label>
        <select
          value={communityId}
          onChange={(e) => {
            setCommunityId(e.target.value);
            emitChange(cityId, e.target.value, "", "");
          }}
          disabled={!cityId}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select community...</option>
          {communities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Community</label>
        <select
          value={subCommunityId}
          onChange={(e) => {
            setSubCommunityId(e.target.value);
            emitChange(cityId, communityId, e.target.value, "");
          }}
          disabled={!communityId}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select sub-community...</option>
          {subCommunities.map((sc) => (
            <option key={sc.id} value={sc.id}>{sc.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
        <select
          value={buildingId}
          onChange={(e) => {
            setBuildingId(e.target.value);
            emitChange(cityId, communityId, subCommunityId, e.target.value);
          }}
          disabled={!subCommunityId}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select building...</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
