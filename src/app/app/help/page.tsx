'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Book, 
  MessageCircle, 
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Zap,
  Shield,
  CreditCard
} from 'lucide-react';

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I connect my Petra wallet?",
      answer: "Click the 'Connect Wallet' button in the top right corner, then select Petra from the list. Make sure you have the Petra wallet extension installed and are on the Aptos Testnet.",
      category: "Getting Started"
    },
    {
      question: "Why is my balance showing as 0?",
      answer: "If your balance shows 0, you may need testnet APT tokens. Click the 'Get Testnet APT' button to fund your account from the faucet. Make sure you're connected to Aptos Testnet.",
      category: "Wallet"
    },
    {
      question: "How fast are cross-border payments?",
      answer: "FlowPay leverages Aptos' parallel execution to settle payments in under 2 seconds, compared to 3-5 days for traditional banking.",
      category: "Payments"
    },
    {
      question: "What are the transaction fees?",
      answer: "FlowPay charges only 0.1% per transaction (minimum $0.01), which is 95% cheaper than traditional wire transfer fees.",
      category: "Fees"
    },
    {
      question: "How does treasury management work?",
      answer: "Our treasury tools allow you to automate payroll, manage multi-currency portfolios, and set up automated hedging strategies to minimize FOREX risk.",
      category: "Treasury"
    },
    {
      question: "Is FlowPay secure?",
      answer: "Yes! FlowPay uses Move smart contracts with formal verification, multi-signature security, and follows industry best practices for DeFi security.",
      category: "Security"
    },
    {
      question: "Can I use FlowPay for business payments?",
      answer: "Absolutely! FlowPay is designed for both individual and business use, with special features for corporate treasury management and automated payroll.",
      category: "Business"
    },
    {
      question: "What currencies are supported?",
      answer: "Currently, FlowPay supports APT and major stablecoins on Aptos Testnet. We're working on adding more currency pairs and fiat on-ramps.",
      category: "Currencies"
    }
  ];

  const categories = [
    { name: "Getting Started", icon: Zap, color: "text-blue-600" },
    { name: "Wallet", icon: CreditCard, color: "text-green-600" },
    { name: "Payments", icon: MessageCircle, color: "text-purple-600" },
    { name: "Security", icon: Shield, color: "text-red-600" },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
        <p className="text-xl text-gray-600">Get help with FlowPay and find answers to common questions</p>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help articles, FAQs, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
          />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <Book className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentation</h3>
          <p className="text-gray-600 mb-4">Complete guides and API documentation</p>
          <button className="btn-primary w-full">
            View Docs
          </button>
        </div>

        <div className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
          <p className="text-gray-600 mb-4">Chat with our support team</p>
          <button className="btn-primary w-full">
            Start Chat
          </button>
        </div>

        <div className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
          <p className="text-gray-600 mb-4">Get help via email</p>
          <button className="btn-primary w-full">
            Send Email
          </button>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="card text-center hover:shadow-lg transition-shadow cursor-pointer"
            >
              <category.icon className={`w-8 h-8 ${category.color} mx-auto mb-3`} />
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
            </div>
          ))}
        </div>
      </motion.div>

      {/* FAQs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="card">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                    {faq.category}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              {expandedFaq === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card bg-gradient-to-r from-primary-50 to-purple-50"
      >
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-6">Our support team is here to help you 24/7</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <MessageCircle className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Discord</h4>
              <p className="text-sm text-gray-600">Join our community</p>
              <a href="#" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                discord.gg/flowpay
              </a>
            </div>
            
            <div className="text-center">
              <Mail className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Email</h4>
              <p className="text-sm text-gray-600">Get support via email</p>
              <a href="mailto:support@flowpay.finance" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                support@flowpay.finance
              </a>
            </div>
            
            <div className="text-center">
              <ExternalLink className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Documentation</h4>
              <p className="text-sm text-gray-600">Technical guides</p>
              <a href="#" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                docs.flowpay.finance
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            <p className="text-gray-600">All systems operational</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-600">Operational</span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Payment Processing</span>
            <span className="text-green-600 font-medium">✓ Operational</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">FOREX Engine</span>
            <span className="text-green-600 font-medium">✓ Operational</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Treasury Services</span>
            <span className="text-green-600 font-medium">✓ Operational</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}