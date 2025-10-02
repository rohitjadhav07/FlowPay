'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  RefreshCw,
  QrCode,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { useWallet } from '@/components/providers/Providers';
import { contractHelpers } from '@/lib/aptos';
import { TransactionStorage, formatAmountFromOctas } from '@/lib/transactionStorage';
import { QRCodeModal } from '@/components/wallet/QRCodeModal';
import { useLanguage } from '@/contexts/LanguageContext';
import toast from 'react-hot-toast';

interface TransactionDetail {
  hash: string;
  type: string;
  timestamp: string;
  success: boolean;
  gas_used?: string;
  sender?: string;
  receiver?: string;
  amount?: string;
  function?: string;
  events?: any[];
  version?: string;
}

export default function WalletPage() {
  const { account } = useWallet();
  const { t } = useLanguage();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [allTransactions, setAllTransactions] = useState<TransactionDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const fetchWalletData = async () => {
    if (!account?.address) return;
    
    setIsLoading(true);
    try {
      const [balanceData, txHistory] = await Promise.all([
        contractHelpers.getAccountBalance(account.address),
        contractHelpers.getTransactionHistory(account.address, 50) // Fetch more transactions
      ]);
      
      setBalance(balanceData);
      
      // Get stored transactions first (for immediate display)
      const storedTxs = TransactionStorage.getTransactions(account.address);
      
      // Enhanced transaction processing with blockchain data
      const enhancedTransactions = await Promise.all(
        txHistory.map(async (tx: any) => {
          try {
            // Check if we already have this transaction stored
            const existingTx = storedTxs.find(stored => stored.hash === tx.hash);
            if (existingTx) {
              return existingTx as TransactionDetail;
            }
            
            // Get detailed transaction info for new transactions
            const detailResponse = await fetch(`https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/${tx.hash}`);
            let detailData = null;
            
            if (detailResponse.ok) {
              detailData = await detailResponse.json();
            }
            
            const enhancedTx = {
              hash: tx.hash,
              type: tx.type,
              timestamp: tx.timestamp,
              success: tx.success,
              gas_used: tx.gas_used,
              sender: detailData?.sender || tx.sender,
              receiver: detailData?.payload?.arguments?.[0] || 'Unknown',
              amount: detailData?.payload?.arguments?.[1] || '0',
              function: detailData?.payload?.function || tx.type,
              events: detailData?.events || [],
              version: detailData?.version || tx.version,
            } as TransactionDetail;
            
            // Store the enhanced transaction
            TransactionStorage.storeTransaction(account.address, enhancedTx);
            
            return enhancedTx;
          } catch (error) {
            console.error('Error enhancing transaction:', error);
            return tx as TransactionDetail;
          }
        })
      );
      
      // Merge blockchain transactions with stored transactions (avoid duplicates)
      const allTxs = [...enhancedTransactions];
      storedTxs.forEach((storedTx: TransactionDetail) => {
        if (!allTxs.find(tx => tx.hash === storedTx.hash)) {
          allTxs.push(storedTx);
        }
      });
      
      // Sort by timestamp (newest first)
      allTxs.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
      
      setAllTransactions(allTxs);
      setTransactions(allTxs.slice(0, 10)); // Show first 10 by default
      
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to fetch wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [account?.address]);

  // Filter transactions based on current filter and search term
  useEffect(() => {
    if (!account?.address) return;
    
    let filtered = [...allTransactions];
    
    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(tx => {
        switch (filter) {
          case 'sent':
            return tx.sender === account.address;
          case 'received':
            return tx.receiver === account.address || (tx.sender !== account.address && tx.success);
          case 'failed':
            return !tx.success;
          default:
            return true;
        }
      });
    }
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.function?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.receiver?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setTransactions(showAllTransactions ? filtered : filtered.slice(0, 10));
  }, [allTransactions, filter, searchTerm, showAllTransactions, account?.address]);

  // Store transaction when user makes a payment (call this from payment components)
  const storeTransaction = (txHash: string, txData: Partial<TransactionDetail>) => {
    if (!account?.address) return;
    
    const storageKey = `wallet_transactions_${account.address}`;
    const storedTxs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const newTx: TransactionDetail = {
      hash: txHash,
      type: 'user_transaction',
      timestamp: Date.now().toString() + '000', // Convert to microseconds
      success: true,
      sender: account.address,
      ...txData
    };
    
    storedTxs.unshift(newTx);
    localStorage.setItem(storageKey, JSON.stringify(storedTxs.slice(0, 100)));
    
    // Update state
    setAllTransactions(prev => [newTx, ...prev]);
  };

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      toast.success('Address copied to clipboard!');
    }
  };

  const openInExplorer = () => {
    if (account?.address) {
      window.open(`https://explorer.aptoslabs.com/account/${account.address}?network=testnet`, '_blank');
    }
  };

  const exportTransactions = () => {
    if (!account?.address || !allTransactions.length) {
      toast.error('No transactions to export');
      return;
    }
    
    const csvContent = TransactionStorage.exportToCSV(account.address);
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallet_transactions_${account.address.slice(0, 8)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Transactions exported successfully!');
  };

  const getTransactionDirection = (tx: TransactionDetail) => {
    if (!account?.address) return 'unknown';
    
    // Check if this is a transaction we sent
    if (tx.sender === account.address) {
      return 'sent';
    }
    
    // Check if this is a transaction we received
    if (tx.receiver === account.address) {
      return 'received';
    }
    
    // For transactions where we're not explicitly the receiver but sender is different
    // This handles cases where the transaction affects our account but receiver isn't set
    if (tx.sender && tx.sender !== account.address) {
      return 'received';
    }
    
    return 'unknown';
  };

  const formatAmount = (amount: string | undefined) => {
    if (!amount || amount === '0') return '0';
    return formatAmountFromOctas(amount);
  };

  if (!account) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Wallet Connected</h2>
          <p className="text-gray-600 dark:text-gray-400">Please connect your wallet to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('wallet.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('wallet.subtitle')}</p>
        </div>
        <button
          onClick={fetchWalletData}
          disabled={isLoading}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{t('common.refresh')}</span>
        </button>
      </div>

      {/* Wallet Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Petra Wallet</h3>
            <p className="text-gray-600">Connected to Aptos Testnet</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wallet Address
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-sm break-all">
                {account.address}
              </div>
              <button
                onClick={copyAddress}
                className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Copy address"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={openInExplorer}
                className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="View in explorer"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Balance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              APT Balance
            </label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {balance.toFixed(8)} APT
              </div>
              <div className="text-sm text-gray-500">
                ≈ ${(balance * 8.50).toFixed(2)} USD
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Receive Payments</h4>
              <p className="text-sm text-gray-600">Share your wallet address</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowQRModal(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <QrCode className="w-4 h-4" />
                <span>QR Code</span>
              </button>
              <button 
                onClick={exportTransactions}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {allTransactions.length} total
            </span>
            <button 
              onClick={() => setShowAllTransactions(!showAllTransactions)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {showAllTransactions ? 'Show Less' : 'View All'}
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            {(['all', 'sent', 'received', 'failed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === filterType
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const direction = getTransactionDirection(tx);
              const amount = formatAmount(tx.amount);
              
              return (
                <div key={tx.hash} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                      {!tx.success ? (
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                      ) : direction === 'sent' ? (
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900 text-sm">
                          {!tx.success ? 'Failed Transaction' : 
                           direction === 'sent' ? 'Sent APT' : 'Received APT'}
                        </p>
                        {tx.function && tx.function !== 'user_transaction' && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {tx.function.split('::').pop()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-xs text-gray-500 font-mono">
                          {tx.hash.slice(0, 12)}...{tx.hash.slice(-12)}
                        </p>
                        
                        {direction === 'sent' && tx.receiver && (
                          <p className="text-xs text-gray-500">
                            To: {tx.receiver.slice(0, 8)}...{tx.receiver.slice(-8)}
                          </p>
                        )}
                        
                        {direction === 'received' && tx.sender && (
                          <p className="text-xs text-gray-500">
                            From: {tx.sender.slice(0, 8)}...{tx.sender.slice(-8)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      {amount !== '0' && (
                        <p className={`text-sm font-medium ${
                          direction === 'sent' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {direction === 'sent' ? '-' : '+'}{amount} APT
                        </p>
                      )}
                      
                      <div className={`w-2 h-2 rounded-full ${
                        tx.success ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(parseInt(tx.timestamp) / 1000).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    
                    <button
                      onClick={() => window.open(`https://explorer.aptoslabs.com/txn/${tx.hash}?network=testnet`, '_blank')}
                      className="text-xs text-primary-600 hover:text-primary-700 flex items-center space-x-1 mt-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900 mb-1">
              {searchTerm || filter !== 'all' ? 'No matching transactions' : 'No transactions yet'}
            </h4>
            <p className="text-sm text-gray-600">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Your transaction history will appear here'
              }
            </p>
          </div>
        )}
      </motion.div>

      {/* Wallet Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">
              {allTransactions.length}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mt-2">Total Transactions</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">
              {allTransactions.filter(tx => tx.success).length}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mt-2">Successful</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <ArrowUpRight className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">
              {allTransactions.filter(tx => getTransactionDirection(tx) === 'sent').length}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mt-2">Sent</p>
        </div>
      </motion.div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        address={account.address}
      />
    </div>
  );
}