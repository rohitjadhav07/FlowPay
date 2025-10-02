// Transaction storage utilities for wallet history

export interface StoredTransaction {
  hash: string;
  type: string;
  timestamp: string;
  success: boolean;
  sender?: string;
  receiver?: string;
  amount?: string;
  function?: string;
  gas_used?: string;
  events?: any[];
  version?: string;
}

export class TransactionStorage {
  private static getStorageKey(address: string): string {
    return `wallet_transactions_${address}`;
  }

  // Store a new transaction
  static storeTransaction(address: string, transaction: StoredTransaction): void {
    try {
      const storageKey = this.getStorageKey(address);
      const storedTxs = this.getTransactions(address);
      
      // Check if transaction already exists
      const existingIndex = storedTxs.findIndex(tx => tx.hash === transaction.hash);
      
      if (existingIndex >= 0) {
        // Update existing transaction
        storedTxs[existingIndex] = { ...storedTxs[existingIndex], ...transaction };
      } else {
        // Add new transaction at the beginning
        storedTxs.unshift(transaction);
      }
      
      // Keep only the last 100 transactions
      const limitedTxs = storedTxs.slice(0, 100);
      
      localStorage.setItem(storageKey, JSON.stringify(limitedTxs));
      console.log('💾 Transaction stored locally:', transaction.hash);
    } catch (error) {
      console.error('❌ Error storing transaction:', error);
    }
  }

  // Get all stored transactions for an address
  static getTransactions(address: string): StoredTransaction[] {
    try {
      const storageKey = this.getStorageKey(address);
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Error retrieving transactions:', error);
      return [];
    }
  }

  // Store a payment transaction
  static storePayment(
    senderAddress: string,
    recipientAddress: string,
    amount: string,
    txHash: string,
    functionName: string = '0x1::aptos_account::transfer'
  ): void {
    const transaction: StoredTransaction = {
      hash: txHash,
      type: 'user_transaction',
      timestamp: Date.now().toString() + '000', // Convert to microseconds
      success: true,
      sender: senderAddress,
      receiver: recipientAddress,
      amount: amount,
      function: functionName,
      gas_used: '0',
      events: [],
      version: '0'
    };

    this.storeTransaction(senderAddress, transaction);
  }

  // Store a batch payment (like payroll)
  static storeBatchPayment(
    senderAddress: string,
    payments: Array<{ recipient: string; amount: string; txHash: string }>
  ): void {
    payments.forEach(payment => {
      this.storePayment(
        senderAddress,
        payment.recipient,
        payment.amount,
        payment.txHash,
        'flowpay::treasury_vault::batch_payment'
      );
    });
  }

  // Update transaction status (for pending transactions)
  static updateTransactionStatus(
    address: string,
    txHash: string,
    updates: Partial<StoredTransaction>
  ): void {
    try {
      const transactions = this.getTransactions(address);
      const txIndex = transactions.findIndex(tx => tx.hash === txHash);
      
      if (txIndex >= 0) {
        transactions[txIndex] = { ...transactions[txIndex], ...updates };
        
        const storageKey = this.getStorageKey(address);
        localStorage.setItem(storageKey, JSON.stringify(transactions));
        
        console.log('🔄 Transaction updated:', txHash);
      }
    } catch (error) {
      console.error('❌ Error updating transaction:', error);
    }
  }

  // Clear all transactions for an address
  static clearTransactions(address: string): void {
    try {
      const storageKey = this.getStorageKey(address);
      localStorage.removeItem(storageKey);
      console.log('🗑️ Transactions cleared for:', address);
    } catch (error) {
      console.error('❌ Error clearing transactions:', error);
    }
  }

  // Get transaction statistics
  static getTransactionStats(address: string): {
    total: number;
    successful: number;
    failed: number;
    sent: number;
    received: number;
  } {
    const transactions = this.getTransactions(address);
    
    return {
      total: transactions.length,
      successful: transactions.filter(tx => tx.success).length,
      failed: transactions.filter(tx => !tx.success).length,
      sent: transactions.filter(tx => tx.sender === address).length,
      received: transactions.filter(tx => tx.receiver === address || (tx.sender !== address && tx.success)).length,
    };
  }

  // Export transactions to CSV
  static exportToCSV(address: string): string {
    const transactions = this.getTransactions(address);
    
    const headers = [
      'Hash',
      'Type',
      'Date',
      'Status',
      'Sender',
      'Receiver',
      'Amount (APT)',
      'Gas Used',
      'Function'
    ];
    
    const rows = transactions.map(tx => [
      tx.hash,
      tx.type,
      new Date(parseInt(tx.timestamp) / 1000).toISOString(),
      tx.success ? 'Success' : 'Failed',
      tx.sender || '',
      tx.receiver || '',
      tx.amount ? (parseInt(tx.amount) / 100000000).toFixed(8) : '0',
      tx.gas_used || '0',
      tx.function || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

// Helper function to format amount from octas to APT
export function formatAmountFromOctas(octas: string | number): string {
  try {
    const amount = typeof octas === 'string' ? parseInt(octas) : octas;
    return (amount / 100000000).toFixed(8);
  } catch {
    return '0.00000000';
  }
}

// Helper function to convert APT to octas
export function convertAptToOctas(apt: string | number): string {
  try {
    const amount = typeof apt === 'string' ? parseFloat(apt) : apt;
    return Math.floor(amount * 100000000).toString();
  } catch {
    return '0';
  }
}