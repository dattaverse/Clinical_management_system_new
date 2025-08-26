/*
  # Fix RLS Policy Issues

  1. Admin Table Policies
    - Remove infinite recursion in admin policies
    - Simplify admin role checks to avoid circular dependencies
    
  2. Doctor Table Policies  
    - Add INSERT policy for new doctor creation
    - Allow admins to create doctor profiles
    - Allow users to create their own doctor profiles

  3. Security
    - Maintain proper access control
    - Prevent unauthorized access while allowing legitimate operations
*/

-- Drop existing problematic admin policies
DROP POLICY IF EXISTS "Admins can read own data" ON admins;
DROP POLICY IF EXISTS "Super admins can manage all admin data" ON admins;

-- Create simplified admin policies without recursion
CREATE POLICY "Admins can read own data"
  ON admins
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can update own data"
  ON admins
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create a simple insert policy for admins (for initial admin creation)
CREATE POLICY "Allow admin creation"
  ON admins
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Drop existing doctor policies
DROP POLICY IF EXISTS "Doctors can read own data" ON doctors;
DROP POLICY IF EXISTS "Doctors can update own data" ON doctors;

-- Create comprehensive doctor policies
CREATE POLICY "Doctors can read own data"
  ON doctors
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Doctors can update own data"
  ON doctors
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Allow doctors to create their own profile
CREATE POLICY "Allow doctor profile creation"
  ON doctors
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Allow admins to manage all doctors (simplified check)
CREATE POLICY "Admins can manage all doctors"
  ON doctors
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );