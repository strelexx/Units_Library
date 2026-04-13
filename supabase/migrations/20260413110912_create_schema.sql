-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM ('admin', 'advisor');

CREATE TYPE unit_status AS ENUM ('available', 'listed', 'private', 'archived');

CREATE TYPE property_type AS ENUM (
  'apartment', 'townhouse', 'villa', 'hotel_apartment',
  'plot', 'shop', 'warehouse', 'farm'
);

CREATE TYPE bedroom_count AS ENUM (
  'studio', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'
);

CREATE TYPE lead_source AS ENUM (
  'direct', 'referral', 'website', 'social_media',
  'cold_call', 'walk_in', 'event', 'other'
);

CREATE TYPE location_status AS ENUM ('active', 'inactive');

-- ============================================================
-- LOCATION TABLES (4-level hierarchy)
-- ============================================================

-- CITIES
CREATE TABLE cities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  name_ar     TEXT,
  slug        TEXT NOT NULL UNIQUE,
  country     TEXT NOT NULL DEFAULT 'UAE',
  status      location_status NOT NULL DEFAULT 'active',
  latitude    NUMERIC(10, 7),
  longitude   NUMERIC(10, 7),
  description TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cities_slug ON cities (slug);
CREATE INDEX idx_cities_status ON cities (status);

-- COMMUNITIES
CREATE TABLE communities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  name_ar     TEXT,
  slug        TEXT NOT NULL,
  city_id     UUID NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  status      location_status NOT NULL DEFAULT 'active',
  latitude    NUMERIC(10, 7),
  longitude   NUMERIC(10, 7),
  description TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (city_id, slug)
);

CREATE INDEX idx_communities_city ON communities (city_id);
CREATE INDEX idx_communities_slug ON communities (slug);

-- SUB-COMMUNITIES
CREATE TABLE sub_communities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  name_ar       TEXT,
  slug          TEXT NOT NULL,
  community_id  UUID NOT NULL REFERENCES communities(id) ON DELETE RESTRICT,
  city_id       UUID NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  status        location_status NOT NULL DEFAULT 'active',
  latitude      NUMERIC(10, 7),
  longitude     NUMERIC(10, 7),
  description   TEXT,
  sort_order    INT NOT NULL DEFAULT 0,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (community_id, slug)
);

CREATE INDEX idx_sub_communities_community ON sub_communities (community_id);
CREATE INDEX idx_sub_communities_city ON sub_communities (city_id);

-- BUILDINGS / PROPERTIES
CREATE TABLE buildings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  name_ar             TEXT,
  slug                TEXT NOT NULL,
  sub_community_id    UUID NOT NULL REFERENCES sub_communities(id) ON DELETE RESTRICT,
  community_id        UUID NOT NULL REFERENCES communities(id) ON DELETE RESTRICT,
  city_id             UUID NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  status              location_status NOT NULL DEFAULT 'active',
  latitude            NUMERIC(10, 7),
  longitude           NUMERIC(10, 7),
  total_floors        INT,
  year_built          INT,
  description         TEXT,
  sort_order          INT NOT NULL DEFAULT 0,
  metadata            JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (sub_community_id, slug)
);

CREATE INDEX idx_buildings_sub_community ON buildings (sub_community_id);
CREATE INDEX idx_buildings_community ON buildings (community_id);
CREATE INDEX idx_buildings_city ON buildings (city_id);

-- ============================================================
-- DEVELOPERS
-- ============================================================

CREATE TABLE developers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  website     TEXT,
  logo_url    TEXT,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- OWNERS
-- ============================================================

CREATE TABLE owners (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  last_name       TEXT,
  phone_numbers   TEXT[] NOT NULL DEFAULT '{}',
  emails          TEXT[] NOT NULL DEFAULT '{}',
  source          lead_source,
  source_details  TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_owners_name ON owners (name, last_name);
CREATE INDEX idx_owners_phones ON owners USING GIN (phone_numbers);
CREATE INDEX idx_owners_emails ON owners USING GIN (emails);

-- ============================================================
-- USERS (linked to Supabase Auth)
-- ============================================================

CREATE TABLE users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        user_role NOT NULL DEFAULT 'advisor',
  name        TEXT NOT NULL,
  team        TEXT,
  email       TEXT NOT NULL UNIQUE,
  avatar_url  TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_email ON users (email);

-- ============================================================
-- USER-LOCATION ASSIGNMENTS (many-to-many, any hierarchy level)
-- ============================================================

CREATE TABLE user_locations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  city_id           UUID REFERENCES cities(id) ON DELETE CASCADE,
  community_id      UUID REFERENCES communities(id) ON DELETE CASCADE,
  sub_community_id  UUID REFERENCES sub_communities(id) ON DELETE CASCADE,
  building_id       UUID REFERENCES buildings(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Exactly one of the four location FKs must be non-null
  CONSTRAINT one_location_level CHECK (
    (
      (city_id IS NOT NULL)::int +
      (community_id IS NOT NULL)::int +
      (sub_community_id IS NOT NULL)::int +
      (building_id IS NOT NULL)::int
    ) = 1
  ),
  -- Prevent duplicate assignments
  UNIQUE (user_id, city_id, community_id, sub_community_id, building_id)
);

CREATE INDEX idx_user_locations_user ON user_locations (user_id);
CREATE INDEX idx_user_locations_city ON user_locations (city_id);
CREATE INDEX idx_user_locations_community ON user_locations (community_id);
CREATE INDEX idx_user_locations_sub_community ON user_locations (sub_community_id);
CREATE INDEX idx_user_locations_building ON user_locations (building_id);

-- ============================================================
-- UNITS (core entity)
-- ============================================================

CREATE TABLE units (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_number   TEXT NOT NULL,
  building_id   UUID NOT NULL REFERENCES buildings(id) ON DELETE RESTRICT,
  owner_id      UUID REFERENCES owners(id) ON DELETE SET NULL,
  status        unit_status NOT NULL DEFAULT 'available',
  type          property_type NOT NULL,
  bedrooms      bedroom_count,
  bathrooms     INT CHECK (bathrooms >= 0),
  living_area   NUMERIC(12, 2),
  total_area    NUMERIC(12, 2),
  plot_size     NUMERIC(12, 2),
  p_number      TEXT UNIQUE,
  value         NUMERIC(15, 2),
  developer_id  UUID REFERENCES developers(id) ON DELETE SET NULL,
  floor         INT,
  levels        INT DEFAULT 1,
  ref_id        TEXT UNIQUE,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (building_id, unit_number)
);

CREATE INDEX idx_units_building ON units (building_id);
CREATE INDEX idx_units_status ON units (status);
CREATE INDEX idx_units_type ON units (type);
CREATE INDEX idx_units_owner ON units (owner_id);
CREATE INDEX idx_units_developer ON units (developer_id);
CREATE INDEX idx_units_ref_id ON units (ref_id);
CREATE INDEX idx_units_p_number ON units (p_number);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'cities', 'communities', 'sub_communities', 'buildings',
    'developers', 'owners', 'users', 'units'
  ]
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
      t
    );
  END LOOP;
END;
$$;

-- ============================================================
-- HELPER VIEW: flattened building locations
-- ============================================================

CREATE VIEW building_locations AS
SELECT
  b.id AS building_id,
  b.sub_community_id,
  sc.community_id,
  c.city_id
FROM buildings b
JOIN sub_communities sc ON b.sub_community_id = sc.id
JOIN communities c ON sc.community_id = c.id;
