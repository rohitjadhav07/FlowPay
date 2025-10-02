'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { CONTRACT_ADDRESSES } from '@/lib/aptos';

export function DeploymentStatus() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const contractsDeployed = Object.values(CONTRACT_ADDRESSES).some(addr => addr && addr !== "0x1");
  
  return (
    <div className={`fixed bottom-4 right-4 p-3 rounded-lg shadow-lg border ${
      contractsDeployed 
        ? 'bg-green-50 border-green-200 text-green-800'
        : 'bg-blue-50 border-blue-200 text-blue-800'
    }`}>
      <div className="flex items-center space-x-2 text-sm">
        {contractsDeployed ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>FlowPay Contracts Active</span>
          </>
        ) : (
          <>
            <Clock className="w-4 h-4" />
            <span>Using Direct APT Transfers</span>
          </>
        )}
      </div>
      {!contractsDeployed && (
        <p className="text-xs mt-1 text-blue-600">
          Deploy contracts for enhanced features
        </p>
      )}
    </div>
  );
}