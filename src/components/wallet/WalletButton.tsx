'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/components/providers/Providers';
import { Wallet, ChevronDown } from 'lucide-react';

export function WalletButton() {
  const { connected, account, disconnect } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  if (!connected) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <Wallet className="w-4 h-4 text-primary-600" />
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-gray-900">
            {account?.address.slice(0, 6)}...{account?.address.slice(-4)}
          </div>
          <div className="text-xs text-gray-500">
            Connected
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Wallet</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Status</label>
                <div className="text-lg font-semibold text-green-600">
                  Connected to Testnet
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500">Address</label>
                <div className="text-xs font-mono text-gray-700 break-all">
                  {account?.address}
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-100 space-y-2">
                
                <button
                  onClick={() => {
                    if (account?.address) {
                      window.open(`https://explorer.aptoslabs.com/account/${account.address}?network=testnet`, '_blank');
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  View in Explorer
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(account?.address || '');
                    alert('Address copied to clipboard!');
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  Copy Address
                </button>
                
                <button
                  onClick={() => {
                    disconnect();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}