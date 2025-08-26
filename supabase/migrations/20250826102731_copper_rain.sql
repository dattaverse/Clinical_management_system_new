/*
  # Create doctors table

  1. New Tables
    - `doctors`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `country` (text)
      - `phone` (text)
      - `timezone` (text)
      - `subscription_plan` (enum: starter, pro, pro_plus)
      - `ai_minutes_used` (integer, default 0)
      - `msg_quota_used` (integer, default 0)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `doctors` table
    - Add policy for authenticated users to read/update their own data
*/

CREATE TYPE subscription_plan_type AS ENUM ('starter', 'pro', 'pro_plus');

CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  country text NOT NULL DEFAULT 'US',
  phone text NOT NULL,
  timezone text NOT NULL DEFAULT 'UTC',
  subscription_plan subscription_plan_type NOT NULL DEFAULT 'starter',
  ai_minutes_used integer NOT NULL DEFAULT 0,
  msg_quota_used integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can read own data"
  ON doctors
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Doctors can update own data"
  ON doctors
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);