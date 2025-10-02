'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface CurrencyRate {
  pair: string;
  rate: number;
  change: number;
  changePercent: number;
  volume: string;
}

export function MarketOverview() {
  const [rates, setRates] = useState<CurrencyRate[]>([
    {
      pair: 'EUR/USD',
      rate: 1.0847,
      change: 0.0023,
      changePercent: 0.21,
      volume: '$2.4M'
    },
    {
      pair: 'GBP/USD',
      rate: 1.2734,
      change: -0.0045,
      changePercent: -0.35,
      volume: '$1.8M'
    },
    {
      pair: 'USD/JPY',
      rate: 149.52,
      change: 0.87,
      changePercent: 0.58,
      volume: '$3.1M'
    },
    {
      pair: 'USD/CHF',
      rate: 0.8923,
      change: -0.0012,
      changePercent: -0.13,
      volume: '$890K'
    }
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Simulate real-time rate updates
    const interval = setInterval(() => {
      setRates(prevRates => 
        prevRates.map(rate => {
          const variation = (Math.random() - 0.5) * 0.01;
          const newRate = rate.rate + variation;
          const change = newRate - rate.rate;
          const changePercent = (change / rate.rate) * 100;
          
          return {
            ...rate,
            rate: newRate,
            change,
            changePercent
          };
        })
      );
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const refreshRates = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Market Overview</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshRates}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/app/forex"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
          >
            <span>Trade</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {rates.map((rate, index) => (
          <motion.div
            key={rate.pair}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => window.open(`/app/forex?pair=${rate.pair}`, '_blank')}
          >
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">{rate.pair}</h4>
                <div className={`flex items-center space-x-1 ${
                  rate.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {rate.changePercent >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="text-xs font-medium">
                    {rate.changePercent >= 0 ? '+' : ''}{rate.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500">Vol: {rate.volume}</p>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {rate.rate.toFixed(4)}
              </p>
              <p className={`text-sm ${
                rate.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {rate.change >= 0 ? '+' : ''}{rate.change.toFixed(4)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Market Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">$7.2M</p>
            <p className="text-xs text-gray-500">24h Volume</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">156</p>
            <p className="text-xs text-gray-500">Active Pairs</p>
          </div>
        </div>
      </div>

      {/* Last Update */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
        <div className="flex items-center justify-center space-x-1 mt-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-600 font-medium">Live</span>
        </div>
      </div>
    </motion.div>
  );
}