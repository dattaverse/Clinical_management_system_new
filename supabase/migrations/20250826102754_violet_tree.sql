/*
  # Create prescriptions table

  1. New Tables
    - `prescriptions`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, foreign key to doctors)
      - `clinic_id` (uuid, foreign key to clinics)
      - `patient_id` (uuid, foreign key to patients)
      - `rx_json` (jsonb for prescription details)
      - `pdf_url` (text, optional)
      - `signed_by` (text)
      - `signed_ts` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `prescriptions` table
    - Add policies for doctors to manage their own prescriptions
*/

CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  rx_json jsonb NOT NULL DEFAULT '{
    "medications": [],
    "instructions": "",
    "follow_up": ""
  }',
  pdf_url text,
  signed_by text NOT NULL,
  signed_ts timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can manage own prescriptions"
  ON prescriptions
  FOR ALL
  TO authenticated
  USING (doctor_id = auth.uid());

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_signed_ts ON prescriptions(signed_ts);