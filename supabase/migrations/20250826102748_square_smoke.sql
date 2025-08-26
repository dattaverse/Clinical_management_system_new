/*
  # Create appointments table

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, foreign key to doctors)
      - `clinic_id` (uuid, foreign key to clinics)
      - `patient_id` (uuid, foreign key to patients)
      - `start_ts` (timestamp)
      - `end_ts` (timestamp)
      - `status` (enum: booked, cancelled, no_show, complete)
      - `channel` (enum: voice, web, manual)
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `appointments` table
    - Add policies for doctors to manage their own appointments
*/

CREATE TYPE appointment_status_type AS ENUM ('booked', 'cancelled', 'no_show', 'complete');
CREATE TYPE appointment_channel_type AS ENUM ('voice', 'web', 'manual');

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  start_ts timestamptz NOT NULL,
  end_ts timestamptz NOT NULL,
  status appointment_status_type NOT NULL DEFAULT 'booked',
  channel appointment_channel_type NOT NULL DEFAULT 'manual',
  notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_appointment_time CHECK (end_ts > start_ts)
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can manage own appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (doctor_id = auth.uid());

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_ts ON appointments(start_ts);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);