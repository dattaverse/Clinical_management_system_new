/*
  # Create subscription plans table

  1. New Tables
    - `subscription_plans`
      - `id` (text, primary key)
      - `name` (text)
      - `price` (numeric)
      - `features` (jsonb for plan features)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `subscription_plans` table
    - Add policy for public read access (plans are public info)

  3. Initial Data
    - Insert default subscription plans
*/

CREATE TABLE IF NOT EXISTS subscription_plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  features jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read subscription plans"
  ON subscription_plans
  FOR SELECT
  TO public
  USING (true);

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, price, features) VALUES
('starter', 'Starter', 29.00, '{
  "clinics": 1,
  "patients": 100,
  "ai_minutes": 500,
  "messages": 1000,
  "marketing": false,
  "video_length": 30,
  "priority_support": false
}'),
('pro', 'Pro', 79.00, '{
  "clinics": 3,
  "patients": 500,
  "ai_minutes": 2000,
  "messages": 5000,
  "marketing": true,
  "video_length": 60,
  "priority_support": true
}'),
('pro_plus', 'Pro Plus', 149.00, '{
  "clinics": 10,
  "patients": 2000,
  "ai_minutes": 5000,
  "messages": 15000,
  "marketing": true,
  "video_length": 120,
  "priority_support": true
}')
ON CONFLICT (id) DO NOTHING;