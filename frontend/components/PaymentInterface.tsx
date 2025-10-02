import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { Send, ArrowRightLeft, Clock, CheckCircle } from 'lucide-react';

interface PaymentInterfaceProps {
  onPaymentComplete?: (txHash: string) => void;
}

export const PaymentInterface: React.FC<PaymentInterfaceProps> = ({ onPaymentComplete }) => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    maxSlippage: '1.0'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [estimatedOutput, setEstimatedOutput] = useState<string>('');

  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);

  const currencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'USDC', name: 'USD Coin', flag: '💰' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update estimated output when amount changes
    if (field === 'amount' && value) {
      calculateEstimatedOutput(parseFloat(value));
    }
  };

  const calculateEstimatedOutput = async (amount: number) => {
    try {
      // In production, this would call the FOREX engine
      // For demo, using mock exchange rate
      const mockRate = 0.92; // USD to EUR
      const estimated = (amount * mockRate).toFixed(2);
      setEstimatedOutput(estimated);
    } catch (error) {
      console.error('Error calculating output:', error);
    }
  };

  const handleSubmitPayment = async () => {
    if (!account) return;
    
    setIsLoading(true);
    setTxStatus('pending');
    
    try {
      const payload = {
        type: "entry_function_payload",
        function: "flowpay::payment_router::initiate_payment",
        type_arguments: ["0x1::aptos_coin::AptosCoin", "0x1::aptos_coin::AptosCoin"], // Mock types
        arguments: [
          formData.recipient,
          (parseFloat(formData.amount) * 100000000).toString(), // Convert to smallest unit
          (parseFloat(formData.maxSlippage) * 100).toString(), // Convert to basis points
        ],
      };

      const response = await signAndSubmitTransaction(payload);
      
      // Wait for transaction confirmation
      await aptos.waitForTransaction({ transactionHash: response.hash });
      
      setTxStatus('success');
      onPaymentComplete?.(response.hash);
      
      // Reset form
      setFormData({
        recipient: '',
        amount: '',
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        maxSlippage: '1.0'
      });
      
    } catch (error) {
      console.error('Payment failed:', error);
      setTxStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFormData(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Send className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Send Money Globally</h2>
      </div>

      <div className="space-y-4">
        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            value={formData.recipient}
            onChange={(e) => handleInputChange('recipient', e.target.value)}
            placeholder="0x1234..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Amount and Currency Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                You Send
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="1000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={formData.fromCurrency}
                  onChange={(e) => handleInputChange('fromCurrency', e.target.value)}
                  className="px-3 py-2 border-l-0 border border-gray-300 rounded-r-lg bg-gray-50"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={swapCurrencies}
              className="mt-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                They Receive
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={estimatedOutput}
                  readOnly
                  placeholder="920.00"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50"
                />
                <select
                  value={formData.toCurrency}
                  onChange={(e) => handleInputChange('toCurrency', e.target.value)}
                  className="px-3 py-2 border-l-0 border border-gray-300 rounded-r-lg bg-gray-50"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Slippage (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.maxSlippage}
            onChange={(e) => handleInputChange('maxSlippage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Transaction Details */}
        {formData.amount && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Exchange Rate:</span>
              <span>1 {formData.fromCurrency} = 0.92 {formData.toCurrency}</span>
            </div>
            <div className="flex justify-between">
              <span>Fee:</span>
              <span>$0.01</span>
            </div>
            <div className="flex justify-between">
              <span>Settlement Time:</span>
              <span className="text-green-600">~2 seconds</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmitPayment}
          disabled={!account || !formData.recipient || !formData.amount || isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : txStatus === 'success' ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Payment Sent!
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Payment
            </>
          )}
        </button>

        {/* Status Messages */}
        {txStatus === 'error' && (
          <div className="text-red-600 text-sm text-center">
            Payment failed. Please try again.
          </div>
        )}
        
        {txStatus === 'success' && (
          <div className="text-green-600 text-sm text-center">
            Payment sent successfully! Funds will arrive in ~2 seconds.
          </div>
        )}
      </div>
    </div>
  );
};