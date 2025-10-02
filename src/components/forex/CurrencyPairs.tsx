'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, TrendingUp, TrendingDown } from 'lucide-react';

interface CurrencyPairsProps {
  selectedPair: string;
  onPairSelect: (pair: string) => void;
}

interface CurrencyPair {
  pair: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  isFavorite: boolean;
}

export function CurrencyPairs({ selectedPair, onPairSelect }: CurrencyPairsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites' | 'major' | 'minor'>('all');
  const [pairs, setPairs] = useState<CurrencyPair[]>([
    {
      pair: 'EUR/USD',
      price: 1.0847,
      change: 0.0023,
      changePercent: 0.21,
      volume: '$2.4M',
      isFavorite: true
    },
    {
      pair: 'GBP/USD',
      price: 1.2734,
      change: -0.0045,
      changePercent: -0.35,
      volume: '$1.8M',
      isFavorite: true
    },
    {
      pair: 'USD/JPY',
      price: 149.52,
      change: 0.87,
      changePercent: 0.58,
      volume: '$3.1M',
      isFavorite: false
    },
    {
      pair: 'USD/CHF',
      price: 0.8923,
      change: -0.0012,
      changePercent: -0.13,
      volume: '$890K',
      isFavorite: false
    },
    {
      pair: 'AUD/USD',
      price: 0.6543,
      change: 0.0034,
      changePercent: 0.52,
      volume: '$1.2M',
      isFavorite: false
    },
    {
      pair: 'USD/CAD',
      price: 1.3567,
      change: -0.0021,
      changePercent: -0.15,
      volume: '$950K',
      isFavorite: false
    },
    {
      pair: 'NZD/USD',
      price: 0.6123,
      change: 0.0018,
      changePercent: 0.29,
      volume: '$650K',
      isFavorite: false
    },
    {
      pair: 'EUR/GBP',
      price: 0.8521,
      change: 0.0012,
      changePercent: 0.14,
      volume: '$1.1M',
      isFavorite: false
    }
  ]);

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setPairs(prevPairs => 
        prevPairs.map(pair => {
          const variation = (Math.random() - 0.5) * 0.01;
          const newPrice = pair.price + variation;
          const change = newPrice - pair.price;
          const changePercent = (change / pair.price) * 100;
          
          return {
            ...pair,
            price: newPrice,
            change,
            changePercent
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleFavorite = (pairName: string) => {
    setPairs(prevPairs =>
      prevPairs.map(pair =>
        pair.pair === pairName
          ? { ...pair, isFavorite: !pair.isFavorite }
          : pair
      )
    );
  };

  const filteredPairs = pairs.filter(pair => {
    const matchesSearch = pair.pair.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filter) {
      case 'favorites':
        return matchesSearch && pair.isFavorite;
      case 'major':
        return matchesSearch && ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF'].includes(pair.pair);
      case 'minor':
        return matchesSearch && !['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF'].includes(pair.pair);
      default:
        return matchesSearch;
    }
  });

  const majorPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF'];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card h-fit"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Currency Pairs</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-600 font-medium">Live</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search pairs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'all', label: 'All' },
          { key: 'favorites', label: 'Favorites' },
          { key: 'major', label: 'Major' },
          { key: 'minor', label: 'Minor' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pairs List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredPairs.map((pair, index) => (
          <motion.div
            key={pair.pair}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onPairSelect(pair.pair)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedPair === pair.pair
                ? 'bg-primary-50 border border-primary-200'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className={`font-semibold text-sm ${
                  selectedPair === pair.pair ? 'text-primary-700' : 'text-gray-900'
                }`}>
                  {pair.pair}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(pair.pair);
                  }}
                  className="p-1 hover:bg-white rounded transition-colors"
                >
                  <Star className={`w-3 h-3 ${
                    pair.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'
                  }`} />
                </button>
                {majorPairs.includes(pair.pair) && (
                  <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                    Major
                  </span>
                )}
              </div>
              
              <div className={`flex items-center space-x-1 text-xs ${
                pair.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {pair.changePercent >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="font-medium">
                  {pair.changePercent >= 0 ? '+' : ''}{pair.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">
                {pair.price.toFixed(pair.pair.includes('JPY') ? 2 : 5)}
              </span>
              <span className="text-xs text-gray-500">{pair.volume}</span>
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <span className={`text-xs ${
                pair.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(pair.pair.includes('JPY') ? 2 : 5)}
              </span>
              <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    pair.changePercent >= 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min(Math.abs(pair.changePercent) * 20, 100)}%` 
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPairs.length === 0 && (
        <div className="text-center py-8">
          <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">No pairs found</p>
          <p className="text-gray-500 text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Market Status */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Market Status</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-600 font-medium">Open</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
          <span>Next Close</span>
          <span>Friday 17:00 EST</span>
        </div>
      </div>
    </motion.div>
  );
}