'use client';

import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Send, 
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export function DashboardStats() {
  const stats = [
    {
      title: 'Total Balance',
      value: '$12,450.00',
      change: '+2.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      description: 'Across all currencies'
    },
    {
      title: 'This Month',
      value: '$8,750.00',
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600',
      description: 'Total sent'
    },
    {
      title: 'Transactions',
      value: '47',
      change: '+8',
      changeType: 'positive' as const,
      icon: Send,
      color: 'bg-purple-100 text-purple-600',
      description: 'This month'
    },
    {
      title: 'Saved in Fees',
      value: '$2,340.00',
      change: '+15.7%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-orange-100 text-orange-600',
      description: 'vs traditional banks'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between">
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.changeType === 'positive' ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{stat.change}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm font-medium text-gray-600 mt-1">{stat.title}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}