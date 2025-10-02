'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle,
  RefreshCw,
  Filter
} from 'lucide-react';
import { useWallet } from '@/components/providers/Providers';
import { contractHelpers } from '@/lib/aptos';
import { Select, Option } from '@/components/ui/Select';

interface Transaction {
  hash: string;
  type: string;
  timestamp: string;
  success: boolean;
  sender?: string;
  receiver?: string;
  amount?: string;
  gas_used?: string;
  payload?: any;
}

export function RealTransactionHistory() {
  const { account } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');

  const fetchTransactions = async () => {
    if (!account?.address) return;

    setIsLoading(true);
    try {
      console.log('🔍 Fetching real transaction history...');
      
      // Fetch from Aptos API
      const response = await fetch(
        `https://fullnode.testnet.aptoslabs.com/v1/accounts/${account.address}/transactions?limit=50`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Raw transactions:', data);
        
        // Process and filter transactions
        const processedTxs = data
          .filter((tx: any) => tx.type === 'user_transaction')
          .map((tx: any) => ({
            hash: tx.hash,
            type: tx.type,
            timestamp: new Date(parseInt(tx.timestamp) / 1000).toLocaleString(),
            success: tx.success,
            sender: tx.sender,
            gas_used: tx.gas_used,
            payload: tx.payload,
            // Extract transfer details if available
            amount: extractTransferAmount(tx),
            receiver: extractReceiver(tx),
          }));
        
        setTransactions(processedTxs);
        console.log('✅ Processed transactions:', processedTxs.length);
      }
    } catch (error) {
      console.error('❌ Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractTransferAmount = (tx: any): string | undefined => {
    if (tx.payload?.function === '0x1::aptos_account::transfer' && tx.payload?.arguments) {
      const amount = parseInt(tx.payload.arguments[1]) / 100000000; // Convert from octas
      return amount.toFixed(4);
    }
    return undefined;
  };

  const extractReceiver = (tx: any): string | undefined => {
    if (tx.payload?.function === '0x1::aptos_account::transfer' && tx.payload?.arguments) {
      return tx.payload.arguments[0];
    }
    return undefined;
  };

  const getTransactionType = (tx: Transaction): 'sent' | 'received' | 'other' => {
    if (tx.payload?.function === '0x1::aptos_account::transfer') {
      if (tx.sender === account?.address) return 'sent';
      if (tx.receiver === account?.address) return 'received';
    }
    return 'other';
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return getTransactionType(tx) === filter;
  });

  useEffect(() => {
    fetchTransactions();
  }, [account?.address]);

  if (!account) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-medium text-gray-900 mb-1">Connect Your Wallet</h3>
          <p className="text-sm text-gray-600">Connect your wallet to view transaction history</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
        <div className="flex items-center space-x-2">
          <Select
            value={filter}
            onChange={(value) => setFilter(value as 'all' | 'sent' | 'received')}
            className="text-sm"
          >
            <Option value="all">All Transactions</Option>
            <Option value="sent">Sent</Option>
            <Option value="received">Received</Option>
          </Select>
          <button
            onClick={fetchTransactions}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredTransactions.length > 0 ? (
        <div className="space-y-3">
          {filteredTransactions.map((tx, index) => {
            const txType = getTransactionType(tx);
            const isTransfer = tx.payload?.function === '0x1::aptos_account::transfer';
            
            return (
              <motion.div
                key={tx.hash}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.success 
                      ? txType === 'sent' 
                        ? 'bg-red-100 text-red-600' 
                        : txType === 'received'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tx.success ? (
                      txType === 'sent' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : txType === 'received' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 text-sm">
                        {isTransfer ? (
                          txType === 'sent' ? 'Sent APT' : 
                          txType === 'received' ? 'Received APT' : 
                          'APT Transfer'
                        ) : (
                          tx.payload?.function?.split('::').pop() || 'Transaction'
                        )}
                      </p>
                      {tx.amount && (
                        <span className={`text-sm font-semibold ${
                          txType === 'sent' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {txType === 'sent' ? '-' : '+'}{tx.amount} APT
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{tx.timestamp}</span>
                      {tx.receiver && txType === 'sent' && (
                        <span>→ {tx.receiver.slice(0, 6)}...{tx.receiver.slice(-4)}</span>
                      )}
                      {tx.sender && txType === 'received' && (
                        <span>← {tx.sender.slice(0, 6)}...{tx.sender.slice(-4)}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    tx.success 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {tx.success ? 'Success' : 'Failed'}
                  </span>
                  
                  <button
                    onClick={() => {
                      window.open(`https://explorer.aptoslabs.com/txn/${tx.hash}?network=testnet`, '_blank');
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View in Explorer"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h4 className="font-medium text-gray-900 mb-1">No transactions found</h4>
          <p className="text-sm text-gray-600">
            {filter === 'all' 
              ? 'Your transaction history will appear here'
              : `No ${filter} transactions found`
            }
          </p>
        </div>
      )}
    </motion.div>
  );
}