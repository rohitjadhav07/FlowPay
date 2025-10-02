'use client';

import { motion } from 'framer-motion';
import { 
  Zap, 
  Globe, 
  Shield, 
  TrendingUp, 
  Users, 
  Building2,
  Clock,
  DollarSign,
  Smartphone
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Settlement',
      description: 'Payments settle in under 2 seconds using Aptos parallel execution',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: DollarSign,
      title: 'Ultra-Low Fees',
      description: 'Pay just $0.01 per transaction vs $50+ traditional wire fees',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Send money to 45+ countries with real-time FOREX rates',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'Move smart contracts with formal verification and multi-sig',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Building2,
      title: 'Treasury Management',
      description: 'Automated payroll, hedging, and corporate treasury tools',
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      icon: TrendingUp,
      title: 'FOREX Trading',
      description: 'Trade currencies with institutional rates and deep liquidity',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: Users,
      title: 'Bulk Payments',
      description: 'Process 1000+ payments simultaneously with parallel execution',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: Smartphone,
      title: 'Simple UX',
      description: 'No seed phrases needed with account abstraction',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Send money anytime, anywhere - no banking hours',
      color: 'bg-teal-100 text-teal-600',
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Everything You Need for Global Payments
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            FlowPay combines the speed of Aptos with the power of traditional finance 
            to create the ultimate payment experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Integration showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Built on Aptos Ecosystem
          </h3>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {[
              'Merkle Trade',
              'Hyperion',
              'Circle',
              'Tapp',
              'Aptos Labs',
            ].map((partner, index) => (
              <div
                key={index}
                className="bg-white px-6 py-3 rounded-lg border border-gray-200 font-medium text-gray-700"
              >
                {partner}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}