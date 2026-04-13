-- ============================================================
-- Enable RLS on all tables
-- ============================================================

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper function: check if current user is admin
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- Helper function: get building IDs accessible to current user
-- ============================================================

CREATE OR REPLACE FUNCTION accessible_building_ids()
RETURNS SETOF UUID AS $$
  SELECT DISTINCT b.id
  FROM buildings b
  JOIN user_locations ul ON ul.user_id = auth.uid()
  WHERE
    ul.building_id = b.id
    OR ul.sub_community_id = b.sub_community_id
    OR ul.community_id = b.community_id
    OR ul.city_id = b.city_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- CITIES: all authenticated can read, admins can write
-- ============================================================

CREATE POLICY "Anyone can read cities"
  ON cities FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can insert cities"
  ON cities FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update cities"
  ON cities FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can delete cities"
  ON cities FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- COMMUNITIES
-- ============================================================

CREATE POLICY "Anyone can read communities"
  ON communities FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can insert communities"
  ON communities FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update communities"
  ON communities FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can delete communities"
  ON communities FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- SUB-COMMUNITIES
-- ============================================================

CREATE POLICY "Anyone can read sub_communities"
  ON sub_communities FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can insert sub_communities"
  ON sub_communities FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update sub_communities"
  ON sub_communities FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can delete sub_communities"
  ON sub_communities FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- BUILDINGS
-- ============================================================

CREATE POLICY "Anyone can read buildings"
  ON buildings FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can insert buildings"
  ON buildings FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update buildings"
  ON buildings FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can delete buildings"
  ON buildings FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- DEVELOPERS: all can read, admins can write
-- ============================================================

CREATE POLICY "Anyone can read developers"
  ON developers FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can insert developers"
  ON developers FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update developers"
  ON developers FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can delete developers"
  ON developers FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- OWNERS: admins full access; advisors read owners of accessible units
-- ============================================================

CREATE POLICY "Admins can select owners"
  ON owners FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert owners"
  ON owners FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update owners"
  ON owners FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can delete owners"
  ON owners FOR DELETE TO authenticated
  USING (is_admin());

CREATE POLICY "Advisors can read owners of accessible units"
  ON owners FOR SELECT TO authenticated
  USING (
    NOT is_admin()
    AND EXISTS (
      SELECT 1 FROM units u
      WHERE u.owner_id = owners.id
        AND u.building_id IN (SELECT accessible_building_ids())
    )
  );

-- ============================================================
-- USERS: own profile + admins see all
-- ============================================================

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can read all users"
  ON users FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert users"
  ON users FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update users"
  ON users FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can delete users"
  ON users FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- USER_LOCATIONS: admins manage; users can read own
-- ============================================================

CREATE POLICY "Users can read own location assignments"
  ON user_locations FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all user_locations"
  ON user_locations FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert user_locations"
  ON user_locations FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update user_locations"
  ON user_locations FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can delete user_locations"
  ON user_locations FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- UNITS: admins full access; advisors only accessible buildings
-- ============================================================

CREATE POLICY "Admins full access to units"
  ON units FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Advisors can read accessible units"
  ON units FOR SELECT TO authenticated
  USING (
    NOT is_admin()
    AND building_id IN (SELECT accessible_building_ids())
  );

CREATE POLICY "Advisors can insert units in accessible buildings"
  ON units FOR INSERT TO authenticated
  WITH CHECK (
    NOT is_admin()
    AND building_id IN (SELECT accessible_building_ids())
  );

CREATE POLICY "Advisors can update accessible units"
  ON units FOR UPDATE TO authenticated
  USING (
    NOT is_admin()
    AND building_id IN (SELECT accessible_building_ids())
  )
  WITH CHECK (
    NOT is_admin()
    AND building_id IN (SELECT accessible_building_ids())
  );
