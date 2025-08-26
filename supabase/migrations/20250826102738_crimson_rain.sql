/*
  # Create clinics table

  1. New Tables
    - `clinics`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, foreign key to doctors)
      - `name` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `country` (text)
      - `phone` (text)
      - `hours_json` (jsonb for operating hours)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `clinics` table
    - Add policies for doctors to manage their own clinics
*/

CREATE TABLE IF NOT EXISTS clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  country text NOT NULL,
  phone text NOT NULL,
  hours_json jsonb NOT NULL DEFAULT '{
    "monday": {"open": "09:00", "close": "17:00"},
    "tuesday": {"open": "09:00", "close": "17:00"},
    "wednesday": {"open": "09:00", "close": "17:00"},
    "thursday": {"open": "09:00", "close": "17:00"},
    "friday": {"open": "09:00", "close": "17:00"},
    "saturday": {"open": "09:00", "close": "13:00"},
    "sunday": {"open": "closed", "close": "closed"}
  }',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can manage own clinics"
  ON clinics
  FOR ALL
  TO authenticated
  USING (doctor_id = auth.uid());