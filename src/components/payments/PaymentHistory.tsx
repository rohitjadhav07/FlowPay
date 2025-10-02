'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { Select, Option } from '@/components/ui/Select';

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: string;
  currency: string;
  recipient: string;
  sender: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  txHash: string;
  fee: string;
}

export function PaymentHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'sent' | 'received'>('all');

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'sent',
      amount: '1,000.00',
      currency: 'USD',
      recipient: '0x1234...5678',
      sender: '0xabcd...efgh',
      status: 'completed',
      timestamp: '2024-01-15 14:30:25',
      txHash: '0xabc123...def456',
      fee: '0.01'
    },
    {
      id: '2',
      type: 'received',
      amount: '500.00',
      currency: 'EUR',
      recipient: '0xabcd...efgh',
      sender: '0x9876...5432',
      status: 'completed',
      timestamp: '2024-01-15 12:15:10',
      txHash: '0xdef789...abc123',
      fee: '0.01'
    },
    {
      id: '3',
      type: 'sent',
      amount: '250.00',
      currency: 'GBP',
      recipient: '0x5555...7777',
      sender: '0xabcd...efgh',
      status: 'pending',
      timestamp: '2024-01-15 11:45:33',
      txHash: '0x123abc...789def',
      fee: '0.01'
    },
    {
      id: '4',
      type: 'sent',
      amount: '750.00',
      currency: 'USD',
      recipient: '0x8888...9999',
      sender: '0xabcd...efgh',
      status: 'failed',
      timestamp: '2024-01-14 16:20:15',
      txHash: '0x456def...123abc',
      fee: '0.01'
    },
    {
      id: '5',
      type: 'received',
      amount: '2,000.00',
      currency: 'USDC',
      recipient: '0xabcd...efgh',
      sender: '0x1111...2222',
      status: 'completed',
      timestamp: '2024-01-14 09:30:45',
      txHash: '0x789ghi...456jkl',
      fee: '0.01'
    }
  ];

  const filteredTransactions = mockTransactions.filter(tx => {
    const matchesSearch = tx.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.txHash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

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
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'failed':
        return 'status-failed';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
          <p className="text-gray-600 mt-1">Track all your transactions</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by address or transaction hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as 'all' | 'completed' | 'pending' | 'failed')}
          >
            <Option value="all">All Status</Option>
            <Option value="completed">Completed</Option>
            <Option value="pending">Pending</Option>
            <Option value="failed">Failed</Option>
          </Select>
          
          <Select
            value={typeFilter}
            onChange={(value) => setTypeFilter(value as 'all' | 'sent' | 'received')}
          >
            <Option value="all">All Types</Option>
            <Option value="sent">Sent</Option>
            <Option value="received">Received</Option>
          </Select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Address</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx, index) => (
              <motion.tr
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    {tx.type === 'sent' ? (
                      <ArrowUpRight className="w-4 h-4 text-red-500" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4 text-green-500" />
                    )}
                    <span className="capitalize font-medium">{tx.type}</span>
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {tx.amount} {tx.currency}
                    </div>
                    <div className="text-sm text-gray-500">
                      Fee: ${tx.fee}
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <div className="font-mono text-sm">
                    {tx.type === 'sent' ? tx.recipient : tx.sender}
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                    {getStatusIcon(tx.status)}
                    <span className="capitalize">{tx.status}</span>
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-900">{tx.timestamp}</div>
                </td>
                
                <td className="py-4 px-4">
                  <button
                    onClick={() => window.open(`https://explorer.aptoslabs.com/txn/${tx.txHash}`, '_blank')}
                    className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">View</span>
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Your transaction history will appear here'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredTransactions.length > 0 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {filteredTransactions.length} of {mockTransactions.length} transactions
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}