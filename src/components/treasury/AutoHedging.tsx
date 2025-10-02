'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  TrendingUp, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target
} from 'lucide-react';
import { Select, Option } from '@/components/ui/Select';

export function AutoHedging() {
  const [hedgingEnabled, setHedgingEnabled] = useState(true);
  const [hedgeThreshold, setHedgeThreshold] = useState(75);
  const [riskTolerance, setRiskTolerance] = useState('medium');

  const exposureData = [
    { currency: 'EUR', exposure: 35120, threshold: 30000, risk: 'medium' },
    { currency: 'GBP', exposure: 23450, threshold: 25000, risk: 'low' },
    { currency: 'JPY', exposure: 18900, threshold: 20000, risk: 'low' },
    { currency: 'CHF', exposure: 12300, threshold: 15000, risk: 'low' },
  ];

  const hedgeHistory = [
    { date: '2024-01-15', currency: 'EUR', amount: '€5,000', type: 'Forward Contract', pnl: '+$234' },
    { date: '2024-01-14', currency: 'GBP', amount: '£3,000', type: 'Options', pnl: '-$89' },
    { date: '2024-01-13', currency: 'JPY', amount: '¥500,000', type: 'Swap', pnl: '+$156' },
  ];

  return (
    <div className="space-y-6">
      {/* Hedging Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Auto-Hedging Settings</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Auto-Hedging</span>
            <button
              onClick={() => setHedgingEnabled(!hedgingEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                hedgingEnabled ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  hedgingEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">Protected</p>
            <p className="text-sm text-gray-600">Hedge Status</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{hedgeThreshold}%</p>
            <p className="text-sm text-gray-600">Hedge Threshold</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">+$1,234</p>
            <p className="text-sm text-gray-600">Monthly P&L</p>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hedge Threshold ({hedgeThreshold}%)
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={hedgeThreshold}
              onChange={(e) => setHedgeThreshold(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Conservative (50%)</span>
              <span>Aggressive (100%)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risk Tolerance
            </label>
            <Select
              value={riskTolerance}
              onChange={setRiskTolerance}
            >
              <Option value="low">Low - Minimize volatility</Option>
              <Option value="medium">Medium - Balanced approach</Option>
              <Option value="high">High - Maximize returns</Option>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Currency Exposure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Currency Exposure</h3>
        
        <div className="space-y-4">
          {exposureData.map((item, index) => (
            <div key={item.currency} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">{item.currency}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.risk === 'high' ? 'bg-red-100 text-red-800' :
                    item.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.risk} risk
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${item.exposure.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Threshold: ${item.threshold.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item.exposure > item.threshold ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((item.exposure / item.threshold) * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-gray-600">
                  {((item.exposure / item.threshold) * 100).toFixed(1)}% of threshold
                </span>
                {item.exposure > item.threshold ? (
                  <span className="text-red-600 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Hedge recommended
                  </span>
                ) : (
                  <span className="text-green-600 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Within limits
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hedge History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Hedge Transactions</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Currency</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">P&L</th>
              </tr>
            </thead>
            <tbody>
              {hedgeHistory.map((hedge, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900">{hedge.date}</td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{hedge.currency}</span>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{hedge.amount}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {hedge.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-semibold ${
                      hedge.pnl.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {hedge.pnl}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Risk Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">2.3%</p>
            <p className="text-sm text-gray-600">Portfolio Volatility</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">1.45</p>
            <p className="text-sm text-gray-600">Sharpe Ratio</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">-1.2%</p>
            <p className="text-sm text-gray-600">Max Drawdown</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">0.85</p>
            <p className="text-sm text-gray-600">Hedge Ratio</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}