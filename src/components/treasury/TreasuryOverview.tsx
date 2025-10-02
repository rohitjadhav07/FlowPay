'use client';

import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useState, useEffect } from 'react';

export function TreasuryOverview() {
  const [showBalances, setShowBalances] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const portfolioData = [
    { currency: 'APT', balance: '5,320.75', usdValue: '45,230.50', change: 8.5, flag: '⚡' },
    { currency: 'USDC', balance: '25,000.00', usdValue: '25,000.00', change: 0.0, flag: '💵' },
    { currency: 'USDT', balance: '15,500.00', usdValue: '15,500.00', change: 0.1, flag: '💰' },
    { currency: 'ETH', balance: '12.45', usdValue: '28,120.25', change: 5.2, flag: '🔷' },
    { currency: 'BTC', balance: '0.85', usdValue: '35,750.00', change: 3.8, flag: '₿' },
    { currency: 'EUR', balance: '18,180.75', usdValue: '19,820.25', change: -1.2, flag: '🇪🇺' },
    { currency: 'GBP', balance: '12,450.00', usdValue: '15,450.75', change: 0.8, flag: '🇬🇧' },
    { currency: 'JPY', balance: '2,450,000', usdValue: '16,320.50', change: -0.5, flag: '🇯🇵' },
  ];

  const totalValue = portfolioData.reduce((sum, item) => sum + parseFloat(item.usdValue.replace(',', '')), 0);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-gray-100 rounded-lg">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Portfolio Overview</h3>
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
            <DollarSign className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {showBalances ? `$${totalValue.toLocaleString()}` : '••••••'}
            </p>
            <p className="text-sm text-gray-600">Total Value</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">+12.5%</p>
            <p className="text-sm text-gray-600">Monthly Return</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">AAA</p>
            <p className="text-sm text-gray-600">Risk Rating</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">25</p>
            <p className="text-sm text-gray-600">Employees</p>
          </div>
        </div>

        {/* Currency Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Currency Breakdown</h4>
          {portfolioData.map((item, index) => (
            <button
              key={item.currency}
              onClick={() => {
                alert(`${item.currency} Portfolio Details:\n\nBalance: ${item.balance} ${item.currency}\nUSD Value: $${item.usdValue}\n24h Change: ${item.change >= 0 ? '+' : ''}${item.change}%\n\nClick to manage this currency.`);
              }}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border">
                  <span className="text-lg">{item.flag}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.currency}</p>
                  <p className="text-sm text-gray-500">
                    {showBalances ? item.balance : '••••••'} {item.currency}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {showBalances ? `$${item.usdValue}` : '••••••'}
                </p>
                <div className={`flex items-center space-x-1 text-sm ${
                  item.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.change >= 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  <span>{Math.abs(item.change)}%</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Treasury Activity</h3>
        <div className="space-y-3">
          {[
            { type: 'Payroll', amount: '1,470 APT', status: 'Completed', time: '2 hours ago', txHash: '0xabc123...def456' },
            { type: 'Currency Hedge', amount: '588 APT → USDC', status: 'Executed', time: '1 day ago', txHash: '0x789xyz...012abc' },
            { type: 'Deposit', amount: '2,940 APT', status: 'Confirmed', time: '2 days ago', txHash: '0x456def...789ghi' },
          ].map((activity, index) => (
            <button
              key={index}
              onClick={() => {
                window.open(`https://explorer.aptoslabs.com/txn/${activity.txHash}?network=testnet`, '_blank');
              }}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <div>
                <p className="font-medium text-gray-900">{activity.type}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{activity.amount}</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {activity.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}