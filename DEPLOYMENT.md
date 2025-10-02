# 🚀 FlowPay Deployment Guide

This guide covers deploying FlowPay to various production environments.

## 📋 **Pre-deployment Checklist**

- [ ] All tests passing (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] Environment variables configured
- [ ] Smart contracts deployed to testnet/mainnet
- [ ] Security headers configured
- [ ] Performance optimized

## 🌐 **Deployment Options**

### **Option 1: Vercel (Recommended)**

#### **Quick Deploy**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/flowpay)

#### **Manual Deployment**
1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel --prod
```

4. **Set Environment Variables:**
```bash
vercel env add NEXT_PUBLIC_APTOS_NETWORK
vercel env add NEXT_PUBLIC_FLOWPAY_PAYMENT_ROUTER
# Add all required environment variables
```

### **Option 2: Netlify**

1. **Install Netlify CLI:**
```bash
npm i -g netlify-cli
```

2. **Build and Deploy:**
```bash
npm run build
netlify deploy --prod --dir=.next
```

3. **Environment Variables:**
Set in Netlify dashboard under Site Settings > Environment Variables

### **Option 3: AWS Amplify**

1. **Connect GitHub Repository:**
- Go to AWS Amplify Console
- Connect your GitHub repository
- Configure build settings

2. **Build Configuration:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### **Option 4: Docker Deployment**

1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
USER nextjs
EXPOSE 3000
CMD ["npm", "start"]
```

2. **Build and Run:**
```bash
docker build -t flowpay .
docker run -p 3000:3000 flowpay
```

## 🔧 **Environment Configuration**

### **Required Environment Variables**
```env
# Aptos Configuration
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
NEXT_PUBLIC_APTOS_FAUCET_URL=https://faucet.testnet.aptoslabs.com

# FlowPay Contracts
NEXT_PUBLIC_FLOWPAY_PAYMENT_ROUTER=0x06ed61974ad9b10aa57c7ed03c7f6936797caf4b62fd5cc61985b4f592f80693
NEXT_PUBLIC_FLOWPAY_FOREX_ENGINE=0x06ed61974ad9b10aa57c7ed03c7f6936797caf4b62fd5cc61985b4f592f80693
NEXT_PUBLIC_FLOWPAY_TREASURY_VAULT=0x06ed61974ad9b10aa57c7ed03c7f6936797caf4b62fd5cc61985b4f592f80693
NEXT_PUBLIC_FLOWPAY_COMPLIANCE_ORACLE=0x06ed61974ad9b10aa57c7ed03c7f6936797caf4b62fd5cc61985b4f592f80693
NEXT_PUBLIC_FLOWPAY_SETTLEMENT_BRIDGE=0x06ed61974ad9b10aa57c7ed03c7f6936797caf4b62fd5cc61985b4f592f80693

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### **Optional Production Variables**
```env
# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Monitoring
SENTRY_DSN=your_sentry_dsn

# External APIs
FOREX_API_KEY=your_forex_api_key
COMPLIANCE_API_KEY=your_compliance_api_key
```

## 🔒 **Security Configuration**

### **Security Headers**
Already configured in `next.config.js`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- X-XSS-Protection: 1; mode=block

### **HTTPS Configuration**
- Ensure SSL/TLS certificates are properly configured
- Use HTTPS redirects
- Configure HSTS headers for production

### **API Security**
- Rate limiting for API endpoints
- Input validation and sanitization
- Proper error handling without information leakage

## 📊 **Performance Optimization**

### **Build Optimization**
```bash
# Analyze bundle size
npm run analyze

# Check build performance
npm run build -- --profile
```

### **Caching Strategy**
- Static assets: 1 year cache
- API responses: Appropriate cache headers
- CDN configuration for global distribution

### **Monitoring**
- Set up application monitoring (Sentry, DataDog, etc.)
- Configure performance monitoring
- Set up uptime monitoring

## 🧪 **Testing in Production**

### **Smoke Tests**
```bash
# Test critical user flows
curl https://your-domain.com/api/health
curl https://your-domain.com/api/status
```

### **Load Testing**
```bash
# Use tools like Artillery or k6
artillery quick --count 10 --num 100 https://your-domain.com
```

## 🔄 **CI/CD Pipeline**

### **GitHub Actions** (Already configured)
- Automatic testing on PR
- Deployment on merge to main
- Environment-specific deployments

### **Deployment Workflow**
1. **Development** → Push to `develop` branch
2. **Staging** → Create PR to `main`
3. **Production** → Merge to `main` (auto-deploy)

## 📈 **Scaling Considerations**

### **Horizontal Scaling**
- Load balancer configuration
- Multiple instance deployment
- Database scaling (if applicable)

### **CDN Configuration**
- Static asset distribution
- API response caching
- Geographic distribution

## 🚨 **Troubleshooting**

### **Common Issues**

**Build Failures:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Environment Variable Issues:**
```bash
# Verify environment variables
vercel env ls
# or check your deployment platform
```

**Performance Issues:**
```bash
# Analyze bundle
npm run analyze
# Check for large dependencies
npx bundlephobia
```

## 📞 **Support**

- **Documentation**: [docs.flowpay.finance](https://docs.flowpay.finance)
- **Issues**: [GitHub Issues](https://github.com/yourusername/flowpay/issues)
- **Discord**: [FlowPay Community](https://discord.gg/flowpay)
- **Email**: support@flowpay.finance

---

**🎉 Congratulations! Your FlowPay deployment is now live and ready for users!**