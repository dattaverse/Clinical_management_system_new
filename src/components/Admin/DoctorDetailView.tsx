import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Building2, 
  Users, 
  Calendar, 
  FileText, 
  Phone, 
  Shield, 
  Activity,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Doctor, Clinic, Patient, Appointment, Prescription, VoiceAgentLog, ComplianceReport } from '../../types';

interface DoctorDetailViewProps {
  doctor: Doctor;
  onBack: () => void;
}

const DoctorDetailView: React.FC<DoctorDetailViewProps> = ({ doctor, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [voiceLogs, setVoiceLogs] = useState<VoiceAgentLog[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);

  useEffect(() => {
    fetchDoctorData();
  }, [doctor.id]);

  const fetchDoctorData = async () => {
    try {
      if (!isSupabaseConfigured) {
        // Mock data for demo
        setClinics([
          {
            id: '1',
            doctor_id: doctor.id,
            name: 'Main Medical Center',
            address: '123 Health St',
            city: 'New York',
            state: 'NY',
            country: 'US',
            phone: '+1 (555) 123-4567',
            hours_json: {
              monday: { open: '09:00', close: '17:00' },
              tuesday: { open: '09:00', close: '17:00' },
              wednesday: { open: '09:00', close: '17:00' },
              thursday: { open: '09:00', close: '17:00' },
              friday: { open: '09:00', close: '17:00' },
              saturday: { open: '09:00', close: '13:00' },
              sunday: { open: 'closed', close: 'closed' }
            },
            created_at: '2024-01-15T10:00:00Z'
          }
        ]);

        setPatients([
          {
            id: '1',
            doctor_id: doctor.id,
            clinic_id: '1',
            first_name: 'John',
            last_name: 'Smith',
            dob: '1985-06-15',
            sex: 'male',
            phone: '+1 (555) 123-4567',
            email: 'john.smith@email.com',
            consent_flags_json: { messaging: true, marketing: false, voice_calls: true },
            tags: ['diabetes', 'hypertension'],
            created_at: '2024-01-15T10:00:00Z'
          }
        ]);

        setVoiceLogs([
          {
            id: '1',
            doctor_id: doctor.id,
            patient_id: '1',
            call_id: 'call_001',
            phone_number: '+1 (555) 123-4567',
            call_type: 'inbound',
            status: 'completed',
            duration_seconds: 180,
            transcript: 'Patient called to schedule appointment. AI successfully booked for next Tuesday at 2 PM.',
            ai_confidence_score: 0.95,
            actions_taken: [{ action: 'schedule_appointment', timestamp: '2024-01-15T10:30:00Z' }],
            created_at: '2024-01-15T10:30:00Z',
            ended_at: '2024-01-15T10:33:00Z'
          }
        ]);

        setComplianceReports([
          {
            id: '1',
            doctor_id: doctor.id,
            report_type: 'hipaa',
            status: 'compliant',
            details: { last_audit: '2024-01-01', encryption_status: 'enabled' },
            risk_level: 'low',
            resolved: true,
            created_at: '2024-01-15T10:00:00Z'
          }
        ]);

        setLoading(false);
        return;
      }

      // Fetch real data from Supabase
      const [clinicsRes, patientsRes, appointmentsRes, prescriptionsRes, voiceLogsRes, complianceRes] = await Promise.all([
        supabase.from('clinics').select('*').eq('doctor_id', doctor.id),
        supabase.from('patients').select('*').eq('doctor_id', doctor.id),
        supabase.from('appointments').select('*').eq('doctor_id', doctor.id),
        supabase.from('prescriptions').select('*').eq('doctor_id', doctor.id),
        supabase.from('voice_agent_logs').select('*').eq('doctor_id', doctor.id),
        supabase.from('compliance_reports').select('*').eq('doctor_id', doctor.id)
      ]);

      setClinics(clinicsRes.data || []);
      setPatients(patientsRes.data || []);
      setAppointments(appointmentsRes.data || []);
      setPrescriptions(prescriptionsRes.data || []);
      setVoiceLogs(voiceLogsRes.data || []);
      setComplianceReports(complianceRes.data || []);

    } catch (error) {
      console.error('Error fetching doctor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'clinics', label: 'Clinics', icon: Building2 },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'voice-agent', label: 'Voice Agent', icon: Phone },
    { id: 'compliance', label: 'Compliance', icon: Shield }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'violation':
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{clinics.length}</p>
              <p className="text-sm text-gray-600">Clinics</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              <p className="text-sm text-gray-600">Patients</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              <p className="text-sm text-gray-600">Appointments</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{voiceLogs.length}</p>
              <p className="text-sm text-gray-600">Voice Calls</p>
            </div>
            <Phone className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-sm text-gray-900">{doctor.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{doctor.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <p className="mt-1 text-sm text-gray-900">{doctor.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <p className="mt-1 text-sm text-gray-900">{doctor.country}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
            <p className="mt-1 text-sm text-gray-900 capitalize">{doctor.subscription_plan.replace('_', ' ')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">AI Minutes Used</label>
            <p className="mt-1 text-sm text-gray-900">{doctor.ai_minutes_used}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClinics = () => (
    <div className="space-y-4">
      {clinics.map((clinic) => (
        <div key={clinic.id} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {clinic.address}, {clinic.city}, {clinic.state}, {clinic.country}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {clinic.phone}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Created {new Date(clinic.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-4">
      {patients.map((patient) => (
        <div key={patient.id} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {patient.first_name} {patient.last_name}
              </h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>Email: {patient.email}</p>
                <p>Phone: {patient.phone}</p>
                <p>DOB: {new Date(patient.dob).toLocaleDateString()}</p>
                <p>Sex: {patient.sex}</p>
              </div>
              {patient.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {patient.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderVoiceAgent = () => (
    <div className="space-y-4">
      {voiceLogs.map((log) => (
        <div key={log.id} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Call {log.call_id}</h3>
              <p className="text-sm text-gray-600">{log.phone_number}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                {log.status}
              </span>
              <span className="text-sm text-gray-500">
                {Math.floor(log.duration_seconds / 60)}:{(log.duration_seconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          
          {log.transcript && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Transcript</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{log.transcript}</p>
            </div>
          )}
          
          {log.ai_confidence_score && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">AI Confidence Score</h4>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${log.ai_confidence_score * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">{(log.ai_confidence_score * 100).toFixed(1)}%</span>
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            {new Date(log.created_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-4">
      {complianceReports.map((report) => (
        <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {report.report_type} Compliance
              </h3>
              <div className="mt-2 flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  report.risk_level === 'low' ? 'text-green-600 bg-green-100' :
                  report.risk_level === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                  'text-red-600 bg-red-100'
                }`}>
                  {report.risk_level} risk
                </span>
                {report.resolved ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Created: {new Date(report.created_at).toLocaleDateString()}
                {report.resolved_at && (
                  <span className="ml-4">
                    Resolved: {new Date(report.resolved_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'clinics':
        return renderClinics();
      case 'patients':
        return renderPatients();
      case 'appointments':
        return <div className="text-center py-8 text-gray-500">Appointments view coming soon</div>;
      case 'prescriptions':
        return <div className="text-center py-8 text-gray-500">Prescriptions view coming soon</div>;
      case 'voice-agent':
        return renderVoiceAgent();
      case 'compliance':
        return renderCompliance();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
          <p className="text-gray-600">{doctor.email}</p>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="min-h-96">
        {renderContent()}
      </div>
    </div>
  );
};

export default DoctorDetailView;