import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing, 
  Clock, 
  User, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Play, 
  Pause, 
  Volume2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Eye,
  MessageSquare,
  FileText,
  Activity,
  TrendingUp,
  Bot,
  Settings
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useClinicContext } from '../../contexts/ClinicContext';
import type { VoiceAgentLog, Patient } from '../../types';

const VoiceAgentList: React.FC = () => {
  const { doctor } = useAuth();
  const { selectedClinic, clinics } = useClinicContext();
  const [voiceLogs, setVoiceLogs] = useState<(VoiceAgentLog & { patient?: Patient })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [callTypeFilter, setCallTypeFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState({
    isActive: true,
    callsToday: 0,
    avgDuration: 0,
    successRate: 0
  });

  useEffect(() => {
    if (doctor) {
      fetchVoiceLogs();
      fetchAgentStats();
    }
  }, [doctor, selectedClinic]);

  const fetchVoiceLogs = async () => {
    if (!doctor) return;

    try {
      if (!isSupabaseConfigured) {
        // Demo voice agent logs
        const demoLogs: (VoiceAgentLog & { patient?: Patient })[] = [
          {
            id: '1',
            doctor_id: doctor.id,
            patient_id: '1',
            call_id: 'call_001',
            phone_number: '+1 (555) 123-4567',
            call_type: 'inbound',
            status: 'completed',
            duration_seconds: 180,
            transcript: 'Patient called to schedule appointment for diabetes follow-up. AI successfully booked appointment for next Tuesday at 2:00 PM. Patient confirmed availability and provided insurance information.',
            ai_confidence_score: 0.95,
            actions_taken: [
              { action: 'schedule_appointment', timestamp: '2024-01-15T10:30:00Z', details: 'Booked for Jan 23, 2:00 PM' },
              { action: 'verify_insurance', timestamp: '2024-01-15T10:31:00Z', details: 'Insurance verified' }
            ],
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            ended_at: new Date(Date.now() - 2 * 60 * 60 * 1000 + 180 * 1000).toISOString(),
            patient: {
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
          },
          {
            id: '2',
            doctor_id: doctor.id,
            patient_id: '2',
            call_id: 'call_002',
            phone_number: '+1 (555) 987-6543',
            call_type: 'outbound',
            status: 'completed',
            duration_seconds: 120,
            transcript: 'Automated reminder call for upcoming appointment tomorrow at 10 AM. Patient confirmed attendance and requested parking information.',
            ai_confidence_score: 0.88,
            actions_taken: [
              { action: 'appointment_reminder', timestamp: '2024-01-15T14:00:00Z', details: 'Reminder sent' },
              { action: 'provide_directions', timestamp: '2024-01-15T14:01:00Z', details: 'Parking info provided' }
            ],
            created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            ended_at: new Date(Date.now() - 4 * 60 * 60 * 1000 + 120 * 1000).toISOString(),
            patient: {
              id: '2',
              doctor_id: doctor.id,
              clinic_id: '1',
              first_name: 'Sarah',
              last_name: 'Johnson',
              dob: '1990-03-22',
              sex: 'female',
              phone: '+1 (555) 987-6543',
              email: 'sarah.johnson@email.com',
              consent_flags_json: { messaging: true, marketing: true, voice_calls: true },
              tags: ['allergies'],
              created_at: '2024-01-20T14:30:00Z'
            }
          },
          {
            id: '3',
            doctor_id: doctor.id,
            patient_id: null,
            call_id: 'call_003',
            phone_number: '+1 (555) 456-7890',
            call_type: 'inbound',
            status: 'missed',
            duration_seconds: 0,
            transcript: null,
            ai_confidence_score: null,
            actions_taken: [],
            created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            ended_at: null
          },
          {
            id: '4',
            doctor_id: doctor.id,
            patient_id: '3',
            call_id: 'call_004',
            phone_number: '+1 (555) 789-0123',
            call_type: 'inbound',
            status: 'completed',
            duration_seconds: 240,
            transcript: 'Patient called with questions about medication side effects. AI provided general information and scheduled follow-up consultation with doctor.',
            ai_confidence_score: 0.92,
            actions_taken: [
              { action: 'provide_medication_info', timestamp: '2024-01-15T16:00:00Z', details: 'Side effects explained' },
              { action: 'schedule_consultation', timestamp: '2024-01-15T16:02:00Z', details: 'Follow-up scheduled' }
            ],
            created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            ended_at: new Date(Date.now() - 8 * 60 * 60 * 1000 + 240 * 1000).toISOString(),
            patient: {
              id: '3',
              doctor_id: doctor.id,
              clinic_id: '2',
              first_name: 'Emma',
              last_name: 'Wilson',
              dob: '1992-07-25',
              sex: 'female',
              phone: '+1 (555) 789-0123',
              email: 'emma.wilson@email.com',
              consent_flags_json: { messaging: true, marketing: true, voice_calls: false },
              tags: ['dermatology'],
              created_at: '2024-02-05T16:45:00Z'
            }
          },
          {
            id: '5',
            doctor_id: doctor.id,
            patient_id: '4',
            call_id: 'call_005',
            phone_number: '+1 (555) 321-0987',
            call_type: 'outbound',
            status: 'failed',
            duration_seconds: 0,
            transcript: null,
            ai_confidence_score: null,
            actions_taken: [],
            created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
            ended_at: null
          }
        ];

        // Filter by selected clinic
        const filteredLogs = selectedClinic && selectedClinic !== 'all'
          ? demoLogs.filter(log => log.patient?.clinic_id === selectedClinic)
          : demoLogs;

        setVoiceLogs(filteredLogs);
        setLoading(false);
        return;
      }

      // Fetch from database
      let query = supabase
        .from('voice_agent_logs')
        .select(`
          *,
          patients:patient_id (
            id,
            first_name,
            last_name,
            phone,
            email,
            clinic_id,
            tags
          )
        `)
        .eq('doctor_id', doctor.id);

      if (selectedClinic && selectedClinic !== 'all') {
        // Filter by clinic through patient relationship
        query = query.eq('patients.clinic_id', selectedClinic);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const formattedLogs = (data || []).map(log => ({
        ...log,
        patient: log.patients
      }));

      setVoiceLogs(formattedLogs);
    } catch (error) {
      console.error('Error fetching voice logs:', error);
      setVoiceLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentStats = async () => {
    try {
      if (!isSupabaseConfigured) {
        setAgentStatus({
          isActive: true,
          callsToday: 23,
          avgDuration: 165,
          successRate: 89
        });
        return;
      }

      // Calculate stats from database
      const today = new Date().toISOString().split('T')[0];
      
      const { data: todayCalls } = await supabase
        .from('voice_agent_logs')
        .select('*')
        .eq('doctor_id', doctor?.id)
        .gte('created_at', `${today}T00:00:00`);

      const callsToday = todayCalls?.length || 0;
      const completedCalls = todayCalls?.filter(call => call.status === 'completed') || [];
      const avgDuration = completedCalls.length > 0 
        ? Math.round(completedCalls.reduce((sum, call) => sum + call.duration_seconds, 0) / completedCalls.length)
        : 0;
      const successRate = callsToday > 0 
        ? Math.round((completedCalls.length / callsToday) * 100)
        : 0;

      setAgentStatus({
        isActive: true,
        callsToday,
        avgDuration,
        successRate
      });
    } catch (error) {
      console.error('Error fetching agent stats:', error);
    }
  };

  const filteredLogs = voiceLogs.filter(log => {
    const matchesSearch = log.patient && (
      `${log.patient.first_name} ${log.patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.phone_number.includes(searchTerm) ||
      log.call_id.toLowerCase().includes(searchTerm.toLowerCase())
    ) || log.phone_number.includes(searchTerm) || log.call_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesCallType = callTypeFilter === 'all' || log.call_type === callTypeFilter;
    
    return matchesSearch && matchesStatus && matchesCallType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'missed':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'missed':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCallTypeIcon = (type: string) => {
    return type === 'inbound' ? 
      <PhoneIncoming className="w-4 h-4" /> : 
      <PhoneOutgoing className="w-4 h-4" />;
  };

  const getCallTypeColor = (type: string) => {
    return type === 'inbound' ? 
      'bg-blue-100 text-blue-800' : 
      'bg-purple-100 text-purple-800';
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handlePlayAudio = (logId: string) => {
    if (playingAudio === logId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(logId);
      // In real implementation, this would play the actual call recording
      setTimeout(() => setPlayingAudio(null), 3000); // Auto-stop after 3 seconds for demo
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600 bg-green-100';
    if (score >= 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading voice agent logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Voice Agent</h1>
            <p className="text-gray-600 mt-1">
              AI-powered voice assistant call logs and management
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${
              agentStatus.isActive 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                agentStatus.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></div>
              <span className="font-medium">
                {agentStatus.isActive ? 'Agent Active' : 'Agent Offline'}
              </span>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Configure Agent</span>
            </button>
          </div>
        </div>

        {/* Agent Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{agentStatus.callsToday}</p>
                <p className="text-sm text-gray-600">Calls Today</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(agentStatus.avgDuration)}</p>
                <p className="text-sm text-gray-600">Avg Duration</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{agentStatus.successRate}%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredLogs.filter(log => log.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">Successful Calls</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient name, phone number, or call ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={callTypeFilter}
            onChange={(e) => setCallTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
          >
            <option value="all">All Types</option>
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
          </select>
          <button className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2 font-medium">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Voice Agent Logs */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div key={log.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    {getCallTypeIcon(log.call_type)}
                    <span className="text-white">
                      {getCallTypeIcon(log.call_type)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {log.patient ? 
                        `${log.patient.first_name} ${log.patient.last_name}` : 
                        'Unknown Caller'
                      }
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>{log.phone_number}</span>
                      <span>Call ID: {log.call_id}</span>
                      <span>{formatDateTime(log.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getCallTypeColor(log.call_type)}`}>
                    {getCallTypeIcon(log.call_type)}
                    <span className="capitalize">{log.call_type}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(log.status)}`}>
                    {getStatusIcon(log.status)}
                    <span className="capitalize">{log.status}</span>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setSelectedLog(selectedLog === log.id ? null : log.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                    {selectedLog === log.id && (
                      <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-2 w-40">
                        <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4" />
                          <span>Follow Up</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Duration</span>
                  </div>
                  <p className="text-blue-800 font-semibold">
                    {log.duration_seconds > 0 ? formatDuration(log.duration_seconds) : 'N/A'}
                  </p>
                </div>

                {log.ai_confidence_score && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Bot className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">AI Confidence</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${log.ai_confidence_score * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-semibold px-2 py-1 rounded-full ${getConfidenceColor(log.ai_confidence_score)}`}>
                        {(log.ai_confidence_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Activity className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Actions Taken</span>
                  </div>
                  <p className="text-purple-800 font-semibold">{log.actions_taken.length}</p>
                </div>
              </div>

              {/* Actions Taken */}
              {log.actions_taken.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Actions Performed:</h4>
                  <div className="space-y-2">
                    {log.actions_taken.slice(0, 3).map((action, index) => (
                      <div key={index} className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-indigo-900 capitalize">
                            {action.action.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-indigo-600">
                            {new Date(action.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        {action.details && (
                          <p className="text-sm text-indigo-700 mt-1">{action.details}</p>
                        )}
                      </div>
                    ))}
                    {log.actions_taken.length > 3 && (
                      <div className="text-center">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          +{log.actions_taken.length - 3} more actions
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Transcript */}
              {log.transcript && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Call Transcript:</span>
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-700 leading-relaxed">{log.transcript}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {log.ended_at ? 
                    `Call ended at ${formatDateTime(log.ended_at)}` : 
                    'Call in progress or incomplete'
                  }
                </div>
                <div className="flex space-x-2">
                  {log.transcript && (
                    <button 
                      onClick={() => handlePlayAudio(log.id)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                    >
                      {playingAudio === log.id ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Play Recording</span>
                        </>
                      )}
                    </button>
                  )}
                  <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                    Follow Up
                  </button>
                  <button className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No voice agent logs found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' || callTypeFilter !== 'all'
              ? 'Try adjusting your search criteria or filters.' 
              : 'Voice agent calls will appear here once patients start calling.'
            }
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-md mx-auto">
            <h4 className="font-semibold text-blue-900 mb-2">AI Voice Agent Features:</h4>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Automatic appointment scheduling</li>
              <li>• Patient information verification</li>
              <li>• Prescription refill requests</li>
              <li>• General medical inquiries</li>
              <li>• 24/7 availability</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAgentList;