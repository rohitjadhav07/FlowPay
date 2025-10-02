'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TreasuryOverview } from '@/components/treasury/TreasuryOverview';
import { PayrollManager } from '@/components/treasury/PayrollManager';
import { AutoHedging } from '@/components/treasury/AutoHedging';
import { CompliancePanel } from '@/components/treasury/CompliancePanel';

export default function TreasuryPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'payroll' | 'hedging' | 'compliance'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', description: 'Portfolio and balances' },
    { id: 'payroll', label: 'Payroll', description: 'Automated payments' },
    { id: 'hedging', label: 'Auto-Hedging', description: 'Risk management' },
    { id: 'compliance', label: 'Compliance', description: 'KYC/AML tools' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Treasury Management</h1>
        <p className="text-gray-600">Manage your corporate treasury with automated tools</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div>
                <div>{tab.label}</div>
                <div className="text-xs text-gray-400">{tab.description}</div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && <TreasuryOverview />}
        {activeTab === 'payroll' && <PayrollManager />}
        {activeTab === 'hedging' && <AutoHedging />}
        {activeTab === 'compliance' && <CompliancePanel />}
      </motion.div>
    </div>
  );
}