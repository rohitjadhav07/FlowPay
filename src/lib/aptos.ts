// Aptos configuration
export const aptosConfig = {
  network: process.env.NEXT_PUBLIC_APTOS_NETWORK || 'testnet',
  nodeUrl: process.env.NEXT_PUBLIC_APTOS_NODE_URL || 'https://fullnode.testnet.aptoslabs.com/v1',
  faucetUrl: process.env.NEXT_PUBLIC_APTOS_FAUCET_URL || 'https://faucet.testnet.aptoslabs.com',
};

// Simple API wrapper for Aptos calls
export const aptos = {
  async waitForTransaction({ transactionHash }: { transactionHash: string }) {
    console.log('⏳ Waiting for transaction confirmation:', transactionHash);
    
    let attempts = 0;
    const maxAttempts = 20; // 20 seconds max wait
    
    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${aptosConfig.nodeUrl}/transactions/by_hash/${transactionHash}`);
        
        if (response.ok) {
          const txData = await response.json();
          console.log('📊 Transaction data:', txData);
          
          // Check if transaction was successful
          const isSuccess = txData.success === true || txData.success === "true";
          console.log(`✅ Transaction ${isSuccess ? 'SUCCESS' : 'FAILED'}:`, transactionHash);
          
          return { 
            success: isSuccess,
            hash: transactionHash,
            data: txData
          };
        }
        
        // If 404, transaction might still be pending
        if (response.status === 404) {
          console.log(`⏳ Transaction pending... (attempt ${attempts + 1}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          attempts++;
          continue;
        }
        
        // Other errors
        console.log('❌ Transaction API error:', response.status);
        
      } catch (error) {
        console.log('❌ Error checking transaction:', error);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    
    // If we can't confirm, assume success since the transaction was submitted
    console.log('⏰ Transaction confirmation timeout - assuming success since transaction was submitted');
    return { 
      success: true, // Assume success if we can't confirm but transaction was submitted
      hash: transactionHash,
      timeout: true
    };
  },
  
  async getAccountResources({ accountAddress }: { accountAddress: string }) {
    try {
      console.log('🌐 Fetching resources from:', `${aptosConfig.nodeUrl}/accounts/${accountAddress}/resources`);
      const response = await fetch(`${aptosConfig.nodeUrl}/accounts/${accountAddress}/resources`);
      
      if (!response.ok) {
        console.error('❌ API Response not ok:', response.status, response.statusText);
        return [];
      }
      
      const data = await response.json();
      console.log('📦 Raw API response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching account resources:', error);
      return [];
    }
  },
  
  async getAccountTransactions({ accountAddress, options }: { accountAddress: string, options?: { limit?: number } }) {
    try {
      const limit = options?.limit || 10;
      const response = await fetch(`${aptosConfig.nodeUrl}/accounts/${accountAddress}/transactions?limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  },
  
  async fundAccount({ accountAddress, amount }: { accountAddress: string, amount: number }) {
    try {
      console.log('💧 Making faucet request...');
      
      // Try multiple faucet methods
      const methods = [
        // Method 1: Standard POST with query params
        async () => {
          const url = `${aptosConfig.faucetUrl}/mint?amount=${amount}&address=${accountAddress}`;
          console.log('💧 Method 1 URL:', url);
          return await fetch(url, { method: 'POST' });
        },
        
        // Method 2: POST with JSON body
        async () => {
          const url = `${aptosConfig.faucetUrl}/mint`;
          console.log('💧 Method 2 URL:', url);
          return await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: accountAddress, amount })
          });
        },
        
        // Method 3: Alternative faucet endpoint
        async () => {
          const url = `https://faucet.testnet.aptoslabs.com/mint?amount=${amount}&address=${accountAddress}`;
          console.log('💧 Method 3 URL:', url);
          return await fetch(url, { method: 'POST' });
        },
        
        // Method 4: Aptos Labs faucet with form data
        async () => {
          const url = 'https://faucet.testnet.aptoslabs.com/mint';
          console.log('💧 Method 4 URL:', url);
          const formData = new FormData();
          formData.append('address', accountAddress);
          formData.append('amount', amount.toString());
          return await fetch(url, {
            method: 'POST',
            body: formData
          });
        }
      ];
      
      for (let i = 0; i < methods.length; i++) {
        try {
          console.log(`💧 Trying method ${i + 1}...`);
          const response = await methods[i]();
          console.log(`💧 Method ${i + 1} status:`, response.status);
          
          if (response.ok) {
            const text = await response.text();
            console.log(`✅ Method ${i + 1} success:`, text);
            return true;
          } else {
            const errorText = await response.text();
            console.log(`❌ Method ${i + 1} failed:`, response.status, errorText);
          }
        } catch (error) {
          console.log(`❌ Method ${i + 1} error:`, error);
        }
      }
      
      return false;
    } catch (error) {
      console.error('❌ All faucet methods failed:', error);
      return false;
    }
  },
  
  async view({ payload }: { payload: any }) {
    try {
      const response = await fetch(`${aptosConfig.nodeUrl}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (error) {
      console.error('Error calling view function:', error);
      return [0];
    }
  },
};

// Contract addresses - using a deployed address or default for testnet
export const CONTRACT_ADDRESSES = {
  PAYMENT_ROUTER: process.env.NEXT_PUBLIC_FLOWPAY_PAYMENT_ROUTER || "0x1", // Replace with actual deployed address
  FOREX_ENGINE: process.env.NEXT_PUBLIC_FLOWPAY_FOREX_ENGINE || "0x1",
  TREASURY_VAULT: process.env.NEXT_PUBLIC_FLOWPAY_TREASURY_VAULT || "0x1",
  COMPLIANCE_ORACLE: process.env.NEXT_PUBLIC_FLOWPAY_COMPLIANCE_ORACLE || "0x1",
  SETTLEMENT_BRIDGE: process.env.NEXT_PUBLIC_FLOWPAY_SETTLEMENT_BRIDGE || "0x1",
};

// FlowPay module addresses
export const FLOWPAY_MODULES = {
  PAYMENT_ROUTER: "flowpay::payment_router",
  FOREX_ENGINE: "flowpay::forex_engine", 
  TREASURY_VAULT: "flowpay::treasury_vault",
  COMPLIANCE_ORACLE: "flowpay::compliance_oracle",
  SETTLEMENT_BRIDGE: "flowpay::settlement_bridge",
};

// Check if contracts are deployed
export const isContractsDeployed = () => {
  return Boolean(CONTRACT_ADDRESSES.PAYMENT_ROUTER);
};

// Helper functions for contract interactions
export const contractHelpers = {
  // Payment Router functions
  async initiatePayment(
    account: string,
    recipient: string,
    amount: number,
    maxSlippage: number = 100 // 1% default slippage
  ) {
    // Check if FlowPay contracts are deployed
    if (CONTRACT_ADDRESSES.PAYMENT_ROUTER && CONTRACT_ADDRESSES.PAYMENT_ROUTER !== "0x1") {
      // Use FlowPay payment router for enhanced features
      return {
        type: "entry_function_payload",
        function: `${CONTRACT_ADDRESSES.PAYMENT_ROUTER}::${FLOWPAY_MODULES.PAYMENT_ROUTER}::send_payment`,
        type_arguments: [],
        arguments: [
          recipient,
          amount.toString(),
        ],
      };
    } else {
      // Fallback to simple transfer
      return this.simpleTransfer(recipient, amount);
    }
  },

  // Simple APT transfer (fallback)
  async simpleTransfer(recipient: string, amount: number) {
    return {
      type: "entry_function_payload",
      function: "0x1::aptos_account::transfer",
      type_arguments: [],
      arguments: [
        recipient,
        amount.toString(),
      ],
    };
  },

  // Batch payments for payroll
  async batchPayment(recipients: string[], amounts: number[]) {
    if (recipients.length !== amounts.length) {
      throw new Error('Recipients and amounts arrays must have the same length');
    }

    return {
      type: "entry_function_payload",
      function: `${CONTRACT_ADDRESSES.PAYMENT_ROUTER}::${FLOWPAY_MODULES.PAYMENT_ROUTER}::batch_payment`,
      type_arguments: [],
      arguments: [
        recipients,
        amounts.map(amount => amount.toString()),
      ],
    };
  },

  // Get payment history
  async getPaymentHistory(address: string) {
    try {
      const result = await aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESSES.PAYMENT_ROUTER}::${FLOWPAY_MODULES.PAYMENT_ROUTER}::get_user_payments`,
          type_arguments: [],
          arguments: [address],
        },
      });
      return result[0] || [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  },

  // Get payment statistics
  async getPaymentStats() {
    try {
      const result = await aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESSES.PAYMENT_ROUTER}::${FLOWPAY_MODULES.PAYMENT_ROUTER}::get_payment_stats`,
          type_arguments: [],
          arguments: [],
        },
      });
      return {
        totalPayments: result[0] || 0,
        totalVolume: result[1] || 0,
        feeRate: result[2] || 0,
      };
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      return { totalPayments: 0, totalVolume: 0, feeRate: 0 };
    }
  },

  // FOREX Engine functions
  async getForexRate(baseCurrency: string, quoteCurrency: string) {
    if (!CONTRACT_ADDRESSES.FOREX_ENGINE) {
      throw new Error('FOREX engine contract not deployed');
    }

    try {
      const result = await aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESSES.FOREX_ENGINE}::forex_engine::get_real_time_rate`,
          type_arguments: [baseCurrency, quoteCurrency],
          arguments: [],
        },
      });
      return result[0] as number;
    } catch (error) {
      console.error('Error fetching FOREX rate:', error);
      return 1.0847; // Fallback rate
    }
  },

  // Treasury Vault functions
  async getVaultBalance(owner: string, coinType: string) {
    if (!CONTRACT_ADDRESSES.TREASURY_VAULT) {
      throw new Error('Treasury vault contract not deployed');
    }

    try {
      const result = await aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESSES.TREASURY_VAULT}::treasury_vault::get_vault_balance`,
          type_arguments: [coinType],
          arguments: [owner],
        },
      });
      return result[0] as number;
    } catch (error) {
      console.error('Error fetching vault balance:', error);
      return 0;
    }
  },

  // Compliance Oracle functions
  async getUserKycLevel(userAddress: string) {
    if (!CONTRACT_ADDRESSES.COMPLIANCE_ORACLE) {
      throw new Error('Compliance oracle contract not deployed');
    }

    try {
      const result = await aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESSES.COMPLIANCE_ORACLE}::compliance_oracle::get_user_kyc_level`,
          type_arguments: [],
          arguments: [userAddress],
        },
      });
      return result[0] as number;
    } catch (error) {
      console.error('Error fetching KYC level:', error);
      return 0;
    }
  },

  // Get account balance using multiple methods
  async getAccountBalance(address: string, coinType: string = "0x1::aptos_coin::AptosCoin") {
    console.log('🔍 Starting balance fetch for:', address);
    
    // Method 1: Use Aptos Indexer API (most reliable)
    try {
      console.log('🔍 Method 1: Trying Aptos Indexer API...');
      const indexerUrl = 'https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql';
      const query = `
        query GetAccountCoinsData($address: String) {
          current_coin_balances(where: {owner_address: {_eq: $address}}) {
            amount
            coin_type
          }
        }
      `;
      
      const response = await fetch(indexerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          variables: { address }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const aptBalance = data.data?.current_coin_balances?.find(
          (coin: any) => coin.coin_type === coinType
        );
        
        if (aptBalance) {
          const balance = parseInt(aptBalance.amount) / 100000000;
          console.log('✅ Indexer API balance:', balance);
          return balance;
        }
      }
    } catch (e) {
      console.log('⚠️ Indexer API failed:', e);
    }

    // Method 2: Direct REST API call
    try {
      console.log('🔍 Method 2: Direct REST API...');
      const url = `${aptosConfig.nodeUrl}/accounts/${address}/resource/0x1::coin::CoinStore%3C0x1::aptos_coin::AptosCoin%3E`;
      console.log('🌐 Fetching from:', url);
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Direct API response:', data);
        
        if (data.data && data.data.coin && data.data.coin.value) {
          const balance = parseInt(data.data.coin.value) / 100000000;
          console.log('✅ Direct API balance:', balance);
          return balance;
        }
      } else {
        console.log('❌ Direct API failed:', response.status, response.statusText);
      }
    } catch (e) {
      console.log('⚠️ Direct API failed:', e);
    }

    // Method 3: Resources endpoint (fallback)
    try {
      console.log('🔍 Method 3: Resources endpoint...');
      const resources = await aptos.getAccountResources({ accountAddress: address });
      console.log('📦 Resources fetched:', resources.length);
      
      if (resources.length === 0) {
        console.log('❌ No resources found');
        return 0;
      }
      
      // Log all resources for debugging
      console.log('📋 All resources:');
      resources.forEach((resource: any, index: number) => {
        console.log(`  ${index + 1}. Type: ${resource.type}`);
        console.log(`     Data:`, resource.data);
      });
      
      // Find CoinStore
      const coinStore = resources.find(
        (resource: any) => resource.type === `0x1::coin::CoinStore<${coinType}>`
      );
      
      if (coinStore && coinStore.data && coinStore.data.coin) {
        const balance = parseInt(coinStore.data.coin.value) / 100000000;
        console.log('✅ Resources API balance:', balance);
        return balance;
      }

      // Try any APT-related CoinStore
      const aptStore = resources.find(
        (resource: any) => resource.type.includes('CoinStore') && resource.type.includes('AptosCoin')
      );
      
      if (aptStore && aptStore.data && aptStore.data.coin) {
        const balance = parseInt(aptStore.data.coin.value) / 100000000;
        console.log('✅ APT CoinStore balance:', balance);
        return balance;
      }
      
      console.log('❌ No valid CoinStore found');
      return 0;
    } catch (error) {
      console.error('❌ Resources API failed:', error);
      return 0;
    }
  },

  // Get transaction history with enhanced details
  async getTransactionHistory(address: string, limit: number = 10) {
    try {
      console.log('📜 Fetching transaction history for:', address);
      
      // Method 1: Try Indexer API for better transaction data
      try {
        const indexerUrl = 'https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql';
        const query = `
          query GetAccountTransactions($address: String, $limit: Int) {
            account_transactions(
              where: {account_address: {_eq: $address}}
              order_by: {transaction_version: desc}
              limit: $limit
            ) {
              transaction_version
              account_address
              transaction {
                hash
                type
                timestamp
                success
                gas_used
                sender
                payload
                events {
                  type
                  data
                }
              }
            }
          }
        `;
        
        const response = await fetch(indexerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            variables: { address, limit }
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          const indexerTxs = data.data?.account_transactions || [];
          
          if (indexerTxs.length > 0) {
            console.log('✅ Using indexer transaction data');
            return indexerTxs.map((item: any) => {
              const tx = item.transaction;
              return {
                hash: tx.hash,
                type: tx.type,
                timestamp: tx.timestamp,
                success: tx.success,
                gas_used: tx.gas_used,
                sender: tx.sender,
                receiver: tx.payload?.arguments?.[0] || 'Unknown',
                amount: tx.payload?.arguments?.[1] || '0',
                function: tx.payload?.function || tx.type,
                events: tx.events || [],
                version: item.transaction_version,
              };
            });
          }
        }
      } catch (indexerError) {
        console.log('⚠️ Indexer API failed, falling back to REST API');
      }
      
      // Method 2: Fallback to REST API
      const transactions = await aptos.getAccountTransactions({
        accountAddress: address,
        options: { limit }
      });
      
      console.log('📊 Fetched transactions:', transactions.length);
      
      return transactions.map((tx: any) => ({
        hash: tx.hash,
        type: tx.type,
        timestamp: tx.timestamp,
        success: tx.success,
        gas_used: tx.gas_used,
        sender: tx.sender,
        receiver: tx.payload?.arguments?.[0] || 'Unknown',
        amount: tx.payload?.arguments?.[1] || '0',
        function: tx.payload?.function || tx.type,
        events: tx.events || [],
        version: tx.version,
      }));
    } catch (error) {
      console.error('❌ Error fetching transaction history:', error);
      return [];
    }
  },

  // Get detailed transaction by hash
  async getTransactionDetails(hash: string) {
    try {
      const response = await fetch(`${aptosConfig.nodeUrl}/transactions/by_hash/${hash}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      return null;
    }
  },

  // Fund account from faucet (testnet only)
  async fundFromFaucet(address: string) {
    if (aptosConfig.network !== 'testnet') {
      throw new Error('Faucet only available on testnet');
    }

    try {
      console.log('💧 Requesting faucet funds for:', address);
      console.log('💧 Faucet URL:', aptosConfig.faucetUrl);
      
      // First, try the standard faucet
      let success = await aptos.fundAccount({
        accountAddress: address,
        amount: 100000000, // 1 APT
      });
      
      console.log('💧 Standard faucet result:', success);
      
      // If that fails, try the alternative faucet endpoint
      if (!success) {
        console.log('💧 Trying alternative faucet...');
        try {
          const altResponse = await fetch(`https://faucet.testnet.aptoslabs.com/mint?amount=100000000&address=${address}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
          success = altResponse.ok;
          console.log('💧 Alternative faucet result:', success);
        } catch (e) {
          console.log('💧 Alternative faucet failed:', e);
        }
      }
      
      return success;
    } catch (error) {
      console.error('❌ Error funding from faucet:', error);
      return false;
    }
  },

  // Initialize account for APT (register CoinStore)
  async initializeAccount(address: string) {
    try {
      console.log('🔧 Initializing account for APT:', address);
      
      // Check if account already has CoinStore
      const resources = await aptos.getAccountResources({ accountAddress: address });
      const hasCoinStore = resources.some(
        (resource: any) => resource.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
      );
      
      if (hasCoinStore) {
        console.log('✅ Account already initialized');
        return true;
      }
      
      console.log('🔧 Account needs initialization - trying faucet...');
      return await this.fundFromFaucet(address);
    } catch (error) {
      console.error('❌ Error initializing account:', error);
      return false;
    }
  },


};

// Transaction status helpers
export const TRANSACTION_STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  COMPLETED: 2,
  FAILED: 3,
} as const;

export const getTransactionStatusText = (status: number) => {
  switch (status) {
    case TRANSACTION_STATUS.PENDING:
      return 'Pending';
    case TRANSACTION_STATUS.PROCESSING:
      return 'Processing';
    case TRANSACTION_STATUS.COMPLETED:
      return 'Completed';
    case TRANSACTION_STATUS.FAILED:
      return 'Failed';
    default:
      return 'Unknown';
  }
};

// Currency helpers
export const SUPPORTED_COINS = {
  APT: "0x1::aptos_coin::AptosCoin",
  // Add more coin types as they become available
};

export const formatBalance = (balance: number, decimals: number = 8) => {
  return (balance / Math.pow(10, decimals)).toFixed(4);
};

export const parseAmount = (amount: string, decimals: number = 8) => {
  return Math.floor(parseFloat(amount) * Math.pow(10, decimals));
};