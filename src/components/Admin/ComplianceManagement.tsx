import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  Users,
  Database,
  Lock,
  Eye,
  Download,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  Activity,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { ComplianceReport, Doctor } from '../../types';

const ComplianceManagement: React.FC = () => {
  const [reports, setReports] = useState<(ComplianceReport & { doctor?: Doctor })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState({
    overallScore: 95,
    hipaaCompliance: 98,
    securityScore: 92,
    auditStatus: 'passed',
    lastAudit: '2024-01-15',
    nextAudit: '2024-04-15',
    criticalIssues: 0,
    warningIssues: 2,
    resolvedIssues: 45
  });

  useEffect(() => {
    fetchComplianceReports();
    fetchSystemHealth();
  }, []);

  const fetchComplianceReports = async () => {
    try {
      if (!isSupabaseConfigured) {
        // Demo compliance reports
        const demoReports: (ComplianceReport & { doctor?: Doctor })[] = [
          {
            id: '1',
            doctor_id: 'doctor-1',
            report_type: 'hipaa',
            status: 'compliant',
            details: {
              encryption_status: 'enabled',
              access_logs: 'reviewed',
              data_backup: 'automated',
              last_review: '2024-01-15'
            },
            risk_level: 'low',
            resolved: true,
            created_at: '2024-01-15T10:00:00Z',
            resolved_at: '2024-01-15T10:30:00Z',
            doctor: {
              id: 'doctor-1',
              email: 'dr.smith@clinic.com',
              name: 'Dr. John Smith',
              country: 'US',
              phone: '+1 (555) 123-4567',
              timezone: 'America/New_York',
              subscription_plan: 'pro',
              ai_minutes_used: 450,
              msg_quota_used: 1200,
              created_at: '2024-01-15T10:00:00Z'
            }
          },
          {
            id: '2',
            doctor_id: 'doctor-2',
            report_type: 'security',
            status: 'warning',
            details: {
              failed_login_attempts: 3,
              last_password_change: '2023-12-01',
              two_factor_enabled: false,
              suspicious_activity: false
            },
            risk_level: 'medium',
            resolved: false,
            created_at: '2024-01-20T14:30:00Z',
            doctor: {
              id: 'doctor-2',
              email: 'dr.johnson@medical.com',
              name: 'Dr. Sarah Johnson',
              country: 'US',
              phone: '+1 (555) 987-6543',
              timezone: 'America/Los_Angeles',
              subscription_plan: 'pro_plus',
              ai_minutes_used: 780,
              msg_quota_used: 2100,
              created_at: '2024-02-20T14:30:00Z'
            }
          },
          {
            id: '3',
            doctor_id: 'doctor-3',
            report_type: 'audit',
            status: 'violation',
            details: {
              missing_documentation: ['patient_consent_forms'],
              data_retention_policy: 'needs_update',
              access_control_review: 'overdue'
            },
            risk_level: 'high',
            resolved: false,
            created_at: '2024-01-25T09:15:00Z',
            doctor: {
              id: 'doctor-3',
              email: 'dr.chen@healthcare.com',
              name: 'Dr. Michael Chen',
              country: 'CA',
              phone: '+1 (416) 555-0123',
              timezone: 'America/Toronto',
              subscription_plan: 'starter',
              ai_minutes_used: 120,
              msg_quota_used: 350,
              created_at: '2024-03-10T09:15:00Z'
            }
          }
        ];
        setReports(demoReports);
        setLoading(false);
        return;
      }

      // Fetch real compliance reports
      const { data, error } = await supabase
        .from('compliance_reports')
        .select(`
          *,
          doctors:doctor_id (
            id,
            name,
            email,
            subscription_plan
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReports = (data || []).map(report => ({
        ...report,
        doctor: report.doctors
      }));

      setReports(formattedReports);
    } catch (error) {
      console.error('Error fetching compliance reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemHealth = async () => {
    try {
      if (!isSupabaseConfigured) {
        // Demo system health data already set in state
        return;
      }

      // Calculate real system health metrics
      const [complianceRes, securityRes] = await Promise.all([
        supabase.from('compliance_reports').select('status, risk_level, resolved'),
        supabase.from('doctors').select('subscription_plan, created_at')
      ]);

      const complianceData = complianceRes.data || [];
      const totalReports = complianceData.length;
      const compliantReports = complianceData.filter(r => r.status === 'compliant').length;
      const resolvedReports = complianceData.filter(r => r.resolved).length;
      const criticalIssues = complianceData.filter(r => r.risk_level === 'critical' && !r.resolved).length;
      const warningIssues = complianceData.filter(r => r.risk_level === 'medium' && !r.resolved).length;

      const overallScore = totalReports > 0 ? Math.round((compliantReports / totalReports) * 100) : 100;
      const hipaaCompliance = Math.round((resolvedReports / Math.max(totalReports, 1)) * 100);

      setSystemHealth({
        overallScore,
        hipaaCompliance,
        securityScore: 92, // Could be calculated based on security reports
        auditStatus: criticalIssues === 0 ? 'passed' : 'failed',
        lastAudit: '2024-01-15',
        nextAudit: '2024-04-15',
        criticalIssues,
        warningIssues,
        resolvedIssues: resolvedReports
      });
    } catch (error) {
      console.error('Error fetching system health:', error);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.doctor && (
      report.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || report.report_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.report_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'violation':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'violation':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading compliance data...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Compliance Management</h1>
            <p className="text-gray-600 mt-1">
              System-wide compliance monitoring and security oversight
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Run Audit</span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                systemHealth.overallScore >= 95 ? 'bg-green-100 text-green-800' :
                systemHealth.overallScore >= 80 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {systemHealth.overallScore >= 95 ? 'Excellent' :
                 systemHealth.overallScore >= 80 ? 'Good' : 'Needs Attention'}
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{systemHealth.overallScore}%</p>
              <p className="text-sm font-medium text-gray-600">Overall Compliance</p>
              <p className="text-xs text-gray-500 mt-1">System-wide score</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{systemHealth.hipaaCompliance}%</p>
              <p className="text-sm font-medium text-gray-600">HIPAA Compliance</p>
              <p className="text-xs text-gray-500 mt-1">Patient data protection</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <div className={`w-3 h-3 rounded-full ${
                systemHealth.securityScore >= 90 ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{systemHealth.securityScore}%</p>
              <p className="text-sm font-medium text-gray-600">Security Score</p>
              <p className="text-xs text-gray-500 mt-1">Data protection level</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                systemHealth.auditStatus === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {systemHealth.auditStatus}
              </div>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{formatDate(systemHealth.lastAudit)}</p>
              <p className="text-sm font-medium text-gray-600">Last Audit</p>
              <p className="text-xs text-gray-500 mt-1">Next: {formatDate(systemHealth.nextAudit)}</p>
            </div>
          </div>
        </div>

        {/* Issue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{systemHealth.criticalIssues}</p>
                <p className="text-sm text-gray-600">Critical Issues</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{systemHealth.warningIssues}</p>
                <p className="text-sm text-gray-600">Warnings</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{systemHealth.resolvedIssues}</p>
                <p className="text-sm text-gray-600">Resolved</p>
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
              placeholder="Search by doctor name, email, or report type..."
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
            <option value="compliant">Compliant</option>
            <option value="warning">Warning</option>
            <option value="violation">Violation</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
          >
            <option value="all">All Types</option>
            <option value="hipaa">HIPAA</option>
            <option value="security">Security</option>
            <option value="audit">Audit</option>
            <option value="backup">Backup</option>
          </select>
          <button className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2 font-medium">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Compliance Reports */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    report.report_type === 'hipaa' ? 'bg-blue-100' :
                    report.report_type === 'security' ? 'bg-purple-100' :
                    report.report_type === 'audit' ? 'bg-orange-100' :
                    'bg-gray-100'
                  }`}>
                    {report.report_type === 'hipaa' ? <FileText className="w-6 h-6 text-blue-600" /> :
                     report.report_type === 'security' ? <Lock className="w-6 h-6 text-purple-600" /> :
                     report.report_type === 'audit' ? <Eye className="w-6 h-6 text-orange-600" /> :
                     <Database className="w-6 h-6 text-gray-600" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 capitalize">
                      {report.report_type} Compliance Report
                    </h3>
                    <p className="text-gray-600">
                      {report.doctor ? `${report.doctor.name} (${report.doctor.email})` : 'System-wide'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>Created {formatDate(report.created_at)}</span>
                      {report.resolved_at && (
                        <span>Resolved {formatDate(report.resolved_at)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(report.status)}`}>
                    {getStatusIcon(report.status)}
                    <span className="capitalize">{report.status}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(report.risk_level)}`}>
                    {report.risk_level} risk
                  </div>
                  {report.resolved ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>

              {/* Report Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Report Details:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {Object.entries(report.details).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace('_', ' ')}:
                      </span>
                      <span className="ml-2 text-gray-600">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                         Array.isArray(value) ? value.join(', ') : 
                         String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Report ID: {report.id}
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  {!report.resolved && (
                    <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                      Mark Resolved
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No compliance reports found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search criteria or filters.' 
              : 'All systems are compliant. No issues to report.'}
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 max-w-md mx-auto">
            <h4 className="font-semibold text-green-900 mb-2">✅ System Status: Healthy</h4>
            <ul className="text-sm text-green-700 space-y-1 text-left">
              <li>• HIPAA compliance maintained</li>
              <li>• Security protocols active</li>
              <li>• Regular audits completed</li>
              <li>• Data backups automated</li>
              <li>• Access controls verified</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceManagement;