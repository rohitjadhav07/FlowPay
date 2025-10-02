'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Target,
  Shield
} from 'lucide-react';

interface ForexTradingProps {
  selectedPair: string;
}

export function ForexTrading({ selectedPair }: ForexTradingProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  const currentPrice = 1.0847;
  const spread = 0.0003;
  const bidPrice = currentPrice - spread / 2;
  const askPrice = currentPrice + spread / 2;

  const calculateTotal = () => {
    const amountNum = parseFloat(amount) || 0;
    const price = orderType === 'market' 
      ? (tradeType === 'buy' ? askPrice : bidPrice)
      : parseFloat(limitPrice) || currentPrice;
    return (amountNum * price).toFixed(2);
  };

  const executeTrade = () => {
    if (!amount) return;
    
    // Simulate trade execution
    const trade = {
      pair: selectedPair,
      type: tradeType,
      amount: parseFloat(amount),
      price: orderType === 'market' 
        ? (tradeType === 'buy' ? askPrice : bidPrice)
        : parseFloat(limitPrice) || currentPrice,
      timestamp: new Date().toISOString()
    };
    
    console.log('Executing trade:', trade);
    alert(`${tradeType.toUpperCase()} order for ${amount} ${selectedPair} executed successfully!`);
    
    // Reset form
    setAmount('');
    setLimitPrice('');
    setStopLoss('');
    setTakeProfit('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Trade {selectedPair}</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="text-center">
            <p className="text-gray-500">Bid</p>
            <p className="font-semibold text-red-600">{bidPrice.toFixed(5)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Ask</p>
            <p className="font-semibold text-green-600">{askPrice.toFixed(5)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Spread</p>
            <p className="font-semibold text-gray-900">{(spread * 10000).toFixed(1)} pips</p>
          </div>
        </div>
      </div>

      {/* Trade Type Selection */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setTradeType('buy')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
            tradeType === 'buy'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>BUY</span>
        </button>
        <button
          onClick={() => setTradeType('sell')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
            tradeType === 'sell'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>SELL</span>
        </button>
      </div>

      {/* Order Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
        <div className="flex space-x-2">
          <button
            onClick={() => setOrderType('market')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              orderType === 'market'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setOrderType('limit')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              orderType === 'limit'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Limit
          </button>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount ({selectedPair.split('/')[0]})
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Min: $100</span>
          <span>Available: $25,430</span>
        </div>
      </div>

      {/* Limit Price (if limit order) */}
      {orderType === 'limit' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Limit Price</label>
          <input
            type="number"
            step="0.00001"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            placeholder={currentPrice.toFixed(5)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Risk Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Shield className="inline w-4 h-4 mr-1" />
            Stop Loss
          </label>
          <input
            type="number"
            step="0.00001"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            placeholder="Optional"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Target className="inline w-4 h-4 mr-1" />
            Take Profit
          </label>
          <input
            type="number"
            step="0.00001"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            placeholder="Optional"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Order Summary */}
      {amount && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium">{orderType.toUpperCase()} {tradeType.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">{amount} {selectedPair.split('/')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium">
                {orderType === 'market' 
                  ? (tradeType === 'buy' ? askPrice : bidPrice).toFixed(5)
                  : limitPrice || currentPrice.toFixed(5)
                }
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold">${calculateTotal()} {selectedPair.split('/')[1]}</span>
            </div>
          </div>
        </div>
      )}

      {/* Execute Button */}
      <button
        onClick={executeTrade}
        disabled={!amount}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
          tradeType === 'buy'
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-red-600 hover:bg-red-700 text-white'
        } disabled:bg-gray-300 disabled:cursor-not-allowed`}
      >
        {tradeType === 'buy' ? 'BUY' : 'SELL'} {selectedPair}
      </button>

      {/* Quick Amount Buttons */}
      <div className="mt-4 flex space-x-2">
        {['100', '500', '1000', '5000'].map((quickAmount) => (
          <button
            key={quickAmount}
            onClick={() => setAmount(quickAmount)}
            className="flex-1 py-2 px-3 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            ${quickAmount}
          </button>
        ))}
      </div>
    </motion.div>
  );
}