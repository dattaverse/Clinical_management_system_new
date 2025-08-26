/*
  # Fix RLS Policies for Admins and Doctors Tables

  1. Drop all existing policies that are causing infinite recursion
  2. Create new simplified policies that avoid circular dependencies
  3. Ensure proper access control without recursion issues

  ## Changes Made
  - Drop all existing policies on admins and doctors tables
  - Create simple, non-recursive policies
  - Allow authenticated users to manage their own records
  - Allow service role to bypass RLS for admin operations
*/

-- Drop all existing policies on admins table
DROP POLICY IF EXISTS "Admins can read own data" ON admins;
DROP POLICY IF EXISTS "Admins can update own data" ON admins;
DROP POLICY IF EXISTS "Allow admin creation" ON admins;
DROP POLICY IF EXISTS "Admins can manage all doctors" ON doctors;

-- Drop all existing policies on doctors table
DROP POLICY IF EXISTS "Doctors can read own data" ON doctors;
DROP POLICY IF EXISTS "Doctors can update own data" ON doctors;
DROP POLICY IF EXISTS "Allow doctor profile creation" ON doctors;
DROP POLICY IF EXISTS "Admins can manage all doctors" ON doctors;

-- Create simple policies for admins table
CREATE POLICY "admins_select_own" ON admins
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "admins_insert_own" ON admins
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "admins_update_own" ON admins
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create simple policies for doctors table
CREATE POLICY "doctors_select_own" ON doctors
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "doctors_insert_own" ON doctors
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "doctors_update_own" ON doctors
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Allow service role to bypass RLS for admin operations
CREATE POLICY "service_role_all_access_admins" ON admins
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_role_all_access_doctors" ON doctors
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);