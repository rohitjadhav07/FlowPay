'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface OrderBookProps {
  pair: string;
}

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export function OrderBook({ pair }: OrderBookProps) {
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [spread, setSpread] = useState(0);

  useEffect(() => {
    // Generate mock order book data
    const generateOrderBook = () => {
      const basePrice = 1.0847;
      const newBids: OrderBookEntry[] = [];
      const newAsks: OrderBookEntry[] = [];
      
      // Generate bids (buy orders) - prices below current price
      for (let i = 0; i < 10; i++) {
        const price = basePrice - (i + 1) * 0.0001;
        const amount = Math.random() * 100000 + 10000;
        const total = i === 0 ? amount : newBids[i - 1].total + amount;
        newBids.push({ price, amount, total });
      }
      
      // Generate asks (sell orders) - prices above current price
      for (let i = 0; i < 10; i++) {
        const price = basePrice + (i + 1) * 0.0001;
        const amount = Math.random() * 100000 + 10000;
        const total = i === 0 ? amount : newAsks[i - 1].total + amount;
        newAsks.push({ price, amount, total });
      }
      
      setBids(newBids);
      setAsks(newAsks.reverse()); // Reverse asks to show highest price first
      setSpread(newAsks[newAsks.length - 1].price - newBids[0].price);
    };

    generateOrderBook();
    
    // Update order book every 2 seconds
    const interval = setInterval(generateOrderBook, 2000);
    return () => clearInterval(interval);
  }, [pair]);

  const maxTotal = Math.max(
    ...bids.map(b => b.total),
    ...asks.map(a => a.total)
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card h-fit"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Order Book</h3>
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{pair}</span>
        </div>
      </div>

      {/* Spread Info */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Spread</span>
          <span className="font-semibold text-gray-900">
            {spread.toFixed(5)} ({((spread / 1.0847) * 10000).toFixed(1)} pips)
          </span>
        </div>
      </div>

      {/* Headers */}
      <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-500 mb-2">
        <div className="text-left">Price</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Total</div>
      </div>

      {/* Order Book Container */}
      <div className="space-y-1">
        {/* Asks (Sell Orders) */}
        <div className="space-y-1">
          {asks.slice(0, 8).map((ask, index) => (
            <motion.div
              key={`ask-${index}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="relative grid grid-cols-3 gap-2 text-xs py-1 hover:bg-red-50 rounded transition-colors"
            >
              {/* Background bar for total volume */}
              <div
                className="absolute inset-y-0 right-0 bg-red-100 rounded"
                style={{ width: `${(ask.total / maxTotal) * 100}%` }}
              />
              
              <div className="relative text-red-600 font-medium">
                {ask.price.toFixed(5)}
              </div>
              <div className="relative text-right text-gray-900">
                {formatNumber(ask.amount)}
              </div>
              <div className="relative text-right text-gray-600">
                {formatNumber(ask.total)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Current Price */}
        <div className="my-3 p-2 bg-primary-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp className="w-4 h-4 text-primary-600" />
            <span className="font-semibold text-primary-700">1.08470</span>
            <span className="text-xs text-primary-600">Last Price</span>
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="space-y-1">
          {bids.slice(0, 8).map((bid, index) => (
            <motion.div
              key={`bid-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="relative grid grid-cols-3 gap-2 text-xs py-1 hover:bg-green-50 rounded transition-colors"
            >
              {/* Background bar for total volume */}
              <div
                className="absolute inset-y-0 right-0 bg-green-100 rounded"
                style={{ width: `${(bid.total / maxTotal) * 100}%` }}
              />
              
              <div className="relative text-green-600 font-medium">
                {bid.price.toFixed(5)}
              </div>
              <div className="relative text-right text-gray-900">
                {formatNumber(bid.amount)}
              </div>
              <div className="relative text-right text-gray-600">
                {formatNumber(bid.total)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Order Book Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Best Bid</span>
          <span className="font-semibold text-green-600">
            {bids[0]?.price.toFixed(5)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Best Ask</span>
          <span className="font-semibold text-red-600">
            {asks[asks.length - 1]?.price.toFixed(5)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Total Volume</span>
          <span className="font-semibold text-gray-900">
            {formatNumber(maxTotal)}
          </span>
        </div>
      </div>

      {/* Market Depth Indicator */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Market Depth</span>
          <span>Bid/Ask Ratio</span>
        </div>
        <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="bg-green-500 flex-1" style={{ flex: '0.52' }} />
          <div className="bg-red-500 flex-1" style={{ flex: '0.48' }} />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
          <span className="text-green-600">52% Bids</span>
          <span className="text-red-600">48% Asks</span>
        </div>
      </div>
    </motion.div>
  );
}