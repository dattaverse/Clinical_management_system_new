import React from 'react';
import { X, FileText, User, Building2, Calendar, Download, Send, Mail, Phone, Printer } from 'lucide-react';
import type { Prescription } from '../../types';

interface ViewPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: Prescription;
}

const ViewPrescriptionModal: React.FC<ViewPrescriptionModalProps> = ({ 
  isOpen, 
  onClose, 
  prescription 
}) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download the PDF
    console.log('Downloading prescription PDF...');
    alert('PDF download would start here');
  };

  const handleSendEmail = () => {
    // In a real implementation, this would send the prescription via email
    console.log('Sending prescription via email...');
    alert('Prescription would be sent via email');
  };

  const handleSendSMS = () => {
    // In a real implementation, this would send the prescription via SMS
    console.log('Sending prescription via SMS...');
    alert('Prescription notification would be sent via SMS');
  };

  const handlePrint = () => {
    // In a real implementation, this would open the print dialog
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Prescription Details</h2>
                <p className="text-sm text-gray-500">View and manage prescription</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadPDF}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Download PDF"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                title="Print"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Information */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Patient Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">Name:</span>
                <span className="ml-2 text-blue-700">
                  {prescription.patient ? 
                    `${prescription.patient.first_name} ${prescription.patient.last_name}` : 
                    'Unknown Patient'
                  }
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Phone:</span>
                <span className="ml-2 text-blue-700">{prescription.patient?.phone}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Email:</span>
                <span className="ml-2 text-blue-700">{prescription.patient?.email}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">DOB:</span>
                <span className="ml-2 text-blue-700">
                  {prescription.patient?.dob ? new Date(prescription.patient.dob).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Prescription Information */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <FileText className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Prescription Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-800">Prescription ID:</span>
                <span className="ml-2 text-green-700 font-mono">{prescription.id}</span>
              </div>
              <div>
                <span className="font-medium text-green-800">Signed By:</span>
                <span className="ml-2 text-green-700">{prescription.signed_by}</span>
              </div>
              <div>
                <span className="font-medium text-green-800">Date Signed:</span>
                <span className="ml-2 text-green-700">{formatDate(prescription.signed_ts)}</span>
              </div>
              <div>
                <span className="font-medium text-green-800">Created:</span>
                <span className="ml-2 text-green-700">{formatDate(prescription.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Medications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Medications</span>
            </h3>
            <div className="space-y-4">
              {prescription.rx_json.medications.map((medication, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{medication.name}</h4>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {medication.dosage}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Frequency:</span>
                      <span className="ml-2 text-gray-600">{medication.frequency}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Duration:</span>
                      <span className="ml-2 text-gray-600">{medication.duration || 'As needed'}</span>
                    </div>
                    {medication.notes && (
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-700">Notes:</span>
                        <span className="ml-2 text-gray-600 italic">{medication.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          {prescription.rx_json.instructions && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-gray-700">{prescription.rx_json.instructions}</p>
              </div>
            </div>
          )}

          {/* Follow-up */}
          {prescription.rx_json.follow_up && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Follow-up</h3>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-gray-700">{prescription.rx_json.follow_up}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleDownloadPDF}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Generate & Download PDF</span>
            </button>
            <button
              onClick={handleSendEmail}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg"
            >
              <Mail className="w-4 h-4" />
              <span>Send via Email</span>
            </button>
            <button
              onClick={handleSendSMS}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg"
            >
              <Phone className="w-4 h-4" />
              <span>Send via SMS</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPrescriptionModal;