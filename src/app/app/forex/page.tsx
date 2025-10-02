'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ForexTrading } from '@/components/forex/ForexTrading';
import { CurrencyPairs } from '@/components/forex/CurrencyPairs';
import { TradingChart } from '@/components/forex/TradingChart';
import { OrderBook } from '@/components/forex/OrderBook';

export default function ForexPage() {
  const [selectedPair, setSelectedPair] = useState('EUR/USD');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FOREX Trading</h1>
          <p className="text-gray-600">Real-time currency trading with institutional rates</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">24h Volume</p>
            <p className="text-lg font-semibold text-gray-900">$2.4M</p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">Live</span>
        </div>
      </div>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Currency Pairs */}
        <div className="lg:col-span-1">
          <CurrencyPairs 
            selectedPair={selectedPair}
            onPairSelect={setSelectedPair}
          />
        </div>

        {/* Trading Chart */}
        <div className="lg:col-span-2">
          <TradingChart pair={selectedPair} />
        </div>

        {/* Order Book */}
        <div className="lg:col-span-1">
          <OrderBook pair={selectedPair} />
        </div>
      </div>

      {/* Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ForexTrading selectedPair={selectedPair} />
        </div>
        
        {/* Trading Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Trading Stats
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today's P&L</span>
              <span className="text-success-600 font-semibold">+$1,234.56</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Trades</span>
              <span className="font-semibold">47</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Win Rate</span>
              <span className="font-semibold">68.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Volume</span>
              <span className="font-semibold">$45,678</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Recent Trades</h4>
            <div className="space-y-2">
              {[
                { pair: 'EUR/USD', type: 'BUY', amount: '€1,000', pnl: '+$23.45' },
                { pair: 'GBP/USD', type: 'SELL', amount: '£500', pnl: '-$12.30' },
                { pair: 'USD/JPY', type: 'BUY', amount: '$2,000', pnl: '+$45.67' },
              ].map((trade, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">{trade.pair}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      trade.type === 'BUY' 
                        ? 'bg-success-100 text-success-800' 
                        : 'bg-error-100 text-error-800'
                    }`}>
                      {trade.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">{trade.amount}</div>
                    <div className={trade.pnl.startsWith('+') ? 'text-success-600' : 'text-error-600'}>
                      {trade.pnl}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}