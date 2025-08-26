/*
  # Create messages table

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, foreign key to doctors)
      - `patient_id` (uuid, foreign key to patients)
      - `channel` (enum: whatsapp, telegram, sms, email)
      - `template_id` (text, optional)
      - `payload_json` (jsonb for message content)
      - `status` (enum: pending, sent, delivered, failed)
      - `sent_ts` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `messages` table
    - Add policies for doctors to manage their own messages
*/

CREATE TYPE message_channel_type AS ENUM ('whatsapp', 'telegram', 'sms', 'email');
CREATE TYPE message_status_type AS ENUM ('pending', 'sent', 'delivered', 'failed');

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  channel message_channel_type NOT NULL,
  template_id text,
  payload_json jsonb NOT NULL DEFAULT '{}',
  status message_status_type NOT NULL DEFAULT 'pending',
  sent_ts timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can manage own messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (doctor_id = auth.uid());

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_doctor_id ON messages(doctor_id);
CREATE INDEX IF NOT EXISTS idx_messages_patient_id ON messages(patient_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_sent_ts ON messages(sent_ts);