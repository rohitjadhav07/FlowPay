'use client';

import React, { ReactNode, useState, useEffect, createContext, useContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Wallet Context
interface WalletContextType {
  connected: boolean;
  account: { address: string } | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  signAndSubmitTransaction: (payload: any) => Promise<{ hash: string }>;
  wallets: any[];
  connecting: boolean;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  account: null,
  connect: async () => {},
  disconnect: () => {},
  signAndSubmitTransaction: async () => ({ hash: '' }),
  wallets: [],
  connecting: false,
});

export const useWallet = () => useContext(WalletContext);

function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<{ address: string } | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    // Only check if wallet is available, don't auto-connect
    const checkWallet = async () => {
      if (typeof window !== 'undefined' && (window as any).aptos) {
        try {
          // Check if already connected (user previously connected)
          const response = await (window as any).aptos.account();
          if (response) {
            console.log('🔗 Found existing wallet connection:', response.address);
            setConnected(true);
            setAccount({ address: response.address });
          }
        } catch (error) {
          // Wallet not connected - this is normal
          console.log('💡 Wallet available but not connected');
        }
      }
    };

    checkWallet();
  }, []);

  const connect = async () => {
    if (typeof window === 'undefined' || !(window as any).aptos) {
      throw new Error('Petra wallet not found. Please install Petra wallet.');
    }

    setConnecting(true);
    try {
      const response = await (window as any).aptos.connect();
      setConnected(true);
      setAccount({ address: response.address });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    if ((window as any).aptos) {
      try {
        await (window as any).aptos.disconnect();
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    }
    setConnected(false);
    setAccount(null);
  };

  const signAndSubmitTransaction = async (payload: any) => {
    if (!connected || !(window as any).aptos) {
      throw new Error('Wallet not connected');
    }

    try {
      const response = await (window as any).aptos.signAndSubmitTransaction(payload);
      return { hash: response.hash };
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  const wallets = [
    {
      name: 'Petra',
      icon: 'https://petra.app/favicon.ico',
    }
  ];

  const value = {
    connected,
    account,
    connect,
    disconnect,
    signAndSubmitTransaction,
    wallets,
    connecting,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}