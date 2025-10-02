'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap, Globe, Shield } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6"
            >
              <Zap className="w-4 h-4 mr-2" />
              Built on Aptos • CTRL+MOVE Hackathon
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Send Money
              <span className="text-gradient block">Globally</span>
              in Seconds
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              The first cross-border payment network that settles instantly using Aptos parallel execution. 
              Send money globally, manage treasury, and trade FOREX with institutional rates.
            </motion.p>

            {/* Key benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">2s</div>
                <div className="text-sm text-gray-600">Settlement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">$0.01</div>
                <div className="text-sm text-gray-600">Transaction Fee</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">24/7</div>
                <div className="text-sm text-gray-600">Availability</div>
              </div>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/app" className="btn-primary flex items-center justify-center space-x-2 text-lg px-8 py-4">
                <span>Launch App</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <button className="btn-secondary flex items-center justify-center space-x-2 text-lg px-8 py-4">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Right column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main card */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              {/* Payment interface mockup */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Send Payment</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600">Live</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">You Send</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value="1,000"
                        readOnly
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <div className="px-4 py-3 bg-gray-100 rounded-lg">
                        <span className="font-medium">🇺🇸 USD</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-primary-600 transform rotate-90" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">They Receive</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value="920.00"
                        readOnly
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <div className="px-4 py-3 bg-gray-100 rounded-lg">
                        <span className="font-medium">🇪🇺 EUR</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Settlement Time:</span>
                      <span className="text-green-600 font-semibold">~2 seconds</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-600">Fee:</span>
                      <span className="text-green-600 font-semibold">$0.01</span>
                    </div>
                  </div>

                  <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                    Send Payment
                  </button>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200"
            >
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium">Global</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200"
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Secure</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}