'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  TrendingUp, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { useWallet } from '@/components/providers/Providers';
import { WalletSelector } from '@/components/wallet/WalletSelector';
import { FaucetButton } from '@/components/wallet/FaucetButton';
import { DeploymentStatus } from '@/components/status/DeploymentStatus';
import { DeploymentGuide } from '@/components/deployment/DeploymentGuide';
import { contractHelpers } from '@/lib/aptos';

export default function DashboardPage() {
  const { connected, account, disconnect } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [accountBalance, setAccountBalance] = useState<number>(0);

  useEffect(() => {
    setIsClient(true);
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const fetchBalance = async () => {
    if (account?.address) {
      try {
        console.log('🔄 Refreshing balance for:', account.address);
        
        // Try direct API call first
        const directUrl = `https://fullnode.testnet.aptoslabs.com/v1/accounts/${account.address}/resource/0x1::coin::CoinStore%3C0x1::aptos_coin::AptosCoin%3E`;
        const response = await fetch(directUrl);
        
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.coin && data.data.coin.value) {
            const balance = parseInt(data.data.coin.value) / 100000000;
            console.log('✅ Direct API balance:', balance);
            setAccountBalance(balance);
            return;
          }
        }
        
        // Fallback to helper function
        const balance = await contractHelpers.getAccountBalance(account.address);
        console.log('💰 Helper balance:', balance);
        setAccountBalance(balance);
      } catch (error) {
        console.error('❌ Error fetching balance:', error);
        setAccountBalance(0);
      }
    }
  };

  useEffect(() => {
    fetchBalance();
    
    // Update balance every 10 seconds
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [account?.address]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 mb-6">
            Connect your Aptos wallet to start using FlowPay
          </p>
          <WalletSelector />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-primary-100">
              Ready to send payments globally in seconds
            </p>
          </div>
          <div className="text-right">
            <FaucetButton onBalanceUpdate={() => {}} />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions & Recent Transactions */}
        <div className="lg:col-span-2 space-y-6">
          <QuickActions />
          <RecentTransactions />
        </div>

        {/* Right Column - Market Overview */}
        <div className="space-y-6">
          <MarketOverview />
          
          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {[
                {
                  type: 'payment',
                  description: 'Sent $500 to John Doe',
                  time: '2 minutes ago',
                  status: 'completed',
                  icon: Send,
                },
                {
                  type: 'forex',
                  description: 'Converted €1,000 to USD',
                  time: '1 hour ago',
                  status: 'completed',
                  icon: TrendingUp,
                },
                {
                  type: 'payroll',
                  description: 'Payroll processed for 25 employees',
                  time: '3 hours ago',
                  status: 'completed',
                  icon: Users,
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <activity.icon className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-success-500" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      <DeploymentStatus />
      
      {/* Deployment Guide */}
      <DeploymentGuide />
    </div>
  );
}