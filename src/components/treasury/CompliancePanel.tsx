'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Upload,
  Eye,
  Download,
  Clock,
  User
} from 'lucide-react';
import { Select, Option } from '@/components/ui/Select';

export function CompliancePanel() {
  const [kycLevel, setKycLevel] = useState(1);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const complianceStats = [
    { label: 'KYC Level', value: 'Basic', status: 'active' },
    { label: 'Risk Score', value: '25/100', status: 'low' },
    { label: 'Documents', value: '3/5', status: 'pending' },
    { label: 'Last Review', value: '15 days ago', status: 'warning' },
  ];

  const documents = [
    { 
      id: '1', 
      type: 'Government ID', 
      status: 'approved', 
      uploadDate: '2024-01-10',
      expiryDate: '2025-01-10'
    },
    { 
      id: '2', 
      type: 'Proof of Address', 
      status: 'approved', 
      uploadDate: '2024-01-10',
      expiryDate: '2024-07-10'
    },
    { 
      id: '3', 
      type: 'Bank Statement', 
      status: 'pending', 
      uploadDate: '2024-01-15',
      expiryDate: null
    },
  ];

  const alerts = [
    {
      id: '1',
      type: 'warning',
      title: 'Document Expiring Soon',
      message: 'Your proof of address will expire in 30 days',
      timestamp: '2024-01-15 10:30'
    },
    {
      id: '2',
      type: 'info',
      title: 'Enhanced KYC Available',
      message: 'Upgrade to Enhanced KYC for higher transaction limits',
      timestamp: '2024-01-14 15:45'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Compliance Status</h3>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Compliant</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {complianceStats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <div className={`mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                stat.status === 'active' ? 'bg-green-100 text-green-800' :
                stat.status === 'low' ? 'bg-blue-100 text-blue-800' :
                stat.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {stat.status}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* KYC Documents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">KYC Documents</h3>
          <button
            onClick={() => setShowUploadForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <h4 className="font-medium text-gray-900 mb-4">Upload New Document</h4>
            <div className="space-y-4">
              <Select
                value=""
                onChange={() => {}}
                placeholder="Select Document Type"
              >
                <Option value="government-id">Government ID</Option>
                <Option value="passport">Passport</Option>
                <Option value="proof-address">Proof of Address</Option>
                <Option value="bank-statement">Bank Statement</Option>
                <Option value="business-registration">Business Registration</Option>
              </Select>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Drop files here or click to upload</p>
                <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
              
              <div className="flex space-x-2">
                <button className="btn-primary">Upload Document</button>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Documents List */}
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(doc.status)}
                <div>
                  <p className="font-medium text-gray-900">{doc.type}</p>
                  <p className="text-sm text-gray-500">
                    Uploaded: {doc.uploadDate}
                    {doc.expiryDate && ` • Expires: ${doc.expiryDate}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                  {doc.status}
                </span>
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-400 hover:text-blue-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-600">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Transaction Limits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Limits</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Daily Limit</p>
              <p className="text-sm text-gray-500">$8,500 used of $10,000</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">$1,500</p>
              <p className="text-sm text-gray-500">remaining</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Monthly Limit</p>
              <p className="text-sm text-gray-500">$45,200 used of $100,000</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">$54,800</p>
              <p className="text-sm text-gray-500">remaining</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Single Transaction</p>
              <p className="text-sm text-gray-500">Maximum per transaction</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">$5,000</p>
              <p className="text-sm text-gray-500">limit</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <User className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Upgrade to Enhanced KYC</p>
              <p className="text-sm text-blue-700">
                Increase your limits to $100K daily and $1M monthly by completing Enhanced KYC verification.
              </p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Start Upgrade Process →
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Compliance Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Alerts</h3>
        
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
              alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' : 'bg-blue-50 border-blue-400'
            }`}>
              <div className="flex items-start space-x-3">
                {alert.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                ) : (
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${
                    alert.type === 'warning' ? 'text-yellow-900' : 'text-blue-900'
                  }`}>
                    {alert.title}
                  </p>
                  <p className={`text-sm mt-1 ${
                    alert.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                  }`}>
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{alert.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}