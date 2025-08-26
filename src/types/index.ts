export interface Doctor {
  id: string;
  email: string;
  name: string;
  country: string;
  phone: string;
  timezone: string;
  subscription_plan: 'starter' | 'pro' | 'pro_plus';
  ai_minutes_used: number;
  msg_quota_used: number;
  created_at: string;
}

export interface Admin {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
  permissions: {
    view_all: boolean;
    manage_doctors: boolean;
    view_logs: boolean;
    compliance: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Clinic {
  id: string;
  doctor_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  hours_json: {
    monday: { open: string; close: string; };
    tuesday: { open: string; close: string; };
    wednesday: { open: string; close: string; };
    thursday: { open: string; close: string; };
    friday: { open: string; close: string; };
    saturday: { open: string; close: string; };
    sunday: { open: string; close: string; };
  };
  created_at: string;
}

export interface Patient {
  id: string;
  doctor_id: string;
  clinic_id: string;
  first_name: string;
  last_name: string;
  dob: string;
  sex: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  consent_flags_json: {
    messaging: boolean;
    marketing: boolean;
    voice_calls: boolean;
  };
  tags: string[];
  created_at: string;
  vitals?: {
    height: number;
    weight: number;
    blood_pressure: string;
    temperature: number;
  };
  chief_complaint?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  doctor_id: string;
  clinic_id: string;
  patient_id: string;
  start_ts: string;
  end_ts: string;
  status: 'booked' | 'cancelled' | 'no_show' | 'complete';
  channel: 'voice' | 'web' | 'manual';
  notes?: string;
  patient?: Patient;
  clinic?: Clinic;
}

export interface Prescription {
  id: string;
  doctor_id: string;
  clinic_id: string;
  patient_id: string;
  rx_json: {
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      notes?: string;
    }>;
    instructions: string;
    follow_up: string;
  };
  pdf_url?: string;
  signed_by: string;
  signed_ts: string;
  patient?: Patient;
}

export interface Message {
  id: string;
  doctor_id: string;
  patient_id: string;
  channel: 'whatsapp' | 'telegram' | 'sms' | 'email';
  template_id?: string;
  payload_json: any;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sent_ts: string;
  patient?: Patient;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: {
    clinics: number;
    patients: number;
    ai_minutes: number;
    messages: number;
    marketing: boolean;
    video_length: number;
    priority_support: boolean;
  };
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface VoiceAgentLog {
  id: string;
  doctor_id: string;
  patient_id?: string;
  call_id: string;
  phone_number: string;
  call_type: 'inbound' | 'outbound';
  status: 'answered' | 'missed' | 'failed' | 'completed';
  duration_seconds: number;
  transcript?: string;
  ai_confidence_score?: number;
  actions_taken: any[];
  created_at: string;
  ended_at?: string;
  patient?: Patient;
}

export interface ComplianceReport {
  id: string;
  doctor_id: string;
  report_type: 'hipaa' | 'security' | 'audit' | 'backup';
  status: 'compliant' | 'warning' | 'violation' | 'pending';
  details: any;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  created_at: string;
  resolved_at?: string;
  doctor?: Doctor;
}
</parameter>