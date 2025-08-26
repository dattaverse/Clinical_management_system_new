/*
  # Create patients table

  1. New Tables
    - `patients`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, foreign key to doctors)
      - `clinic_id` (uuid, foreign key to clinics)
      - `first_name` (text)
      - `last_name` (text)
      - `dob` (date)
      - `sex` (enum: male, female, other)
      - `phone` (text)
      - `email` (text)
      - `consent_flags_json` (jsonb for consent preferences)
      - `tags` (text array)
      - `vitals` (jsonb for vital signs)
      - `chief_complaint` (text)
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `patients` table
    - Add policies for doctors to manage their own patients
*/

CREATE TYPE sex_type AS ENUM ('male', 'female', 'other');

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  dob date NOT NULL,
  sex sex_type NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  consent_flags_json jsonb NOT NULL DEFAULT '{
    "messaging": true,
    "marketing": false,
    "voice_calls": true
  }',
  tags text[] DEFAULT '{}',
  vitals jsonb DEFAULT '{}',
  chief_complaint text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can manage own patients"
  ON patients
  FOR ALL
  TO authenticated
  USING (doctor_id = auth.uid());

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_patients_doctor_id ON patients(doctor_id);
CREATE INDEX IF NOT EXISTS idx_patients_clinic_id ON patients(clinic_id);