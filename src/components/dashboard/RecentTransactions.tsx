'use client';

import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: string;
  currency: string;
  address: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  name?: string;
}

export function RecentTransactions() {
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'sent',
      amount: '1,000.00',
      currency: 'USD',
      address: '0x1234...5678',
      status: 'completed',
      timestamp: '2 minutes ago',
      name: 'John Doe'
    },
    {
      id: '2',
      type: 'received',
      amount: '500.00',
      currency: 'EUR',
      address: '0x9876...5432',
      status: 'completed',
      timestamp: '1 hour ago',
      name: 'Alice Smith'
    },
    {
      id: '3',
      type: 'sent',
      amount: '250.00',
      currency: 'GBP',
      address: '0x5555...7777',
      status: 'pending',
      timestamp: '2 hours ago'
    },
    {
      id: '4',
      type: 'sent',
      amount: '750.00',
      currency: 'USD',
      address: '0x8888...9999',
      status: 'failed',
      timestamp: '1 day ago'
    },
    {
      id: '5',
      type: 'received',
      amount: '2,000.00',
      currency: 'USDC',
      address: '0x1111...2222',
      status: 'completed',
      timestamp: '2 days ago',
      name: 'Sarah Wilson'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <Link 
          href="/app/send?tab=history"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
        >
          <span>View all</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === 'sent' 
                  ? 'bg-red-100' 
                  : 'bg-green-100'
              }`}>
                {transaction.type === 'sent' ? (
                  <ArrowUpRight className="w-5 h-5 text-red-600" />
                ) : (
                  <ArrowDownLeft className="w-5 h-5 text-green-600" />
                )}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900">
                    {transaction.type === 'sent' ? 'Sent to' : 'Received from'}
                  </p>
                  {getStatusIcon(transaction.status)}
                </div>
                <p className="text-sm text-gray-600">
                  {transaction.name || transaction.address}
                </p>
                <p className="text-xs text-gray-500">{transaction.timestamp}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === 'sent' ? 'text-red-600' : 'text-green-600'
              }`}>
                {transaction.type === 'sent' ? '-' : '+'}
                {transaction.amount} {transaction.currency}
              </p>
              <p className={`text-xs capitalize ${getStatusColor(transaction.status)}`}>
                {transaction.status}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Action */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          href="/app/send"
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Send Money</span>
        </Link>
      </div>
    </motion.div>
  );
}