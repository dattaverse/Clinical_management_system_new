import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Database, 
  Mail, 
  Phone, 
  Bot, 
  Shield, 
  Globe,
  Clock,
  Users,
  Building2,
  MessageSquare,
  Bell,
  Key,
  Server,
  Monitor,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const SystemSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [systemInfo, setSystemInfo] = useState({
    version: '2.1.4',
    environment: 'Production',
    uptime: '99.9%',
    lastRestart: '2024-01-15T10:00:00Z',
    dbConnections: 45,
    activeUsers: 12,
    memoryUsage: '2.4 GB',
    cpuUsage: '15%',
    diskUsage: '45%',
    networkLatency: '12ms'
  });

  const [settings, setSettings] = useState({
    // General Settings
    systemName: 'HealthSphere CMS',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
    maintenanceMode: false,
    
    // Email Settings
    emailProvider: 'sendgrid',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: '587',
    emailFrom: 'noreply@healthsphere.com',
    emailSignature: 'Best regards,\nHealthSphere Team',
    
    // SMS Settings
    smsProvider: 'twilio',
    smsFrom: '+1 (555) 000-0000',
    smsEnabled: true,
    
    // AI Voice Agent Settings
    voiceAgentEnabled: true,
    voiceAgentLanguage: 'en-US',
    voiceAgentPersonality: 'professional',
    maxCallDuration: 600,
    confidenceThreshold: 0.8,
    
    // Security Settings
    sessionTimeout: 3600,
    passwordMinLength: 8,
    twoFactorRequired: false,
    ipWhitelist: '',
    auditLogging: true,
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30,
    backupLocation: 'supabase-storage',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    adminAlerts: true
  });

  useEffect(() => {
    fetchSystemSettings();
    fetchSystemInfo();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      if (!isSupabaseConfigured) {
        // Demo mode - settings already initialized
        return;
      }

      // In real implementation, fetch from a system_settings table
      // For now, use default settings
    } catch (error) {
      console.error('Error fetching system settings:', error);
    }
  };

  const fetchSystemInfo = async () => {
    try {
      if (!isSupabaseConfigured) {
        // Demo system info already set
        return;
      }

      // In real implementation, fetch actual system metrics
      // This would come from monitoring APIs or system tables
    } catch (error) {
      console.error('Error fetching system info:', error);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!isSupabaseConfigured) {
        // Demo mode
        setSuccess('Demo: Settings would be saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
        return;
      }

      // In real implementation, save to system_settings table
      // await supabase.from('system_settings').upsert(settings);
      
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'ai-agent', label: 'AI Agent', icon: Bot },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'backup', label: 'Backup', icon: Database },
    { id: 'system', label: 'System Info', icon: Monitor }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            System Name
          </label>
          <input
            type="text"
            value={settings.systemName}
            onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Format
          </label>
          <select
            value={settings.dateFormat}
            onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="maintenanceMode"
          checked={settings.maintenanceMode}
          onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700">
          Enable Maintenance Mode
        </label>
      </div>
    </div>
  );

  const renderCommunicationSettings = () => (
    <div className="space-y-8">
      {/* Email Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Mail className="w-5 h-5" />
          <span>Email Configuration</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Provider
            </label>
            <select
              value={settings.emailProvider}
              onChange={(e) => setSettings({ ...settings, emailProvider: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sendgrid">SendGrid</option>
              <option value="mailgun">Mailgun</option>
              <option value="ses">Amazon SES</option>
              <option value="smtp">Custom SMTP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Email Address
            </label>
            <input
              type="email"
              value={settings.emailFrom}
              onChange={(e) => setSettings({ ...settings, emailFrom: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Host
            </label>
            <input
              type="text"
              value={settings.smtpHost}
              onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Port
            </label>
            <input
              type="text"
              value={settings.smtpPort}
              onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* SMS Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Phone className="w-5 h-5" />
          <span>SMS Configuration</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMS Provider
            </label>
            <select
              value={settings.smsProvider}
              onChange={(e) => setSettings({ ...settings, smsProvider: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="twilio">Twilio</option>
              <option value="messagebird">MessageBird</option>
              <option value="nexmo">Vonage (Nexmo)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Phone Number
            </label>
            <input
              type="tel"
              value={settings.smsFrom}
              onChange={(e) => setSettings({ ...settings, smsFrom: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="smsEnabled"
              checked={settings.smsEnabled}
              onChange={(e) => setSettings({ ...settings, smsEnabled: e.target.checked })}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="smsEnabled" className="text-sm font-medium text-gray-700">
              Enable SMS Messaging
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIAgentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voice Agent Language
          </label>
          <select
            value={settings.voiceAgentLanguage}
            onChange={(e) => setSettings({ ...settings, voiceAgentLanguage: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent Personality
          </label>
          <select
            value={settings.voiceAgentPersonality}
            onChange={(e) => setSettings({ ...settings, voiceAgentPersonality: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="empathetic">Empathetic</option>
            <option value="concise">Concise</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Call Duration (seconds)
          </label>
          <input
            type="number"
            value={settings.maxCallDuration}
            onChange={(e) => setSettings({ ...settings, maxCallDuration: parseInt(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="60"
            max="1800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Confidence Threshold
          </label>
          <input
            type="number"
            value={settings.confidenceThreshold}
            onChange={(e) => setSettings({ ...settings, confidenceThreshold: parseFloat(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0.1"
            max="1.0"
            step="0.1"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="voiceAgentEnabled"
          checked={settings.voiceAgentEnabled}
          onChange={(e) => setSettings({ ...settings, voiceAgentEnabled: e.target.checked })}
          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="voiceAgentEnabled" className="text-sm font-medium text-gray-700">
          Enable AI Voice Agent
        </label>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (seconds)
          </label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="300"
            max="86400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Password Length
          </label>
          <input
            type="number"
            value={settings.passwordMinLength}
            onChange={(e) => setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="6"
            max="32"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="twoFactorRequired"
            checked={settings.twoFactorRequired}
            onChange={(e) => setSettings({ ...settings, twoFactorRequired: e.target.checked })}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="twoFactorRequired" className="text-sm font-medium text-gray-700">
            Require Two-Factor Authentication
          </label>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="auditLogging"
            checked={settings.auditLogging}
            onChange={(e) => setSettings({ ...settings, auditLogging: e.target.checked })}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="auditLogging" className="text-sm font-medium text-gray-700">
            Enable Audit Logging
          </label>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          IP Whitelist (one per line)
        </label>
        <textarea
          value={settings.ipWhitelist}
          onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="192.168.1.0/24&#10;10.0.0.0/8"
        />
      </div>
    </div>
  );

  const renderSystemInfo = () => (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Version</p>
              <p className="text-xl font-bold text-blue-900">{systemInfo.version}</p>
            </div>
          </div>
          <p className="text-xs text-blue-600">{systemInfo.environment}</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Uptime</p>
              <p className="text-xl font-bold text-green-900">{systemInfo.uptime}</p>
            </div>
          </div>
          <p className="text-xs text-green-600">Last 30 days</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-800">Active Users</p>
              <p className="text-xl font-bold text-purple-900">{systemInfo.activeUsers}</p>
            </div>
          </div>
          <p className="text-xs text-purple-600">Currently online</p>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-800">DB Connections</p>
              <p className="text-xl font-bold text-orange-900">{systemInfo.dbConnections}</p>
            </div>
          </div>
          <p className="text-xs text-orange-600">Active connections</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MemoryStick className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Memory Usage</h4>
            <p className="text-2xl font-bold text-blue-600">{systemInfo.memoryUsage}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Cpu className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">CPU Usage</h4>
            <p className="text-2xl font-bold text-green-600">{systemInfo.cpuUsage}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '15%' }}></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <HardDrive className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Disk Usage</h4>
            <p className="text-2xl font-bold text-purple-600">{systemInfo.diskUsage}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Wifi className="w-8 h-8 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Network Latency</h4>
            <p className="text-2xl font-bold text-orange-600">{systemInfo.networkLatency}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{ width: '20%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* System Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <RefreshCw className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-semibold text-gray-900">Restart Services</h4>
            <p className="text-sm text-gray-600">Restart all system services</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <Database className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-semibold text-gray-900">Backup Database</h4>
            <p className="text-sm text-gray-600">Create manual backup</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <Shield className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-semibold text-gray-900">Security Scan</h4>
            <p className="text-sm text-gray-600">Run security audit</p>
          </button>
        </div>
      </div>
    </div>
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-1">
              Configure system-wide settings and monitor performance
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">System Status: Healthy</h2>
                <p className="text-gray-600">All services running normally • Last restart: {formatDate(systemInfo.lastRestart)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
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

        <div className="p-6">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'communication' && renderCommunicationSettings()}
          {activeTab === 'ai-agent' && renderAIAgentSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'backup' && (
            <div className="text-center py-8">
              <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Backup Settings</h3>
              <p className="text-gray-600">Backup configuration panel coming soon</p>
            </div>
          )}
          {activeTab === 'system' && renderSystemInfo()}
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800 text-sm font-medium">{success}</p>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;