export const APTOS_CONFIG = {
  network: process.env.NEXT_PUBLIC_APTOS_NETWORK || 'testnet',
  nodeUrl: process.env.NEXT_PUBLIC_APTOS_NODE_URL || 'https://fullnode.testnet.aptoslabs.com/v1',
  faucetUrl: process.env.NEXT_PUBLIC_APTOS_FAUCET_URL || 'https://faucet.testnet.aptoslabs.com',
};

export const CONTRACT_ADDRESSES = {
  PAYMENT_ROUTER: process.env.NEXT_PUBLIC_FLOWPAY_PAYMENT_ROUTER || '0x1',
  FOREX_ENGINE: process.env.NEXT_PUBLIC_FLOWPAY_FOREX_ENGINE || '0x2',
  TREASURY_VAULT: process.env.NEXT_PUBLIC_FLOWPAY_TREASURY_VAULT || '0x3',
  COMPLIANCE_ORACLE: process.env.NEXT_PUBLIC_FLOWPAY_COMPLIANCE_ORACLE || '0x4',
  SETTLEMENT_BRIDGE: process.env.NEXT_PUBLIC_FLOWPAY_SETTLEMENT_BRIDGE || '0x5',
};

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', decimals: 8 },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', decimals: 8 },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', decimals: 8 },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', decimals: 8 },
  { code: 'USDC', name: 'USD Coin', flag: '💰', decimals: 6 },
  { code: 'APT', name: 'Aptos', flag: '⚡', decimals: 8 },
];

export const TRANSACTION_STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  COMPLETED: 2,
  FAILED: 3,
} as const;

export const KYC_LEVELS = {
  NONE: 0,
  BASIC: 1,
  ENHANCED: 2,
} as const;

export const TRANSACTION_LIMITS = {
  [KYC_LEVELS.NONE]: {
    daily: 1000, // $1,000
    monthly: 10000, // $10,000
    single: 500, // $500
  },
  [KYC_LEVELS.BASIC]: {
    daily: 10000, // $10,000
    monthly: 100000, // $100,000
    single: 5000, // $5,000
  },
  [KYC_LEVELS.ENHANCED]: {
    daily: 100000, // $100,000
    monthly: 1000000, // $1,000,000
    single: 50000, // $50,000
  },
};

export const FEES = {
  TRANSACTION_FEE_RATE: 0.001, // 0.1%
  MIN_TRANSACTION_FEE: 0.01, // $0.01
  FOREX_SPREAD_RATE: 0.0005, // 0.05%
  SETTLEMENT_FEE_RATE: 0.002, // 0.2%
};

export const API_ENDPOINTS = {
  FOREX_RATES: '/api/forex/rates',
  PAYMENT_HISTORY: '/api/payments/history',
  TREASURY_BALANCE: '/api/treasury/balance',
  COMPLIANCE_CHECK: '/api/compliance/check',
  SETTLEMENT_STATUS: '/api/settlement/status',
};

export const WEBSOCKET_EVENTS = {
  PAYMENT_UPDATE: 'payment_update',
  FOREX_RATE_UPDATE: 'forex_rate_update',
  COMPLIANCE_ALERT: 'compliance_alert',
  SETTLEMENT_UPDATE: 'settlement_update',
};

export const ERROR_CODES = {
  INSUFFICIENT_BALANCE: 1,
  INVALID_ROUTE: 2,
  SLIPPAGE_EXCEEDED: 3,
  PAYMENT_NOT_FOUND: 4,
  UNAUTHORIZED: 5,
  USER_NOT_VERIFIED: 6,
  VERIFICATION_EXPIRED: 7,
  COMPLIANCE_CHECK_FAILED: 8,
  BRIDGE_NOT_FOUND: 9,
  SETTLEMENT_FAILED: 10,
};

export const DEMO_DATA = {
  MOCK_TRANSACTIONS: [
    {
      id: '1',
      type: 'sent' as const,
      amount: '1,000.00',
      currency: 'USD',
      recipient: '0x1234567890abcdef1234567890abcdef12345678',
      status: 'completed' as const,
      timestamp: '2024-01-15 14:30:25',
      txHash: '0xabc123def456',
      fee: '0.01',
    },
    // Add more mock data as needed
  ],
  MOCK_CONTACTS: [
    {
      id: '1',
      name: 'John Doe',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      isFavorite: true,
    },
    // Add more mock contacts
  ],
};

export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/FlowPayFinance',
  DISCORD: 'https://discord.gg/flowpay',
  GITHUB: 'https://github.com/flowpay/flowpay-app',
  DOCS: 'https://docs.flowpay.finance',
  BLOG: 'https://blog.flowpay.finance',
};

export const LEGAL_LINKS = {
  TERMS: '/legal/terms',
  PRIVACY: '/legal/privacy',
  COOKIES: '/legal/cookies',
  COMPLIANCE: '/legal/compliance',
};