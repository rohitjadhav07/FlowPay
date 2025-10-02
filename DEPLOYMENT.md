# FlowPay Deployment Guide

This guide covers deploying FlowPay to production environments for the CTRL+MOVE Hackathon.

## Prerequisites

- Node.js 18+ and npm/yarn
- Aptos CLI installed and configured
- Access to Aptos testnet/mainnet
- Circle Wallet SDK credentials
- Domain name and SSL certificate (for production)

## Smart Contract Deployment

### 1. Compile Contracts

```bash
# Compile all Move contracts
aptos move compile

# Run tests
aptos move test
```

### 2. Deploy to Aptos Network

```bash
# Initialize Aptos account (if not done)
aptos init

# Fund account from faucet (testnet only)
aptos account fund-with-faucet --account default

# Deploy contracts
aptos move publish --named-addresses flowpay=default

# Verify deployment
aptos account list --query modules --account default
```

### 3. Initialize Contracts

```bash
# Initialize payment router
aptos move run --function-id default::payment_router::initialize

# Initialize FOREX engine
aptos move run --function-id default::forex_engine::initialize

# Initialize treasury vault system
aptos move run --function-id default::treasury_vault::initialize

# Initialize compliance oracle
aptos move run --function-id default::compliance_oracle::initialize

# Initialize settlement bridge
aptos move run --function-id default::settlement_bridge::initialize
```

## Frontend Deployment

### 1. Environment Configuration

Create `.env.production`:

```bash
# Aptos Configuration
NEXT_PUBLIC_APTOS_NETWORK=mainnet
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.mainnet.aptoslabs.com/v1
NEXT_PUBLIC_APTOS_FAUCET_URL=https://faucet.mainnet.aptoslabs.com

# Contract Addresses (update with deployed addresses)
NEXT_PUBLIC_FLOWPAY_PAYMENT_ROUTER=0x[deployed_address]
NEXT_PUBLIC_FLOWPAY_FOREX_ENGINE=0x[deployed_address]
NEXT_PUBLIC_FLOWPAY_TREASURY_VAULT=0x[deployed_address]
NEXT_PUBLIC_FLOWPAY_COMPLIANCE_ORACLE=0x[deployed_address]
NEXT_PUBLIC_FLOWPAY_SETTLEMENT_BRIDGE=0x[deployed_address]

# Circle Wallet SDK
NEXT_PUBLIC_CIRCLE_APP_ID=your_production_app_id
CIRCLE_API_KEY=your_production_api_key

# Production URLs
NEXT_PUBLIC_APP_URL=https://app.flowpay.finance
```

### 2. Build and Deploy

#### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_APTOS_NETWORK production
vercel env add NEXT_PUBLIC_FLOWPAY_PAYMENT_ROUTER production
# ... add all environment variables
```

#### Option B: Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

```bash
# Build and deploy
docker build -t flowpay-app .
docker run -p 3000:3000 --env-file .env.production flowpay-app
```

#### Option C: AWS/GCP/Azure

```bash
# Build for production
npm run build

# Deploy to your preferred cloud provider
# Follow their specific deployment guides
```

## Database Setup (Optional)

If using a database for additional features:

```sql
-- PostgreSQL schema
CREATE DATABASE flowpay;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(66) UNIQUE NOT NULL,
  kyc_level INTEGER DEFAULT 0,
  risk_score INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  tx_hash VARCHAR(66) UNIQUE NOT NULL,
  from_address VARCHAR(66) NOT NULL,
  to_address VARCHAR(66) NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  user_address VARCHAR(66) NOT NULL,
  contact_address VARCHAR(66) NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_transactions_from_address ON transactions(from_address);
CREATE INDEX idx_transactions_to_address ON transactions(to_address);
CREATE INDEX idx_contacts_user_address ON contacts(user_address);
```

## Monitoring and Analytics

### 1. Error Tracking (Sentry)

```bash
# Install Sentry
npm install @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig({
  // Your Next.js config
}, {
  silent: true,
  org: "flowpay",
  project: "flowpay-app",
});
```

### 2. Analytics (Google Analytics)

```typescript
// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
```

### 3. Performance Monitoring

```typescript
// lib/performance.ts
export const trackPerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      // Track key metrics
      const metrics = {
        ttfb: navigation.responseStart - navigation.requestStart,
        fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        lcp: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime,
      };
      
      // Send to analytics
      console.log('Performance metrics:', metrics);
    });
  }
};
```

## Security Considerations

### 1. Environment Variables

- Never commit sensitive keys to version control
- Use different keys for development/staging/production
- Rotate API keys regularly
- Use secrets management services in production

### 2. Content Security Policy

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-analytics.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' *.aptoslabs.com *.circle.com;
    `.replace(/\s{2,}/g, ' ').trim()
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### 3. Rate Limiting

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const limit = 100; // requests per hour
  const windowMs = 60 * 60 * 1000; // 1 hour

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      count: 0,
      lastReset: Date.now(),
    });
  }

  const ipData = rateLimitMap.get(ip);

  if (Date.now() - ipData.lastReset > windowMs) {
    ipData.count = 0;
    ipData.lastReset = Date.now();
  }

  if (ipData.count >= limit) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  ipData.count += 1;

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

## Testing in Production

### 1. Health Checks

```typescript
// pages/api/health.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check database connection
    // Check external API availability
    // Check contract deployment
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
}
```

### 2. Integration Tests

```bash
# Run integration tests against deployed contracts
npm run test:integration

# Test wallet connections
npm run test:wallet

# Test payment flows
npm run test:payments
```

## Backup and Recovery

### 1. Smart Contract Upgrades

```bash
# Create upgrade proposal (if using upgradeable contracts)
aptos move create-upgrade-proposal --package-dir . --metadata-url https://flowpay.finance/upgrade-metadata.json

# Vote on upgrade (multi-sig)
aptos governance vote --proposal-id 1 --should-pass

# Execute upgrade
aptos governance execute-proposal --proposal-id 1
```

### 2. Data Backup

```bash
# Backup user data
pg_dump flowpay > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup to cloud storage
aws s3 cp backup_*.sql s3://flowpay-backups/
```

## Monitoring Checklist

- [ ] Smart contracts deployed and initialized
- [ ] Frontend deployed and accessible
- [ ] SSL certificate configured
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Error tracking configured
- [ ] Analytics tracking working
- [ ] Performance monitoring active
- [ ] Health checks passing
- [ ] Backup procedures tested
- [ ] Security headers configured
- [ ] Rate limiting enabled

## Post-Deployment

1. **Test all critical flows**:
   - Wallet connection
   - Payment sending
   - FOREX trading
   - Treasury management

2. **Monitor key metrics**:
   - Transaction success rate
   - Average settlement time
   - Error rates
   - User engagement

3. **Set up alerts**:
   - High error rates
   - Slow response times
   - Failed transactions
   - Security incidents

4. **Documentation**:
   - Update API documentation
   - Create user guides
   - Document troubleshooting procedures

## Support and Maintenance

- Monitor Aptos network status
- Keep dependencies updated
- Regular security audits
- Performance optimization
- User feedback integration

For hackathon demo purposes, focus on testnet deployment with mock data to showcase all features effectively.