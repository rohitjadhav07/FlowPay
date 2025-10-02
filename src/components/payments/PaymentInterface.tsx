'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/components/providers/Providers';
import { aptos, contractHelpers, parseAmount } from '@/lib/aptos';
import { TransactionStorage } from '@/lib/transactionStorage';
import { Select, Option } from '@/components/ui/Select';
import { Send, ArrowRightLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface PaymentInterfaceProps {
  onPaymentComplete?: (txHash: string) => void;
}

export function PaymentInterface({ onPaymentComplete }: PaymentInterfaceProps) {
  const { account, signAndSubmitTransaction } = useWallet();
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    fromCurrency: 'APT',
    toCurrency: 'APT',
    maxSlippage: '1.0'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [estimatedOutput, setEstimatedOutput] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number>(1.0);
  const [accountBalance, setAccountBalance] = useState<number>(100); // Demo balance

  const currencies = [
    { code: 'APT', name: 'Aptos', flag: '⚡', balance: '100.0000' },
    { code: 'USDC', name: 'USD Coin', flag: '💵', balance: '5000.00' },
    { code: 'USDT', name: 'Tether', flag: '💰', balance: '3000.00' },
    { code: 'ETH', name: 'Ethereum', flag: '🔷', balance: '2.5000' },
    { code: 'BTC', name: 'Bitcoin', flag: '₿', balance: '0.1500' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', balance: '4200.00' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧', balance: '3800.00' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', balance: '650000' },
  ];

  // Remove balance fetching for demo purposes

  useEffect(() => {
    // Fetch real FOREX rates
    const fetchRate = async () => {
      if (formData.fromCurrency !== formData.toCurrency) {
        try {
          const rate = await contractHelpers.getForexRate(
            formData.fromCurrency,
            formData.toCurrency
          );
          setExchangeRate(rate);
        } catch (error) {
          console.error('Error fetching FOREX rate:', error);
          setExchangeRate(1.0); // Fallback
        }
      } else {
        setExchangeRate(1.0);
      }
    };

    fetchRate();
  }, [formData.fromCurrency, formData.toCurrency]);

  useEffect(() => {
    if (formData.amount) {
      calculateEstimatedOutput(parseFloat(formData.amount));
    }
  }, [formData.amount, exchangeRate]);

  const calculateEstimatedOutput = (amount: number) => {
    if (!amount) {
      setEstimatedOutput('');
      return;
    }

    // Use real exchange rate from contract
    const estimated = (amount * exchangeRate).toFixed(4);
    setEstimatedOutput(estimated);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const swapCurrencies = () => {
    setFormData(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency
    }));
  };

  const handleSubmitPayment = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!formData.recipient || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate recipient address
    if (!formData.recipient.startsWith('0x') || formData.recipient.length !== 66) {
      toast.error('Please enter a valid Aptos address');
      return;
    }

    const amount = parseFloat(formData.amount);
    const amountInOctas = Math.floor(amount * 100000000); // Convert to octas

    setIsLoading(true);
    setTxStatus('pending');
    
    try {
      console.log('🚀 Initiating FlowPay payment...');
      console.log('From:', account.address);
      console.log('To:', formData.recipient);
      console.log('Amount:', amount, 'APT');
      console.log('Slippage:', formData.maxSlippage + '%');

      let payload;
      
      // Use simple APT transfer (most reliable for testnet)
      console.log('💰 Using direct APT transfer');
      payload = await contractHelpers.simpleTransfer(
        formData.recipient,
        amountInOctas
      );
      
      console.log('📝 Simple transfer payload:', payload);

      console.log('📝 Transaction payload:', payload);

      const response = await signAndSubmitTransaction(payload);
      console.log('✅ Transaction submitted:', response.hash);
      
      // Wait for transaction confirmation
      const confirmation = await aptos.waitForTransaction({ transactionHash: response.hash });
      
      if (!confirmation.success) {
        throw new Error('Transaction failed on blockchain');
      }
      
      // Store transaction in local storage for wallet history
      if (account?.address) {
        TransactionStorage.storePayment(
          account.address,
          formData.recipient,
          amountInOctas.toString(),
          response.hash
        );
      }
      
      setTxStatus('success');
      toast.success(`💰 Payment sent successfully!\n\n${amount} APT → ${formData.recipient.slice(0, 6)}...${formData.recipient.slice(-4)}\n\nTx: ${response.hash.slice(0, 8)}...`);
      onPaymentComplete?.(response.hash);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          recipient: '',
          amount: '',
          fromCurrency: 'APT',
          toCurrency: 'APT',
          maxSlippage: '1.0'
        });
        setTxStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Payment failed:', error);
      setTxStatus('error');
      
      let errorMessage = 'Payment failed. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('INSUFFICIENT_BALANCE')) {
          errorMessage = 'Insufficient balance. Please check your APT balance.';
        } else if (error.message.includes('INVALID_ARGUMENT')) {
          errorMessage = 'Invalid recipient address. Please check the address.';
        } else if (error.message.includes('rejected')) {
          errorMessage = 'Transaction rejected by user.';
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getFromCurrencyBalance = () => {
    const currency = currencies.find(c => c.code === formData.fromCurrency);
    return currency?.balance || '0.00';
  };

  const calculateFee = () => {
    const amount = parseFloat(formData.amount) || 0;
    return Math.max(0.01, amount * 0.001).toFixed(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-2 mb-6">
        <Send className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold">Send Money Globally</h2>
        <div className="ml-auto flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">Live Rates</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Address *
          </label>
          <input
            type="text"
            value={formData.recipient}
            onChange={(e) => handleInputChange('recipient', e.target.value)}
            placeholder="0x1234567890abcdef..."
            className="input-field"
            disabled={isLoading}
          />
        </div>

        {/* Amount and Currency Selection */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* You Send */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                You Send
              </label>
              <div className="space-y-2">
                <div className="flex">
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="1000"
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <div className="border-l-0 border border-gray-300 rounded-r-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <Select
                      value={formData.fromCurrency}
                      onChange={(value) => handleInputChange('fromCurrency', value)}
                      disabled={isLoading}
                      className="border-0 bg-transparent rounded-r-lg"
                    >
                      {currencies.map(currency => (
                        <Option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Balance: {getFromCurrencyBalance()} {formData.fromCurrency}
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-center md:col-span-2">
              <button
                onClick={swapCurrencies}
                disabled={isLoading}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <ArrowRightLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* They Receive */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                They Receive
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={estimatedOutput}
                  readOnly
                  placeholder="920.00"
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-50"
                />
                <div className="border-l-0 border border-gray-300 rounded-r-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <Select
                    value={formData.toCurrency}
                    onChange={(value) => handleInputChange('toCurrency', value)}
                    disabled={isLoading}
                    className="border-0 bg-transparent rounded-r-lg"
                  >
                    {currencies.map(currency => (
                      <Option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Advanced Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Slippage (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.maxSlippage}
                onChange={(e) => handleInputChange('maxSlippage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <Select
                value="standard"
                onChange={() => {}}
                disabled={isLoading}
              >
                <Option value="standard">Standard (2s)</Option>
                <Option value="fast">Fast (1s)</Option>
              </Select>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        {formData.amount && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-blue-50 rounded-lg p-4 space-y-3"
          >
            <h3 className="text-sm font-medium text-gray-900">Transaction Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Exchange Rate:</span>
                <span className="font-medium">1 {formData.fromCurrency} = {exchangeRate.toFixed(4)} {formData.toCurrency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Network Fee:</span>
                <span className="font-medium">${calculateFee()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Settlement Time:</span>
                <span className="text-green-600 font-medium">~2 seconds</span>
              </div>
              <div className="flex justify-between border-t border-blue-200 pt-2">
                <span className="font-medium text-gray-900">Total Cost:</span>
                <span className="font-semibold">{formData.amount} {formData.fromCurrency} + ${calculateFee()}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmitPayment}
          disabled={!account || !formData.recipient || !formData.amount || isLoading}
          className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Processing Payment...
            </>
          ) : txStatus === 'success' ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Payment Sent Successfully!
            </>
          ) : txStatus === 'error' ? (
            <>
              <AlertCircle className="w-5 h-5" />
              Try Again
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Payment
            </>
          )}
        </button>

        {/* Status Messages */}
        {txStatus === 'pending' && (
          <div className="text-center text-blue-600 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <div className="spinner"></div>
              <span>Processing payment on Aptos network...</span>
            </div>
          </div>
        )}
        
        {txStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-medium">Payment completed successfully!</p>
            <p className="text-green-600 text-sm mt-1">
              Funds will arrive in the recipient's account within 2 seconds.
            </p>
          </motion.div>
        )}

        {txStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-red-800 font-medium">Payment failed</p>
            <p className="text-red-600 text-sm mt-1">
              Please check your balance and try again.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}