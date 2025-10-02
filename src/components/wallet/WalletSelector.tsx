'use client';

import { useState } from 'react';
import { useWallet } from '@/components/providers/Providers';
import { Wallet, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export function WalletSelector() {
  const { wallets, connect, connected, connecting } = useWallet();
  const [showWallets, setShowWallets] = useState(false);

  const handleConnect = async (walletName: string) => {
    try {
      await connect(walletName);
      toast.success('Wallet connected successfully!');
      setShowWallets(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  if (connected) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowWallets(!showWallets)}
        disabled={connecting}
        className="btn-primary flex items-center space-x-2"
      >
        <Wallet className="w-4 h-4" />
        <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {showWallets && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Connect Wallet</h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose a wallet to connect to FlowPay
              </p>
            </div>
            
            <div className="p-2">
              {wallets.length > 0 ? wallets.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => handleConnect(wallet.name)}
                  disabled={connecting}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img
                    src={wallet.icon}
                    alt={wallet.name}
                    className="w-8 h-8 rounded-lg"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{wallet.name}</p>
                    <p className="text-sm text-gray-500">
                      {wallet.name === 'Petra' && 'Most popular Aptos wallet'}
                      {wallet.name === 'Martian' && 'Multi-chain wallet'}
                      {wallet.name === 'Fewcha' && 'Secure Aptos wallet'}
                    </p>
                  </div>
                </button>
              )) : (
                <div className="p-4 text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Wallet className="w-8 h-8 text-primary-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Install Petra Wallet</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      To use FlowPay, you need to install the Petra wallet extension.
                    </p>
                    <a
                      href="https://petra.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Install Petra Wallet
                    </a>
                  </div>
                  <div className="text-xs text-gray-500 mt-4">
                    After installing, refresh this page and connect your wallet.
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <p className="text-xs text-gray-600">
                By connecting a wallet, you agree to our{' '}
                <a href="#" className="text-primary-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}