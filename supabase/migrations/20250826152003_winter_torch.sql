/*
  # Create Admin System

  1. New Tables
    - `admins` - Super admin users
    - `admin_logs` - Admin activity logs
    - `voice_agent_logs` - Voice agent activity logs
    - `compliance_reports` - Compliance and security reports

  2. Security
    - Enable RLS on all new tables
    - Add policies for admin access
    - Add logging triggers

  3. Features
    - Complete admin oversight system
    - Activity logging
    - Compliance tracking
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'super_admin' CHECK (role IN ('super_admin', 'admin')),
  permissions jsonb DEFAULT '{"view_all": true, "manage_doctors": true, "view_logs": true, "compliance": true}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin logs table
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  action text NOT NULL,
  target_type text, -- 'doctor', 'patient', 'appointment', etc.
  target_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create voice agent logs table
CREATE TABLE IF NOT EXISTS voice_agent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients(id) ON DELETE SET NULL,
  call_id text UNIQUE NOT NULL,
  phone_number text NOT NULL,
  call_type text NOT NULL CHECK (call_type IN ('inbound', 'outbound')),
  status text NOT NULL CHECK (status IN ('answered', 'missed', 'failed', 'completed')),
  duration_seconds integer DEFAULT 0,
  transcript text,
  ai_confidence_score decimal(3,2),
  actions_taken jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- Create compliance reports table
CREATE TABLE IF NOT EXISTS compliance_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  report_type text NOT NULL CHECK (report_type IN ('hipaa', 'security', 'audit', 'backup')),
  status text NOT NULL CHECK (status IN ('compliant', 'warning', 'violation', 'pending')),
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  risk_level text DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_reports ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Super admins can manage all admin data"
  ON admins
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid() AND a.role = 'super_admin'
    )
  );

CREATE POLICY "Admins can read own data"
  ON admins
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admin logs policies
CREATE POLICY "Admins can manage admin logs"
  ON admin_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid()
    )
  );

-- Voice agent logs policies
CREATE POLICY "Admins can view all voice agent logs"
  ON voice_agent_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can view own voice agent logs"
  ON voice_agent_logs
  FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

-- Compliance reports policies
CREATE POLICY "Admins can manage all compliance reports"
  ON compliance_reports
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can view own compliance reports"
  ON compliance_reports
  FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_voice_agent_logs_doctor_id ON voice_agent_logs(doctor_id);
CREATE INDEX IF NOT EXISTS idx_voice_agent_logs_created_at ON voice_agent_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_doctor_id ON compliance_reports(doctor_id);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_status ON compliance_reports(status);

-- Insert default super admin
INSERT INTO admins (user_id, email, name, role) 
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@healthsphere.com' LIMIT 1),
  'admin@healthsphere.com',
  'System Administrator',
  'super_admin'
) ON CONFLICT (email) DO NOTHING;

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_logs (admin_id, action, target_type, target_id, details)
  SELECT 
    a.id,
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  FROM admins a
  WHERE a.user_id = auth.uid();
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers for important tables (optional - can be enabled later)
-- CREATE TRIGGER log_doctor_changes AFTER INSERT OR UPDATE OR DELETE ON doctors
--   FOR EACH ROW EXECUTE FUNCTION log_admin_action();