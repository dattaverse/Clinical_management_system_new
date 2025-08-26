/*
  # Add admin functions for doctor management

  1. Functions
    - `get_all_doctors_for_admin()` - Allows admins to fetch all doctors
    - `create_doctor_as_admin()` - Allows admins to create new doctors

  2. Security
    - Functions check if current user is an admin
    - Only admins can execute these functions
*/

-- Function to check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user exists in admins table
  RETURN EXISTS (
    SELECT 1 FROM admins 
    WHERE user_id = auth.uid()
  );
END;
$$;

-- Function for admins to get all doctors
CREATE OR REPLACE FUNCTION get_all_doctors_for_admin()
RETURNS TABLE (
  id uuid,
  email text,
  name text,
  country text,
  phone text,
  timezone text,
  subscription_plan subscription_plan_type,
  ai_minutes_used integer,
  msg_quota_used integer,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Return all doctors
  RETURN QUERY
  SELECT 
    d.id,
    d.email,
    d.name,
    d.country,
    d.phone,
    d.timezone,
    d.subscription_plan,
    d.ai_minutes_used,
    d.msg_quota_used,
    d.created_at
  FROM doctors d
  ORDER BY d.created_at DESC;
END;
$$;

-- Function for admins to create doctors
CREATE OR REPLACE FUNCTION create_doctor_as_admin(
  doctor_id uuid,
  doctor_email text,
  doctor_name text,
  doctor_phone text,
  doctor_country text,
  doctor_timezone text,
  doctor_subscription_plan subscription_plan_type
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_doctor_id uuid;
BEGIN
  -- Check if current user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Insert new doctor
  INSERT INTO doctors (
    id,
    email,
    name,
    phone,
    country,
    timezone,
    subscription_plan,
    ai_minutes_used,
    msg_quota_used
  ) VALUES (
    doctor_id,
    doctor_email,
    doctor_name,
    doctor_phone,
    doctor_country,
    doctor_timezone,
    doctor_subscription_plan,
    0,
    0
  ) RETURNING id INTO new_doctor_id;

  RETURN new_doctor_id;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_doctors_for_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION create_doctor_as_admin(uuid, text, text, text, text, text, subscription_plan_type) TO authenticated;