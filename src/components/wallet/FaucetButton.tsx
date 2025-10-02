'use client';

import { useState } from 'react';
import { useWallet } from '@/components/providers/Providers';
import { Droplets } from 'lucide-react';
import { contractHelpers } from '@/lib/aptos';
import toast from 'react-hot-toast';

interface FaucetButtonProps {
  onBalanceUpdate?: () => void;
}

export function FaucetButton({ onBalanceUpdate }: FaucetButtonProps = {}) {
  const { account } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleFaucet = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('💧 Requesting faucet funds...');
      
      // Just use the faucet directly - it should handle account initialization
      const success = await contractHelpers.fundFromFaucet(account.address);
      
      if (success) {
        toast.success('Faucet request successful! Check your balance in a few seconds.');
        setTimeout(() => {
          onBalanceUpdate?.();
        }, 5000);
      } else {
        // If faucet fails, open the web faucet
        toast.error('Faucet request failed. Opening web faucet...');
        const webFaucetUrl = `https://faucet.testnet.aptoslabs.com/?address=${account.address}`;
        window.open(webFaucetUrl, '_blank');
        toast.info('Use the web faucet to fund your account, then refresh this page.');
      }
    } catch (error) {
      console.error('Faucet error:', error);
      toast.error('Faucet request failed. Try the web faucet.');
      
      // Open web faucet as fallback
      const webFaucetUrl = `https://faucet.testnet.aptoslabs.com/?address=${account.address}`;
      window.open(webFaucetUrl, '_blank');
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return null;
  }

  return (
    <button
      onClick={handleFaucet}
      disabled={isLoading}
      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      <Droplets className="w-4 h-4" />
      <span>{isLoading ? 'Requesting...' : 'Get Testnet APT'}</span>
    </button>
  );
}