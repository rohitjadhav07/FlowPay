'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Zap, 
  Globe, 
  Shield, 
  TrendingUp,
  Users,
  Clock,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { StatsSection } from '@/components/home/StatsSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { HeroSection } from '@/components/home/HeroSection';
import { CTASection } from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-gradient">FlowPay</span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  How it Works
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Pricing
                </a>
                <Link href="/app" className="btn-primary">
                  Launch App
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How FlowPay Works
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Three simple steps to send money globally in seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                description: 'Connect your Aptos wallet or create one with Circle Wallet SDK',
                icon: Shield,
              },
              {
                step: '02',
                title: 'Enter Details',
                description: 'Specify recipient, amount, and currencies with real-time rates',
                icon: Globe,
              },
              {
                step: '03',
                title: 'Instant Settlement',
                description: 'Payment processes in parallel and settles in under 2 seconds',
                icon: Zap,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose FlowPay?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              See how we compare to traditional and crypto solutions
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-primary-600">FlowPay</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-600">Traditional Banks</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-600">Other Crypto</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: 'Settlement Time',
                    flowpay: '2 seconds',
                    traditional: '3-5 days',
                    crypto: '10+ minutes',
                  },
                  {
                    feature: 'Transaction Cost',
                    flowpay: '$0.01',
                    traditional: '$50+',
                    crypto: '$5-20',
                  },
                  {
                    feature: 'Throughput',
                    flowpay: '10,000+ TPS',
                    traditional: '100 TPS',
                    crypto: '15 TPS',
                  },
                  {
                    feature: 'Availability',
                    flowpay: '24/7',
                    traditional: 'Business Hours',
                    crypto: '24/7',
                  },
                  {
                    feature: 'User Experience',
                    flowpay: 'Simple',
                    traditional: 'Complex',
                    crypto: 'Very Complex',
                  },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                    <td className="py-4 px-6 text-center text-primary-600 font-semibold">{row.flowpay}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.traditional}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.crypto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="text-2xl font-bold text-gradient">FlowPay</span>
              <p className="mt-4 text-gray-400">
                The future of global payments, built on Aptos.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Send Money</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Treasury</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FOREX</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FlowPay. All rights reserved. Built for CTRL+MOVE Hackathon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}