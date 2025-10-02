# 🚀 FlowPay Deployment Guide

## Quick Start (Recommended)

### Step 1: Install Aptos CLI

**Option A: Direct Download**
1. Go to: https://github.com/aptos-labs/aptos-core/releases
2. Download: `aptos-cli-2.x.x-Windows-x86_64.zip` (latest version)
3. Extract and copy `aptos.exe` to `C:\aptos\bin\`
4. Add `C:\aptos\bin` to your Windows PATH
5. Open new PowerShell and test: `aptos --version`

**Option B: Using Package Manager**
```powershell
# If you have Chocolatey
choco install aptos-cli

# If you have Scoop  
scoop install aptos
```

### Step 2: Deploy FlowPay

Once Aptos CLI is installed, run our deployment script:

```powershell
.\deploy-simple.ps1
```

This will automatically:
- ✅ Initialize your Aptos testnet account
- ✅ Fund your account from the faucet
- ✅ Compile FlowPay smart contracts
- ✅ Deploy contracts to Aptos testnet
- ✅ Create `.env.local` with contract addresses

### Step 3: Start FlowPay

```powershell
npm install
npm run dev
```

Your FlowPay dApp will be live at: http://localhost:3000

---

## Manual Deployment (Alternative)

If the script doesn't work, follow these manual steps:

### 1. Initialize Aptos Account
```bash
aptos init --network testnet
```

### 2. Fund Account
```bash
aptos account fund-with-faucet --account default
```

### 3. Check Balance
```bash
aptos account list --query balance --account default
```

### 4. Compile Contracts
```bash
aptos move compile --named-addresses flowpay=default
```

### 5. Deploy Contracts
```bash
aptos move publish --named-addresses flowpay=default --assume-yes
```

### 6. Get Your Contract Address
```bash
aptos account list --query balance --account default
```
Copy the address (starts with 0x...)

### 7. Create .env.local File

Create `.env.local` in your project root:

```env
# Aptos Configuration
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
NEXT_PUBLIC_APTOS_FAUCET_URL=https://faucet.testnet.aptoslabs.com

# FlowPay Contract Addresses (replace YOUR_ADDRESS with your actual address)
NEXT_PUBLIC_FLOWPAY_PAYMENT_ROUTER=YOUR_ADDRESS
NEXT_PUBLIC_FLOWPAY_FOREX_ENGINE=YOUR_ADDRESS
NEXT_PUBLIC_FLOWPAY_TREASURY_VAULT=YOUR_ADDRESS
NEXT_PUBLIC_FLOWPAY_COMPLIANCE_ORACLE=YOUR_ADDRESS
NEXT_PUBLIC_FLOWPAY_SETTLEMENT_BRIDGE=YOUR_ADDRESS

# Development
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 8. Start FlowPay
```bash
npm install
npm run dev
```

---

## Troubleshooting

### "aptos command not found"
- Make sure Aptos CLI is installed and in your PATH
- Restart PowerShell after installation
- Try running from the directory where aptos.exe is located

### "Failed to compile contracts"
- Make sure you're in the FlowPay project directory
- Check that Move.toml exists in your project root
- Ensure all Move source files are in the `sources/` directory

### "Insufficient funds"
- Run the faucet command again: `aptos account fund-with-faucet --account default`
- Wait a few minutes and try again
- Check your balance: `aptos account list --query balance --account default`

### "Contract already exists"
- This is normal if you're redeploying
- The deployment will update your existing contracts

---

## What's Next?

After successful deployment:

1. **Test Payments**: Try sending test payments in the FlowPay interface
2. **Check Explorer**: View your contracts at https://explorer.aptoslabs.com
3. **Fund More**: Get more testnet APT from the faucet if needed
4. **Explore Features**: Try the treasury, FOREX, and wallet features

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify your .env.local file has the correct contract addresses
3. Make sure you have sufficient testnet APT
4. Restart your development server after deployment

🎉 **Congratulations!** Your FlowPay dApp is now live on Aptos Testnet!