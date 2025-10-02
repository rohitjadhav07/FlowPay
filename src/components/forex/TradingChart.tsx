'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Maximize2,
  Settings,
  RefreshCw
} from 'lucide-react';

interface TradingChartProps {
  pair: string;
}

interface ChartData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function TradingChart({ pair }: TradingChartProps) {
  const [timeframe, setTimeframe] = useState('1H');
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(1.0847);
  const [priceChange, setPriceChange] = useState(0.0023);

  // Mock chart data
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    // Generate mock chart data
    const generateMockData = () => {
      const data: ChartData[] = [];
      let basePrice = 1.0800;
      const now = new Date();
      
      for (let i = 100; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
        const variation = (Math.random() - 0.5) * 0.01;
        const open = basePrice;
        const close = basePrice + variation;
        const high = Math.max(open, close) + Math.random() * 0.005;
        const low = Math.min(open, close) - Math.random() * 0.005;
        const volume = Math.random() * 1000000;
        
        data.push({
          timestamp,
          open,
          high,
          low,
          close,
          volume
        });
        
        basePrice = close;
      }
      
      return data;
    };

    setChartData(generateMockData());
  }, [pair, timeframe]);

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 0.002;
      setCurrentPrice(prev => prev + variation);
      setPriceChange(prev => prev + variation);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const refreshChart = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D', '1W'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">{pair}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {currentPrice.toFixed(5)}
            </span>
            <div className={`flex items-center space-x-1 ${
              priceChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {priceChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-medium">
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(5)} ({((priceChange / currentPrice) * 100).toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={refreshChart}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                timeframe === tf
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('candlestick')}
            className={`p-2 rounded transition-colors ${
              chartType === 'candlestick'
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`p-2 rounded transition-colors ${
              chartType === 'line'
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-80 bg-gray-50 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="w-full h-full p-4">
            {/* Mock Chart Visualization */}
            <svg className="w-full h-full" viewBox="0 0 800 300">
              {/* Grid Lines */}
              <defs>
                <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Price Line */}
              {chartType === 'line' ? (
                <path
                  d={`M 0 150 Q 100 120 200 140 T 400 130 T 600 145 T 800 135`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
              ) : (
                // Candlesticks
                chartData.slice(-20).map((candle, index) => {
                  const x = (index * 40) + 20;
                  const openY = 300 - ((candle.open - 1.07) * 10000);
                  const closeY = 300 - ((candle.close - 1.07) * 10000);
                  const highY = 300 - ((candle.high - 1.07) * 10000);
                  const lowY = 300 - ((candle.low - 1.07) * 10000);
                  const isGreen = candle.close > candle.open;
                  
                  return (
                    <g key={index}>
                      {/* Wick */}
                      <line
                        x1={x}
                        y1={highY}
                        x2={x}
                        y2={lowY}
                        stroke={isGreen ? '#22c55e' : '#ef4444'}
                        strokeWidth="1"
                      />
                      {/* Body */}
                      <rect
                        x={x - 8}
                        y={Math.min(openY, closeY)}
                        width="16"
                        height={Math.abs(closeY - openY) || 1}
                        fill={isGreen ? '#22c55e' : '#ef4444'}
                      />
                    </g>
                  );
                })
              )}
              
              {/* Current Price Line */}
              <line
                x1="0"
                y1="150"
                x2="800"
                y2="150"
                stroke="#6366f1"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
              <text x="750" y="145" fill="#6366f1" fontSize="12" textAnchor="end">
                {currentPrice.toFixed(5)}
              </text>
            </svg>
          </div>
        )}
      </div>

      {/* Chart Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">Open</p>
          <p className="font-semibold text-gray-900">1.0824</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">High</p>
          <p className="font-semibold text-green-600">1.0891</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Low</p>
          <p className="font-semibold text-red-600">1.0798</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Volume</p>
          <p className="font-semibold text-gray-900">2.4M</p>
        </div>
      </div>
    </motion.div>
  );
}