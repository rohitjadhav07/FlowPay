'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

export function QRCodeModal({ isOpen, onClose, address }: QRCodeModalProps) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  // Generate QR code data URL using a simple QR code generator
  const generateQRCode = () => {
    const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/';
    let qrData = address;
    
    // Add amount and message if provided
    const params = new URLSearchParams();
    if (amount) params.append('amount', amount);
    if (message) params.append('message', message);
    
    if (params.toString()) {
      qrData = `aptos:${address}?${params.toString()}`;
    }
    
    const qrParams = new URLSearchParams({
      size: '300x300',
      data: qrData,
      format: 'png',
      margin: '10',
      color: '000000',
      bgcolor: 'ffffff'
    });
    
    return `${baseUrl}?${qrParams.toString()}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard!');
  };

  const copyPaymentLink = () => {
    let link = `aptos:${address}`;
    const params = new URLSearchParams();
    if (amount) params.append('amount', amount);
    if (message) params.append('message', message);
    
    if (params.toString()) {
      link += `?${params.toString()}`;
    }
    
    navigator.clipboard.writeText(link);
    toast.success('Payment link copied!');
  };

  const downloadQR = () => {
    const qrUrl = generateQRCode();
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `wallet-qr-${address.slice(0, 8)}.png`;
    link.click();
    toast.success('QR code downloaded!');
  };

  const sharePayment = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Send APT Payment',
          text: `Send APT to my wallet${amount ? ` (${amount} APT)` : ''}${message ? `: ${message}` : ''}`,
          url: `aptos:${address}${amount || message ? `?${new URLSearchParams({ ...(amount && { amount }), ...(message && { message }) }).toString()}` : ''}`
        });
      } catch (error) {
        copyPaymentLink();
      }
    } else {
      copyPaymentLink();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black bg-opacity-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Receive Payment</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <img
                    src={generateQRCode()}
                    alt="Payment QR Code"
                    className="w-64 h-64"
                  />
                </div>
              </div>
              
              {/* Payment Details Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.00000001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Specify amount in APT</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Payment for services"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Add a note for the sender</p>
                </div>
              </div>
              
              {/* Address Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Address
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-sm break-all">
                    {address}
                  </div>
                  <button
                    onClick={copyAddress}
                    className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy address"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={copyPaymentLink}
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </button>
                
                <button
                  onClick={downloadQR}
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                
                <button
                  onClick={sharePayment}
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
              
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Share the QR code or payment link with the sender</li>
                  <li>• They can scan the QR code with their Aptos wallet</li>
                  <li>• The amount and message will be pre-filled if specified</li>
                  <li>• Payments arrive in ~2 seconds on Aptos network</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}