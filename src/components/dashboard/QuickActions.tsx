'use client';

import { motion } from 'framer-motion';
import { 
  Send, 
  Building2, 
  TrendingUp, 
  CreditCard,
  ArrowRight,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  const actions = [
    {
      title: 'Send Money',
      description: 'Send payments globally in seconds',
      icon: Send,
      href: '/app/send',
      color: 'bg-blue-500 hover:bg-blue-600',
      stats: '47 sent this month'
    },
    {
      title: 'Treasury',
      description: 'Manage corporate funds and payroll',
      icon: Building2,
      href: '/app/treasury',
      color: 'bg-purple-500 hover:bg-purple-600',
      stats: '$12.4K managed'
    },
    {
      title: 'FOREX Trading',
      description: 'Trade currencies with live rates',
      icon: TrendingUp,
      href: '/app/forex',
      color: 'bg-green-500 hover:bg-green-600',
      stats: '€920 profit this week'
    },
    {
      title: 'Add Funds',
      description: 'Deposit money to your wallet',
      icon: CreditCard,
      href: '/app/deposit',
      color: 'bg-orange-500 hover:bg-orange-600',
      stats: 'Instant deposits'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Zap className="w-4 h-4" />
          <span>Powered by Aptos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={action.href}
              className="block p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-gray-300 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white transition-colors`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-gray-700">
                        {action.title}
                      </h4>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {action.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      {action.stats}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Featured Action */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold mb-1">New: Automated Payroll</h4>
            <p className="text-sm text-primary-100">
              Set up recurring payments for your team
            </p>
          </div>
          <Link
            href="/app/treasury?tab=payroll"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <span>Try Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}