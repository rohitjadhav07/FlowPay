'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PaymentInterface } from '@/components/payments/PaymentInterface';
import { RealTransactionHistory } from '@/components/payments/RealTransactionHistory';
import { QuickContacts } from '@/components/payments/QuickContacts';

export default function SendPage() {
  const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Send Money</h1>
          <p className="text-gray-600">Send money globally in seconds</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('send')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'send'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Send Payment
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTab === 'send' ? (
          <>
            {/* Payment Interface */}
            <div className="lg:col-span-2">
              <PaymentInterface />
            </div>
            
            {/* Quick Contacts */}
            <div>
              <QuickContacts />
            </div>
          </>
        ) : (
          <div className="lg:col-span-3">
            <RealTransactionHistory />
          </div>
        )}
      </div>
    </div>
  );
}