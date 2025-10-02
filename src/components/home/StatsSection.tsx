'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Zap } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      label: 'Transaction Volume',
      value: '$2.4M+',
      change: '+127%',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      label: 'Active Users',
      value: '12,450',
      change: '+89%',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      label: 'Countries Supported',
      value: '45+',
      change: '+12',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      label: 'Avg Settlement Time',
      value: '1.8s',
      change: '-0.3s',
      icon: Zap,
      color: 'text-orange-600',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-xl text-gray-600">
            Real-time stats from our global payment network
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              
              <div className="text-gray-600 mb-2">
                {stat.label}
              </div>
              
              <div className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 
                stat.change.startsWith('-') && stat.label.includes('Time') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} this month
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live activity indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live: 47 payments processing</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}