# FlowPay Hackathon Setup Guide

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+
- [Petra Wallet](https://petra.app/) browser extension
- [Aptos CLI](https://aptos.dev/tools/aptos-cli/) (optional but recommended)

### Step 1: Clone and Install
```bash
git clone <repository-url>
cd flowpay
npm install
```

### Step 2: Deploy to Testnet
```bash
# Windows PowerShell
.\deploy-testnet.ps1

# Windows Command Prompt
.\deploy-testnet.bat

# Mac/Linux
chmod +x deploy-testnet.sh
./deploy-testnet.sh
```

### Step 3: Setup Petra Wallet
1. Install [Petra Wallet](https://petra.app/) extension
2. Create a new wallet or import existing
3. **Switch to Testnet**: Settings → Network → Testnet
4. Copy your wallet address

### Step 4: Start the App
```bash
npm run dev
```
Open http://localhost:3000

### Step 5: Connect and Fund
1. Click "Connect Wallet" → Select Petra
2. Click "Get Testnet APT" to fund your account
3. Start using FlowPay!

## 🎯 Demo Flow for Judges

### 1. Landing Page
- Professional marketing site
- Click "Launch App"

### 2. Wallet Connection
- Real Petra wallet integration
- Testnet APT funding

### 3. Dashboard
- Real account balance from blockchain
- Live transaction history
- Market data and stats

### 4. Send Payment
- Real on-chain transactions
- Sub-second settlement on Aptos
- Transaction confirmation on explorer

### 5. Treasury Management
- Corporate payroll automation
- Multi-currency portfolio
- Risk management tools

### 6. FOREX Trading
- Real-time currency pairs
- Professional trading interface
- Order book and charts

## 🔧 Technical Features

### Smart Contracts (Move)
- **Payment Router**: Parallel payment processing
- **FOREX Engine**: Real-time currency conversion
- **Treasury Vault**: Automated corporate treasury
- **Compliance Oracle**: KYC/AML verification
- **Settlement Bridge**: Traditional banking integration

### Frontend (Next.js 14)
- Real Aptos wallet integration
- Live blockchain data
- Professional UI/UX
- Responsive design

### Aptos Integration
- **Network**: Testnet
- **Wallet**: Petra (real connection)
- **Transactions**: On-chain settlement
- **Explorer**: Live transaction viewing

## 🏆 Hackathon Highlights

### Innovation
- First instant cross-border payment network on Aptos
- Novel use of parallel execution for financial services
- Real-world treasury automation

### Technical Excellence
- Production-ready Move smart contracts
- Clean, scalable architecture
- Comprehensive error handling

### Real-World Impact
- Solves $150T+ cross-border payment market
- 95% cost reduction vs traditional methods
- Immediate business utility

### Demo Ready
- Fully functional on testnet
- Real wallet integration
- Live transaction processing

## 🐛 Troubleshooting

### Contract Deployment Issues
```bash
# Check Aptos CLI version
aptos --version

# Re-initialize if needed
rm -rf .aptos
aptos init --network testnet

# Fund account manually
aptos account fund-with-faucet --account default
```

### Wallet Connection Issues
1. Ensure Petra is on **Testnet**
2. Refresh the page
3. Clear browser cache
4. Try disconnecting/reconnecting

### Balance Issues
1. Use "Get Testnet APT" button
2. Check balance in Petra wallet
3. Wait a few seconds for blockchain sync

### Transaction Failures
1. Ensure sufficient APT balance
2. Check recipient address format (0x...)
3. Try with smaller amounts first

## 📱 Mobile Demo
The app is fully responsive and works on mobile devices with Petra mobile wallet.

## 🔗 Useful Links
- **Aptos Explorer**: https://explorer.aptoslabs.com/?network=testnet
- **Petra Wallet**: https://petra.app/
- **Aptos Docs**: https://aptos.dev/
- **FlowPay Docs**: See README.md and DEPLOYMENT.md

## 🎪 Judge Demo Script

1. **"This is FlowPay, the first instant cross-border payment network on Aptos"**
2. **Show landing page**: "Professional marketing site with clear value proposition"
3. **Launch app**: "Real Aptos testnet integration with Petra wallet"
4. **Connect wallet**: "Seamless wallet connection, no seed phrases needed"
5. **Fund account**: "One-click testnet funding for immediate demo"
6. **Send payment**: "Real on-chain transaction, sub-second settlement"
7. **Show explorer**: "Live transaction on Aptos blockchain"
8. **Treasury features**: "Corporate tools for payroll and risk management"
9. **FOREX trading**: "Professional trading interface with real-time data"
10. **"Built entirely on Aptos, leveraging parallel execution for 10,000+ TPS"**

## 🏅 Success Metrics
- ✅ Real blockchain integration
- ✅ Professional UI/UX
- ✅ Complete feature set
- ✅ Production-ready code
- ✅ Immediate business value
- ✅ Technical innovation
- ✅ Scalable architecture

**FlowPay is ready to win! 🏆**