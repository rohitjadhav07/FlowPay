'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Book, 
  Zap, 
  Shield, 
  Globe, 
  Copy,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Book },
    { id: 'authentication', label: 'Authentication', icon: Shield },
    { id: 'payments', label: 'Payments API', icon: Zap },
    { id: 'webhooks', label: 'Webhooks', icon: Globe },
    { id: 'examples', label: 'Examples', icon: Code },
  ];

  const CodeBlock = ({ code, language = 'javascript', id }: { code: string; language?: string; id: string }) => (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 rounded-t-lg">
        <span className="text-sm font-medium">{language}</span>
        <button
          onClick={() => copyCode(code, id)}
          className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
        >
          {copiedCode === id ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span className="text-xs">{copiedCode === id ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );

  const InfoBox = ({ type, title, children }: { type: 'info' | 'warning' | 'success'; title: string; children: React.ReactNode }) => {
    const styles = {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      success: 'bg-green-50 border-green-200 text-green-800',
    };

    const icons = {
      info: Info,
      warning: AlertTriangle,
      success: CheckCircle,
    };

    const Icon = icons[type];

    return (
      <div className={`border rounded-lg p-4 ${styles[type]}`}>
        <div className="flex items-start space-x-2">
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-1">{title}</h4>
            <div className="text-sm">{children}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">FlowPay API Documentation</h1>
        <p className="text-gray-600 mt-2">
          Build powerful payment applications with FlowPay's blockchain-powered API
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What is FlowPay API?</h2>
              <p className="text-gray-600 mb-6">
                FlowPay API is a comprehensive blockchain-powered payment infrastructure that enables developers 
                to integrate fast, secure, and cost-effective payment processing into their applications.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                  <p className="text-sm text-gray-600">
                    Settlements in ~2 seconds using Aptos blockchain technology
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Ultra Secure</h3>
                  <p className="text-sm text-gray-600">
                    Military-grade encryption and blockchain immutability
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Global Reach</h3>
                  <p className="text-sm text-gray-600">
                    Cross-border payments without traditional banking delays
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Payment Processing</h4>
                    <p className="text-sm text-gray-600">Send and receive payments with 0.1% fees</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Multi-Currency Support</h4>
                    <p className="text-sm text-gray-600">APT, USDC, USDT, and traditional currencies</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Real-time FOREX</h4>
                    <p className="text-sm text-gray-600">Live exchange rates and currency conversion</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Batch Payments</h4>
                    <p className="text-sm text-gray-600">Process payroll and bulk payments efficiently</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Compliance & KYC</h4>
                    <p className="text-sm text-gray-600">Built-in compliance and risk management</p>
                  </div>
                </div>
              </div>
            </div>

            <InfoBox type="info" title="Getting Started">
              <p>
                To start using FlowPay API, you'll need an API key. Generate one in your{' '}
                <a href="/app/settings" className="text-blue-600 hover:underline">Settings</a> page.
                All API requests must include your API key in the Authorization header.
              </p>
            </InfoBox>
          </motion.div>
        )}

        {activeTab === 'authentication' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
              <p className="text-gray-600 mb-6">
                FlowPay API uses API keys for authentication. Include your API key in the Authorization header 
                of all requests.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">API Key Format</h3>
              <CodeBlock
                id="api-key-format"
                code={`Authorization: Bearer fp_your_api_key_here`}
                language="http"
              />

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Example Request</h3>
              <CodeBlock
                id="auth-example"
                code={`curl -X GET "https://api.flowpay.com/v1/account/balance" \\
  -H "Authorization: Bearer fp_your_api_key_here" \\
  -H "Content-Type: application/json"`}
                language="bash"
              />
            </div>

            <InfoBox type="warning" title="Security Best Practices">
              <ul className="space-y-1">
                <li>• Never expose your API key in client-side code</li>
                <li>• Store API keys securely using environment variables</li>
                <li>• Rotate your API keys regularly</li>
                <li>• Use different API keys for different environments</li>
              </ul>
            </InfoBox>
          </motion.div>
        )}

        {activeTab === 'payments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payments API</h2>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Send Payment</h3>
              <p className="text-gray-600 mb-4">
                Send a payment to another wallet address with optional currency conversion.
              </p>
              
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <code className="text-sm">POST /v1/payments/send</code>
              </div>

              <CodeBlock
                id="send-payment"
                code={`{
  "recipient": "0x1234567890abcdef...",
  "amount": "100.50",
  "currency": "APT",
  "convert_to": "USDC",
  "message": "Payment for services",
  "webhook_url": "https://your-app.com/webhook"
}`}
                language="json"
              />

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">Response</h4>
              <CodeBlock
                id="send-payment-response"
                code={`{
  "success": true,
  "transaction_id": "0xabcdef1234567890...",
  "status": "pending",
  "amount_sent": "100.50",
  "amount_received": "95.25",
  "exchange_rate": 0.9525,
  "fee": "0.10",
  "estimated_confirmation": "2023-12-01T10:30:02Z"
}`}
                language="json"
              />

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">Get Payment Status</h3>
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <code className="text-sm">GET /v1/payments/&#123;transaction_id&#125;</code>
              </div>

              <CodeBlock
                id="payment-status"
                code={`{
  "transaction_id": "0xabcdef1234567890...",
  "status": "completed",
  "sender": "0x9876543210fedcba...",
  "recipient": "0x1234567890abcdef...",
  "amount": "100.50",
  "currency": "APT",
  "fee": "0.10",
  "created_at": "2023-12-01T10:30:00Z",
  "confirmed_at": "2023-12-01T10:30:02Z",
  "block_height": 12345678
}`}
                language="json"
              />

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">Batch Payments</h3>
              <p className="text-gray-600 mb-4">
                Send multiple payments in a single transaction (perfect for payroll).
              </p>

              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <code className="text-sm">POST /v1/payments/batch</code>
              </div>

              <CodeBlock
                id="batch-payments"
                code={`{
  "payments": [
    {
      "recipient": "0x1111111111111111...",
      "amount": "1000.00",
      "currency": "APT",
      "reference": "salary_john_doe"
    },
    {
      "recipient": "0x2222222222222222...",
      "amount": "1200.00",
      "currency": "APT",
      "reference": "salary_jane_smith"
    }
  ],
  "webhook_url": "https://your-app.com/webhook"
}`}
                language="json"
              />
            </div>

            <InfoBox type="success" title="Payment Fees">
              <p>
                FlowPay charges only 0.1% per transaction, significantly lower than traditional 
                payment processors (2-8%). Batch payments have the same fee structure per individual payment.
              </p>
            </InfoBox>
          </motion.div>
        )}

        {activeTab === 'webhooks' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Webhooks</h2>
              <p className="text-gray-600 mb-6">
                Webhooks allow you to receive real-time notifications about payment events. 
                Configure your webhook URL in the Settings page.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">Webhook Events</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">payment.created</code>
                  <span className="text-gray-600">Payment initiated</span>
                </div>
                <div className="flex items-center space-x-3">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">payment.confirmed</code>
                  <span className="text-gray-600">Payment confirmed on blockchain</span>
                </div>
                <div className="flex items-center space-x-3">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">payment.failed</code>
                  <span className="text-gray-600">Payment failed or rejected</span>
                </div>
                <div className="flex items-center space-x-3">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">payment.received</code>
                  <span className="text-gray-600">Payment received in your account</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">Webhook Payload</h3>
              <CodeBlock
                id="webhook-payload"
                code={`{
  "event": "payment.confirmed",
  "timestamp": "2023-12-01T10:30:02Z",
  "data": {
    "transaction_id": "0xabcdef1234567890...",
    "sender": "0x9876543210fedcba...",
    "recipient": "0x1234567890abcdef...",
    "amount": "100.50",
    "currency": "APT",
    "fee": "0.10",
    "status": "completed",
    "block_height": 12345678,
    "reference": "invoice_12345"
  }
}`}
                language="json"
              />

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Webhook Security</h3>
              <p className="text-gray-600 mb-4">
                All webhooks are signed with HMAC-SHA256. Verify the signature to ensure authenticity.
              </p>

              <CodeBlock
                id="webhook-verification"
                code={`const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Usage
const isValid = verifyWebhook(
  req.body, 
  req.headers['x-flowpay-signature'], 
  process.env.FLOWPAY_WEBHOOK_SECRET
);`}
                language="javascript"
              />
            </div>

            <InfoBox type="info" title="Webhook Reliability">
              <p>
                FlowPay will retry failed webhook deliveries up to 5 times with exponential backoff. 
                Ensure your webhook endpoint responds with a 2xx status code within 10 seconds.
              </p>
            </InfoBox>
          </motion.div>
        )}

        {activeTab === 'examples' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">Node.js / Express</h3>
              <CodeBlock
                id="nodejs-example"
                code={`const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const FLOWPAY_API_KEY = process.env.FLOWPAY_API_KEY;
const FLOWPAY_BASE_URL = 'https://api.flowpay.com/v1';

// Send a payment
app.post('/send-payment', async (req, res) => {
  try {
    const { recipient, amount, currency } = req.body;
    
    const response = await axios.post(
      \`\${FLOWPAY_BASE_URL}/payments/send\`,
      {
        recipient,
        amount,
        currency,
        webhook_url: 'https://your-app.com/webhook'
      },
      {
        headers: {
          'Authorization': \`Bearer \${FLOWPAY_API_KEY}\`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle webhook
app.post('/webhook', (req, res) => {
  const { event, data } = req.body;
  
  switch (event) {
    case 'payment.confirmed':
      console.log('Payment confirmed:', data.transaction_id);
      // Update your database, send notifications, etc.
      break;
    case 'payment.failed':
      console.log('Payment failed:', data.transaction_id);
      // Handle failed payment
      break;
  }
  
  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`}
                language="javascript"
              />

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">Python / Flask</h3>
              <CodeBlock
                id="python-example"
                code={`import os
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

FLOWPAY_API_KEY = os.getenv('FLOWPAY_API_KEY')
FLOWPAY_BASE_URL = 'https://api.flowpay.com/v1'

@app.route('/send-payment', methods=['POST'])
def send_payment():
    try:
        data = request.json
        
        response = requests.post(
            f'{FLOWPAY_BASE_URL}/payments/send',
            json={
                'recipient': data['recipient'],
                'amount': data['amount'],
                'currency': data['currency'],
                'webhook_url': 'https://your-app.com/webhook'
            },
            headers={
                'Authorization': f'Bearer {FLOWPAY_API_KEY}',
                'Content-Type': 'application/json'
            }
        )
        
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    event = data.get('event')
    payment_data = data.get('data')
    
    if event == 'payment.confirmed':
        print(f"Payment confirmed: {payment_data['transaction_id']}")
        # Update database, send notifications, etc.
    elif event == 'payment.failed':
        print(f"Payment failed: {payment_data['transaction_id']}")
        # Handle failed payment
    
    return 'OK', 200

if __name__ == '__main__':
    app.run(debug=True)`}
                language="python"
              />

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">React / Next.js Frontend</h3>
              <CodeBlock
                id="react-example"
                code={`import { useState } from 'react';

export default function PaymentForm() {
  const [payment, setPayment] = useState({
    recipient: '',
    amount: '',
    currency: 'APT'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/send-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payment),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(\`Payment sent! Transaction ID: \${result.transaction_id}\`);
        setPayment({ recipient: '', amount: '', currency: 'APT' });
      } else {
        alert('Payment failed: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Recipient Address
        </label>
        <input
          type="text"
          value={payment.recipient}
          onChange={(e) => setPayment({...payment, recipient: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          step="0.00000001"
          value={payment.amount}
          onChange={(e) => setPayment({...payment, amount: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Payment'}
      </button>
    </form>
  );
}`}
                language="javascript"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoBox type="info" title="SDKs Available">
                <ul className="space-y-1">
                  <li>• Node.js SDK</li>
                  <li>• Python SDK</li>
                  <li>• PHP SDK</li>
                  <li>• Go SDK</li>
                  <li>• Ruby SDK</li>
                </ul>
              </InfoBox>

              <InfoBox type="success" title="Postman Collection">
                <p>
                  Download our Postman collection to test all API endpoints quickly.{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Get Collection
                  </a>
                </p>
              </InfoBox>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
            <p className="text-gray-600">
              Check out our comprehensive documentation or contact our developer support team.
            </p>
          </div>
          <div className="flex space-x-4">
            <a
              href="/app/help"
              className="btn-secondary flex items-center space-x-2"
            >
              <Book className="w-4 h-4" />
              <span>Help Center</span>
            </a>
            <a
              href="https://github.com/flowpay/examples"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>GitHub Examples</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}