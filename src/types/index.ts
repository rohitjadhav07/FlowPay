export interface User {
  address: string;
  publicKey?: string;
  kycLevel: number;
  riskScore: number;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: string;
  currency: string;
  fromAddress: string;
  toAddress: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: string;
  txHash: string;
  fee: string;
  exchangeRate?: number;
  settlementTime?: number;
  metadata?: Record<string, any>;
}

export interface PaymentRoute {
  routeId: string;
  sender: string;
  recipient: string;
  amount: string;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  status: number;
  createdAt: string;
  completedAt?: string;
  feesPaid: string;
}

export interface CurrencyPair {
  base: string;
  quote: string;
  currentRate: number;
  bidPrice: number;
  askPrice: number;
  spread: number;
  dailyVolume: string;
  change24h: number;
  changePercent24h: number;
  lastUpdated: string;
}

export interface ForexOrder {
  id: string;
  pair: string;
  type: 'buy' | 'sell';
  amount: string;
  price: number;
  status: 'pending' | 'filled' | 'cancelled';
  createdAt: string;
  filledAt?: string;
  filledAmount?: string;
}

export interface TreasuryVault {
  owner: string;
  balances: Record<string, string>;
  autoHedgeEnabled: boolean;
  riskParameters: RiskConfig;
  dailyOutflow: string;
  totalAssets: string;
  performanceMetrics: PerformanceMetrics;
}

export interface RiskConfig {
  maxDailyOutflow: string;
  maxSinglePayment: string;
  autoHedgeThreshold: number;
  allowedCurrencies: string[];
  requireMultiSig: boolean;
}

export interface PerformanceMetrics {
  totalReturn: number;
  monthlyReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export interface ScheduledPayment {
  id: string;
  recipient: string;
  amount: string;
  currency: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  nextExecution: string;
  totalPayments: number;
  remainingPayments: number;
  isActive: boolean;
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  salary: string;
  currency: string;
  department: string;
  startDate: string;
  isActive: boolean;
}

export interface Contact {
  id: string;
  name: string;
  address: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isFavorite: boolean;
  tags: string[];
  lastTransactionAmount?: string;
  lastTransactionCurrency?: string;
  lastTransactionDate?: string;
  totalTransactions: number;
  totalVolume: string;
}

export interface BankDetails {
  id: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
  accountHolderName: string;
  countryCode: string;
  currency: string;
  isDefault: boolean;
  isVerified: boolean;
}

export interface SettlementRequest {
  id: string;
  userAddress: string;
  amount: string;
  currency: string;
  bankDetails: BankDetails;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  processedAt?: string;
  settlementReference?: string;
  feesCharged: string;
  estimatedArrival?: string;
}

export interface ComplianceStatus {
  userAddress: string;
  kycLevel: number;
  riskScore: number;
  isVerified: boolean;
  isSanctioned: boolean;
  documents: KYCDocument[];
  transactionLimits: TransactionLimits;
  lastUpdated: string;
}

export interface KYCDocument {
  id: string;
  type: 'id' | 'passport' | 'utility_bill' | 'bank_statement';
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  verifiedAt?: string;
  expiresAt?: string;
  rejectionReason?: string;
}

export interface TransactionLimits {
  dailyLimit: string;
  monthlyLimit: string;
  singleTransactionLimit: string;
  dailySpent: string;
  monthlySpent: string;
  remainingDaily: string;
  remainingMonthly: string;
}

export interface MarketData {
  pair: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: string;
  high24h: number;
  low24h: number;
  timestamp: string;
}

export interface OrderBookEntry {
  price: number;
  amount: string;
  total: string;
}

export interface OrderBook {
  pair: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastUpdated: string;
}

export interface TradingStats {
  totalTrades: number;
  winRate: number;
  totalPnL: string;
  todayPnL: string;
  totalVolume: string;
  averageTradeSize: string;
  bestTrade: string;
  worstTrade: string;
}

export interface Notification {
  id: string;
  type: 'payment' | 'forex' | 'compliance' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  volume?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}

export interface WalletBalance {
  currency: string;
  balance: string;
  usdValue: string;
  change24h: number;
  changePercent24h: number;
}

export interface PaymentForm {
  recipient: string;
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  maxSlippage: string;
  priority: 'standard' | 'fast';
  memo?: string;
}

export interface ForexTradeForm {
  pair: string;
  type: 'buy' | 'sell';
  amount: string;
  orderType: 'market' | 'limit';
  limitPrice?: string;
  stopLoss?: string;
  takeProfit?: string;
}

export interface TreasurySettings {
  autoHedgeEnabled: boolean;
  hedgeThreshold: number;
  maxDailyOutflow: string;
  maxSinglePayment: string;
  allowedCurrencies: string[];
  requireMultiSig: boolean;
  authorizedSigners: string[];
  notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  paymentAlerts: boolean;
  forexAlerts: boolean;
  complianceAlerts: boolean;
  systemAlerts: boolean;
}

export interface DashboardStats {
  totalBalance: string;
  monthlyVolume: string;
  totalTransactions: number;
  feesSaved: string;
  portfolioChange: number;
  activePayrolls: number;
  pendingTransactions: number;
  complianceScore: number;
}

export interface SystemStatus {
  status: 'operational' | 'degraded' | 'maintenance' | 'outage';
  uptime: number;
  lastIncident?: string;
  services: ServiceStatus[];
}

export interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  responseTime: number;
  uptime: number;
}

// Utility types
export type TransactionType = Transaction['type'];
export type TransactionStatus = Transaction['status'];
export type CurrencyCode = string;
export type WalletAddress = string;
export type TransactionHash = string;

// Form validation types
export interface FormError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormError[];
}

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

export interface PaymentUpdateMessage extends WebSocketMessage {
  type: 'payment_update';
  payload: {
    transactionId: string;
    status: TransactionStatus;
    timestamp: string;
  };
}

export interface ForexRateUpdateMessage extends WebSocketMessage {
  type: 'forex_rate_update';
  payload: {
    pair: string;
    rate: number;
    change: number;
    timestamp: string;
  };
}